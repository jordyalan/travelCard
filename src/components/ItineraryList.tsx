import React from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Trash2,
  ArrowUp,
  ArrowDown,
  Navigation,
  Sparkles,
  Plus,
  Compass,
  Car,
} from 'lucide-react';
import { ItineraryItem, UserLocation } from '../types/itinerary';
import { formatDistance } from '../utils/geoUtils';

interface ItineraryListProps {
  items: ItineraryItem[];
  nextStopId: string | null;
  userLocation: UserLocation | null;
  onOpenGuide: (item: ItineraryItem) => void;
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (index: number, direction: 'up' | 'down') => void;
  onOpenAddModal: () => void;
  onOpenSmartImport: () => void;
  onSelectDemoPlan: (planId: string) => void;
  selectedPlanId: string;
}

const CATEGORY_TAGS: Record<string, { label: string; color: string }> = {
  culture: { label: '人文古蹟', color: 'bg-amber-100 text-amber-800' },
  food: { label: '特色美食', color: 'bg-orange-100 text-orange-800' },
  scenic: { label: '觀光風景', color: 'bg-sky-100 text-sky-800' },
  shopping: { label: '商圈購物', color: 'bg-purple-100 text-purple-800' },
  nature: { label: '自然步道', color: 'bg-emerald-100 text-emerald-800' },
  entertainment: { label: '休閒娛樂', color: 'bg-pink-100 text-pink-800' },
  other: { label: '其他', color: 'bg-slate-100 text-slate-800' },
};

export const ItineraryList: React.FC<ItineraryListProps> = ({
  items,
  nextStopId,
  userLocation,
  onOpenGuide,
  onToggleComplete,
  onDeleteItem,
  onMoveItem,
  onOpenAddModal,
  onOpenSmartImport,
  onSelectDemoPlan,
  selectedPlanId,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header & Demo Plan Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              當日完整行程規劃
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
              共 {items.length} 站
            </span>
          </div>
          <p className="text-xs text-slate-500">
            依照即時手機 GPS 自動計算所需行車時間與預計到達時間，可自由調整造訪先後順序
          </p>
        </div>

        {/* Demo Selector and Add buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPlanId}
            onChange={(e) => onSelectDemoPlan(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="tokyo-classic">🇯🇵 東京經典一日遊</option>
            <option value="taipei-cultural">🇹🇼 台北文青散策一日遊</option>
            <option value="kyoto-heritage">🇯🇵 京都古都世界遺產</option>
            <option value="custom">✍️ 我的自訂行程</option>
          </select>

          <button
            onClick={onOpenSmartImport}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI 貼上匯入</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增站點</span>
          </button>
        </div>
      </div>

      {/* Itinerary Timeline List */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700 mb-1">目前尚無行程安排</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            您可以手動新增第一個想去的景點，或是使用「AI 貼上匯入」直接貼上您的旅行筆記。
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={onOpenSmartImport}
              className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-600 cursor-pointer"
            >
              AI 匯入行程
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              手動新增
            </button>
          </div>
        </div>
      ) : (
        <div className="relative pl-4 sm:pl-6 space-y-4">
          {/* Vertical Connecting Line */}
          <div className="absolute top-4 bottom-4 left-6 sm:left-8 w-0.5 bg-gradient-to-b from-orange-400 via-amber-300 to-slate-200" />

          {items.map((item, index) => {
            const isNext = item.id === nextStopId;
            const isCompleted = !!item.completed;
            const tag = CATEGORY_TAGS[item.category] || CATEGORY_TAGS.other;

            return (
              <div
                key={item.id}
                className={`relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl transition-all ${
                  isNext
                    ? 'bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-white border-2 border-orange-400 shadow-md shadow-orange-500/10'
                    : isCompleted
                    ? 'bg-slate-50/80 border border-slate-200 opacity-60'
                    : 'bg-white border border-slate-200/90 hover:border-orange-200 shadow-xs'
                }`}
              >
                {/* Timeline Node Badge */}
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform hover:scale-105 cursor-pointer shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isNext
                      ? 'bg-orange-500 text-white ring-4 ring-orange-200 animate-pulse'
                      : 'bg-white text-slate-700 border border-slate-300 hover:border-orange-400'
                  }`}
                  title={isCompleted ? '標記為未完成' : '標記為已完成'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Stop Main Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tag.color}`}>
                        {tag.label}
                      </span>
                      {isNext && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-600 text-white animate-pulse">
                          下一個目的地
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          已走訪
                        </span>
                      )}
                    </div>

                    {/* Automatic GPS Arrival & Driving Time */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 bg-orange-50/80 px-2.5 py-1 rounded-lg border border-orange-100">
                      <Car className="w-3.5 h-3.5 text-orange-600" />
                      <span>預計到達：{item.estimatedArrivalTime || '--'}</span>
                      {item.estimatedDriveMinutes !== undefined && item.estimatedDriveMinutes > 0 && (
                        <>
                          <span className="text-orange-300">·</span>
                          <span className="text-orange-700">車程約 {item.estimatedDriveMinutes} 分鐘</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <h4
                    onClick={() => onOpenGuide(item)}
                    className={`text-base sm:text-lg font-extrabold tracking-tight transition-colors cursor-pointer hover:text-orange-600 ${
                      isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Distance from GPS & Driving duration */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    <div className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Navigation className="w-3 h-3 text-orange-600" />
                      <span>目前距離：{formatDistance(item.distanceMeters)}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-slate-600 font-medium">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span>行車時間：約 {item.estimatedDriveMinutes ?? 1} 分鐘</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      💡 {item.notes}
                    </p>
                  )}

                  {/* Item Actions */}
                  <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => onOpenGuide(item)}
                      className="flex items-center gap-1.5 font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>景點導覽介紹</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        onClick={() => onMoveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="上移順序"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => onMoveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="下移順序"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                        title="刪除此景點"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
