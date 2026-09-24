import React from 'react';
import { Compass, CalendarDays, Shirt, MapPin, Sparkles, Navigation } from 'lucide-react';

interface NavbarProps {
  activeTab: 'journey' | 'itinerary' | 'weather' | 'map';
  setActiveTab: (tab: 'journey' | 'itinerary' | 'weather' | 'map') => void;
  nextStopTitle?: string;
  nextStopDistance?: string;
  onOpenAddModal: () => void;
  onOpenSmartImport: () => void;
  isGpsActive: boolean;
  isSimulated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  nextStopTitle,
  nextStopDistance,
  onOpenAddModal,
  onOpenSmartImport,
  isGpsActive,
  isSimulated,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('journey')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  彩虹特攻隊行程表
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  即時行程表
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-sm">
                國慶連假宜蘭三奇黃金稻浪・花蓮砂婆噹溪・白鮑溪戲水二日遊
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'journey'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              即時導覽
              {nextStopTitle && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'itinerary'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              行程規劃
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'weather'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              天氣與穿搭
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              地圖總覽
            </button>
          </nav>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSmartImport}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="貼上文字由 AI 自動分析轉換為行程"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">AI 智慧匯入</span>
              <span className="sm:hidden">匯入</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-3 py-1.5 rounded-lg shadow-sm shadow-orange-500/20 transition-all cursor-pointer"
            >
              <span>+</span>
              <span>新增景點</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for easy one-thumb mobile experience */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('journey')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'journey' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Navigation className="w-5 h-5 mb-0.5" />
          <span>即時行程</span>
        </button>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'itinerary' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span>行程清單</span>
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'weather' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Shirt className="w-5 h-5 mb-0.5" />
          <span>天氣穿搭</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'map' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>地圖</span>
        </button>
      </div>
    </header>
  );
};
