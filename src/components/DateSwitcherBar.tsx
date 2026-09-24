import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { formatDateDisplay, getTodayDateString } from '../utils/dateUtils';

interface DateSwitcherBarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableDates: string[];
  totalStopsOnSelectedDate: number;
  onJumpToToday: () => void;
}

export const DateSwitcherBar: React.FC<DateSwitcherBarProps> = ({
  selectedDate,
  onSelectDate,
  availableDates,
  totalStopsOnSelectedDate,
  onJumpToToday,
}) => {
  const todayStr = getTodayDateString();
  const isSelectedToday = selectedDate === todayStr;
  const currentFormat = formatDateDisplay(selectedDate);
  const todayFormat = formatDateDisplay(todayStr);

  // Ensure availableDates includes selectedDate and todayStr, sorted ascending
  const uniqueDates = Array.from(new Set([...availableDates, todayStr, selectedDate])).sort();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Title & Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isSelectedToday
                ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {currentFormat.full}
              </h3>
              {isSelectedToday ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-pulse">
                  <Sparkles className="w-3 h-3 text-orange-600" />
                  今日行程
                </span>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {currentFormat.relative}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              {isSelectedToday ? (
                <span>⚡ 系統已自動取得當下日期，為您載入今日即時行程（共 {totalStopsOnSelectedDate} 站）</span>
              ) : (
                <span>正在瀏覽其他日期的規劃（當日共 {totalStopsOnSelectedDate} 站）</span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls: Quick Jump to Today & Calendar input */}
        <div className="flex flex-wrap items-center gap-2">
          {!isSelectedToday && (
            <button
              onClick={onJumpToToday}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>自動切換至今日 ({todayFormat.short})</span>
            </button>
          )}

          {/* Date Picker Input */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDate(e.target.value);
                }
              }}
              className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Date Pill Tabs for Fast Switching */}
      <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 font-semibold shrink-0 mr-1">選擇日期：</span>
        {uniqueDates.map((dStr) => {
          const isDateActive = dStr === selectedDate;
          const isDateToday = dStr === todayStr;
          const info = formatDateDisplay(dStr);

          return (
            <button
              key={dStr}
              onClick={() => onSelectDate(dStr)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isDateActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : isDateToday
                  ? 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{info.short}</span>
              {isDateToday && (
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-extrabold ${
                    isDateActive ? 'bg-orange-500 text-white' : 'bg-orange-200 text-orange-900'
                  }`}
                >
                  今天
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
