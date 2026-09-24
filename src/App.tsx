/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Compass,
  MapPin,
  CalendarDays,
  Shirt,
  Navigation,
  Sparkles,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ItineraryItem, UserLocation, WeatherData } from './types/itinerary';
import { DEMO_ITINERARIES, getCuratedDemoPlans } from './data/demoItineraries';
import { calculateDistanceMeters, formatDistance, computeDynamicSchedule } from './utils/geoUtils';
import { getTodayDateString } from './utils/dateUtils';
import { fetchWeather } from './services/weatherService';

import { Navbar } from './components/Navbar';
import { GpsStatusBanner } from './components/GpsStatusBanner';
import { DateSwitcherBar } from './components/DateSwitcherBar';
import { NextStopCard } from './components/NextStopCard';
import { ItineraryList } from './components/ItineraryList';
import { WeatherOutfitCard } from './components/WeatherOutfitCard';
import { MapView } from './components/MapView';
import { AttractionModal } from './components/AttractionModal';
import { AddItineraryModal } from './components/AddItineraryModal';
import { SmartImportModal } from './components/SmartImportModal';

const STORAGE_KEY_ITEMS = 'travelmate_itinerary_items_v2';
const STORAGE_KEY_PLAN = 'travelmate_selected_plan_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<'journey' | 'itinerary' | 'weather' | 'map'>('journey');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PLAN) || 'yilan-hualien';
  });

  const [items, setItems] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If already saved with Yilan/Hualien items or custom, keep them
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved itinerary', e);
      }
    }
    const freshPlans = getCuratedDemoPlans();
    const defaultPlan = freshPlans.find((p) => p.id === 'yilan-hualien') || freshPlans[0];
    return defaultPlan.items;
  });

  // Automatically detect user's current date and set as active itinerary date
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = getTodayDateString();
    const freshPlans = getCuratedDemoPlans();
    const defaultPlan = freshPlans.find((p) => p.id === 'yilan-hualien') || freshPlans[0];
    const hasToday = defaultPlan.items.some((i) => i.date === today);
    return hasToday ? today : (defaultPlan.initialDate || today);
  });

  // User location state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Real-time clock ticker to keep ETA and arrival times live
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Modals state
  const [selectedAttraction, setSelectedAttraction] = useState<ItineraryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSmartImportOpen, setIsSmartImportOpen] = useState<boolean>(false);

  // Persist items to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAN, selectedPlanId);
  }, [selectedPlanId]);

  // Request user real GPS location
  const fetchRealGps = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('您的瀏覽器不支援 GPS 定位');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
          isSimulated: false,
          cityName: '真實手機 GPS 位置',
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS location denied or unavailable:', err.message);
        setGpsError(err.code === 1 ? '未開啟定位權限，已切換至預設位置' : '無法獲取精確 GPS');
        setIsLocating(false);

        // Fallback to demo default location
        if (!userLocation) {
          const currentPlan = DEMO_ITINERARIES.find((p) => p.id === selectedPlanId) || DEMO_ITINERARIES[0];
          setUserLocation({
            lat: currentPlan.defaultLat,
            lng: currentPlan.defaultLng,
            accuracy: 15,
            timestamp: Date.now(),
            isSimulated: true,
            cityName: currentPlan.cityName,
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );
  }, [selectedPlanId, userLocation]);

  // Initial GPS positioning
  useEffect(() => {
    fetchRealGps();

    // Listen for GPS updates if available
    let watchId: number | null = null;
    if ('geolocation' in navigator) {
      try {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setUserLocation((prev) => {
              // Only update if not currently in simulated mode
              if (prev?.isSimulated) return prev;
              return {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp,
                isSimulated: false,
                cityName: '真實手機 GPS 位置',
              };
            });
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 15000, timeout: 12000 }
        );
      } catch (e) {
        console.warn('Watch position error', e);
      }
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Update weather whenever location changes
  useEffect(() => {
    const lat = userLocation?.lat ?? items[0]?.lat;
    const lng = userLocation?.lng ?? items[0]?.lng;

    if (lat && lng) {
      setIsLoadingWeather(true);
      fetchWeather(lat, lng)
        .then((data) => {
          setWeather(data);
          setIsLoadingWeather(false);
        })
        .catch((e) => {
          console.error('Weather load error:', e);
          setIsLoadingWeather(false);
        });
    }
  }, [userLocation?.lat, userLocation?.lng, items]);

  // List of all unique dates present in the current itinerary plus today
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    const today = getTodayDateString();
    dates.add(today);
    items.forEach((item) => {
      if (item.date) dates.add(item.date);
    });
    return Array.from(dates).sort();
  }, [items]);

  // Fast switch to today's date
  const handleJumpToToday = useCallback(() => {
    const today = getTodayDateString();
    setSelectedDate(today);
  }, []);

  // Filter items for the currently active date
  const dayItems = useMemo(() => {
    const today = getTodayDateString();
    return items.filter((item) => {
      if (!item.date) return selectedDate === today;
      return item.date === selectedDate;
    });
  }, [items, selectedDate]);

  // Automatically compute dynamic schedule (driving time, estimated arrival time) from GPS for active date
  const itemsWithDistance = useMemo(() => {
    if (!userLocation) return dayItems;
    return computeDynamicSchedule(dayItems, userLocation.lat, userLocation.lng, currentTime);
  }, [dayItems, userLocation, currentTime]);

  // Identify next stop (the first uncompleted stop for current date)
  const nextStop = useMemo(() => {
    return itemsWithDistance.find((item) => !item.completed) || null;
  }, [itemsWithDistance]);

  // Identify following stop (the stop right after nextStop)
  const followingStop = useMemo(() => {
    if (!nextStop) return null;
    const nextIndex = itemsWithDistance.findIndex((item) => item.id === nextStop.id);
    if (nextIndex >= 0 && nextIndex < itemsWithDistance.length - 1) {
      return itemsWithDistance[nextIndex + 1];
    }
    return null;
  }, [itemsWithDistance, nextStop]);

  // Handlers
  const handleMarkComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: true } : item))
    );
  };

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetDayIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetDayIndex < 0 || targetDayIndex >= dayItems.length) return;

    const currentItem = dayItems[index];
    const targetItem = dayItems[targetDayIndex];

    setItems((prev) => {
      const idx1 = prev.findIndex((i) => i.id === currentItem.id);
      const idx2 = prev.findIndex((i) => i.id === targetItem.id);
      if (idx1 === -1 || idx2 === -1) return prev;
      const copy = [...prev];
      copy[idx1] = targetItem;
      copy[idx2] = currentItem;
      return copy;
    });
  };

  const handleAddItem = (
    newItem: Omit<ItineraryItem, 'id' | 'completed' | 'distanceMeters'>
  ) => {
    const item: ItineraryItem = {
      ...newItem,
      id: `custom-item-${Date.now()}`,
      date: newItem.date || selectedDate,
      completed: false,
    };
    setItems((prev) => [...prev, item]);
  };

  const handleSmartImport = (importedItems: ItineraryItem[], title?: string) => {
    const tagged = importedItems.map((item) => ({
      ...item,
      date: item.date || selectedDate,
    }));
    setItems((prev) => [...prev, ...tagged]);
    setSelectedPlanId('custom');
    if (tagged.length > 0) {
      // Auto move simulated location near first spot to see distance
      setUserLocation({
        lat: tagged[0].lat - 0.003,
        lng: tagged[0].lng - 0.002,
        accuracy: 10,
        timestamp: Date.now(),
        isSimulated: true,
        cityName: title || '自訂匯入行程起點',
      });
    }
  };

  const handleSelectDemoPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const plans = getCuratedDemoPlans();
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setItems(plan.items);
      const today = getTodayDateString();
      const hasToday = plan.items.some((i) => i.date === today);
      setSelectedDate(hasToday ? today : (plan.initialDate || today));
      setUserLocation({
        lat: plan.defaultLat,
        lng: plan.defaultLng,
        accuracy: 10,
        timestamp: Date.now(),
        isSimulated: true,
        cityName: plan.cityName,
      });
    }
  };

  // Simulation: Move near next stop (approx 350 meters away)
  const handleSimulateNearNextStop = () => {
    const target = nextStop || items[0];
    if (!target) return;

    setUserLocation({
      lat: target.lat - 0.0025,
      lng: target.lng - 0.002,
      accuracy: 8,
      timestamp: Date.now(),
      isSimulated: true,
      cityName: `模擬在【${target.title}】附近`,
    });
    setGpsError(null);
  };

  const handleRefreshWeather = () => {
    const lat = userLocation?.lat ?? items[0]?.lat;
    const lng = userLocation?.lng ?? items[0]?.lng;
    if (lat && lng) {
      setIsLoadingWeather(true);
      fetchWeather(lat, lng).then((data) => {
        setWeather(data);
        setIsLoadingWeather(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-10">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nextStopTitle={nextStop?.title}
        nextStopDistance={formatDistance(nextStop?.distanceMeters)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSmartImport={() => setIsSmartImportOpen(true)}
        isGpsActive={!!userLocation}
        isSimulated={!!userLocation?.isSimulated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5">
        {/* GPS Live Status Bar */}
        <GpsStatusBanner
          userLocation={userLocation}
          isLocating={isLocating}
          gpsError={gpsError}
          onRefreshGps={fetchRealGps}
          onSimulateNearNextStop={handleSimulateNearNextStop}
          onSwitchToRealGps={fetchRealGps}
          nextStopTitle={nextStop?.title}
        />

        {/* Date Auto-Detection & Switcher Bar */}
        <DateSwitcherBar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          availableDates={availableDates}
          totalStopsOnSelectedDate={dayItems.length}
          onJumpToToday={handleJumpToToday}
        />

        {/* Tab 1: Live Journey (即時導覽 & 下一個行程) */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            {/* Hero Next Stop Card */}
            <NextStopCard
              nextStop={nextStop}
              followingStop={followingStop}
              userLocation={userLocation}
              onOpenGuide={(item) => setSelectedAttraction(item)}
              onMarkComplete={handleMarkComplete}
              onPlayQuickAudio={(item) => setSelectedAttraction(item)}
            />

            {/* Quick Two-Column View: Weather Snippet & Mini Route Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Mini Map */}
              <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <h3 className="text-base font-extrabold text-slate-900">即時路徑與景點分布</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>全螢幕地圖</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <MapView
                  items={itemsWithDistance}
                  userLocation={userLocation}
                  nextStopId={nextStop?.id || null}
                  onOpenGuide={(item) => setSelectedAttraction(item)}
                />
              </div>

              {/* Weather & Outfit Teaser */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      目前氣候與穿搭快報
                    </div>
                    <button
                      onClick={() => setActiveTab('weather')}
                      className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      查看詳細建議
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-black">
                      {weather?.temperature ?? 24}°C
                    </span>
                    <span className="text-sm font-semibold text-slate-300">
                      {weather?.condition ?? '舒適多雲'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-white/10 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">降雨機率</span>
                      <span className="font-bold text-sky-300">{weather?.rainProbability ?? 15}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">體感溫度</span>
                      <span className="font-bold text-amber-300">{weather?.apparentTemperature ?? 24}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">紫外線</span>
                      <span className="font-bold text-teal-300">UV {weather?.uvIndex ?? 4}</span>
                    </div>
                  </div>

                  <div className="mt-3 bg-white/10 p-3 rounded-2xl text-xs text-slate-200 leading-relaxed">
                    <p className="font-bold text-white mb-1">👔 今日穿搭亮點：</p>
                    <p className="line-clamp-2">
                      氣候舒適微風，洋蔥式穿法最合適。建議著輕便休閒服與透氣運動鞋，隨身攜帶薄外套與晴雨兩用摺傘。
                    </p>
                  </div>
                </div>

                {/* Remaining stops summary list */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-orange-500" />
                        後續景點清單 ({itemsWithDistance.filter((i) => !i.completed).length} 站未完)
                      </h4>
                      <button
                        onClick={() => setActiveTab('itinerary')}
                        className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                      >
                        管理行程
                      </button>
                    </div>

                    <div className="space-y-2">
                      {itemsWithDistance
                        .filter((i) => !i.completed && i.id !== nextStop?.id)
                        .slice(0, 3)
                        .map((item, idx) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedAttraction(item)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/60 border border-slate-100 transition-colors cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {idx + 2}
                              </span>
                              <span className="font-bold text-slate-800 truncate">{item.title}</span>
                            </div>
                            <span className="text-slate-400 font-mono shrink-0 ml-2">
                              {formatDistance(item.distanceMeters)}
                            </span>
                          </div>
                        ))}

                      {itemsWithDistance.filter((i) => !i.completed && i.id !== nextStop?.id).length === 0 && (
                        <p className="text-xs text-slate-400 py-3 text-center">
                          暫無其他待辦景點
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-orange-300 hover:border-orange-500 text-orange-600 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>手動新增更多景點</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Itinerary Schedule (行程清單) */}
        {activeTab === 'itinerary' && (
          <ItineraryList
            items={itemsWithDistance}
            nextStopId={nextStop?.id || null}
            userLocation={userLocation}
            selectedDate={selectedDate}
            onOpenGuide={(item) => setSelectedAttraction(item)}
            onToggleComplete={handleToggleComplete}
            onDeleteItem={handleDeleteItem}
            onMoveItem={handleMoveItem}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenSmartImport={() => setIsSmartImportOpen(true)}
            onSelectDemoPlan={handleSelectDemoPlan}
            selectedPlanId={selectedPlanId}
          />
        )}

        {/* Tab 3: Weather & AI Outfit Stylist (天氣與穿搭顧問) */}
        {activeTab === 'weather' && (
          <WeatherOutfitCard
            weather={weather}
            isLoadingWeather={isLoadingWeather}
            onRefreshWeather={handleRefreshWeather}
            currentSpotTitle={nextStop?.title}
            upcomingSpotsTitles={itemsWithDistance
              .filter((i) => !i.completed)
              .map((i) => i.title)}
          />
        )}

        {/* Tab 4: Interactive Map View (地圖總覽) */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  互動式全景地圖導覽
                </h3>
                <p className="text-xs text-slate-500">
                  點擊地圖上的景點圖標可直接查看該景點詳細介紹與門票資訊
                </p>
              </div>
              <button
                onClick={fetchRealGps}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>刷新定位</span>
              </button>
            </div>

            <MapView
              items={itemsWithDistance}
              userLocation={userLocation}
              nextStopId={nextStop?.id || null}
              onOpenGuide={(item) => setSelectedAttraction(item)}
            />
          </div>
        )}
      </main>

      {/* Attraction Detail Guide Modal */}
      <AttractionModal
        item={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />

      {/* Manual Add Item Modal */}
      <AddItineraryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        defaultDate={selectedDate}
        referenceLat={userLocation?.lat}
        referenceLng={userLocation?.lng}
      />

      {/* AI Smart Import Modal */}
      <SmartImportModal
        isOpen={isSmartImportOpen}
        onClose={() => setIsSmartImportOpen(false)}
        onImport={handleSmartImport}
        defaultDate={selectedDate}
      />
    </div>
  );
}
