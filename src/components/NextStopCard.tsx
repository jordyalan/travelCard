import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  BookOpen,
  Volume2,
  Sparkles,
  ArrowRight,
  Car,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { ItineraryItem, UserLocation } from '../types/itinerary';
import { formatDistance } from '../utils/geoUtils';

interface NextStopCardProps {
  nextStop: ItineraryItem | null;
  followingStop: ItineraryItem | null;
  userLocation: UserLocation | null;
  onOpenGuide: (item: ItineraryItem) => void;
  onMarkComplete: (id: string) => void;
  onPlayQuickAudio: (item: ItineraryItem) => void;
  isAudioPlaying?: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  culture: { label: '人文古蹟', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  food: { label: '特色美食', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  scenic: { label: '觀光風景', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  shopping: { label: '商圈購物', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  nature: { label: '自然步道', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  entertainment: { label: '休閒娛樂', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  other: { label: '其他景點', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export const NextStopCard: React.FC<NextStopCardProps> = ({
  nextStop,
  followingStop,
  userLocation,
  onOpenGuide,
  onMarkComplete,
  onPlayQuickAudio,
  isAudioPlaying,
}) => {
  if (!nextStop) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-8 text-center shadow-xs">
        <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">🎉 今日行程全部完成！</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          您已順利走訪今日所有的精采景點。辛苦了！好好享受休息時間，或點擊上方「新增景點」繼續下一段旅程。
        </p>
      </div>
    );
  }

  const categoryConfig = CATEGORY_STYLES[nextStop.category] || CATEGORY_STYLES.other;
  const isCloseProximity = (nextStop.distanceMeters ?? 99999) < 400;

  const handleOpenGoogleMaps = () => {
    // Open driving mode directly as requested
    const url = `https://www.google.com/maps/dir/?api=1&destination=${nextStop.lat},${nextStop.lng}&destination_place_id=&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-orange-500/5 mb-8">
      {/* Top Accent Gradient Bar */}
      <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

      <div className="p-5 sm:p-7">
        {/* Badge & Schedule status */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 shadow-xs animate-pulse">
              <Compass className="w-3.5 h-3.5" />
              接下來的行程 · NEXT STOP
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryConfig.bg} ${categoryConfig.text} ${categoryConfig.border}`}
            >
              {categoryConfig.label}
            </span>
          </div>

          {/* Automatic GPS arrival time & driving duration */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/90 px-3 py-1.5 rounded-xl shadow-xs">
            <Car className="w-4 h-4 text-orange-600" />
            <span>預計到達：約 {nextStop.estimatedArrivalTime || '--'}</span>
            <span className="text-orange-300">|</span>
            <span className="text-orange-700">行車約 {nextStop.estimatedDriveMinutes ?? 1} 分鐘</span>
          </div>
        </div>

        {/* Spot Title & Location */}
        <div className="mb-5">
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 hover:text-orange-600 transition-colors cursor-pointer"
            onClick={() => onOpenGuide(nextStop)}
          >
            {nextStop.title}
          </h2>
          <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-500">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{nextStop.location}</span>
          </div>
        </div>

        {/* Live Distance & Drive ETA Meter Bar */}
        <div
          className={`p-4 rounded-2xl mb-5 transition-all ${
            isCloseProximity
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-gradient-to-r from-amber-50/70 to-orange-50/70 border border-amber-200/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isCloseProximity
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                }`}
              >
                {isCloseProximity ? (
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                ) : (
                  <Car className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-600">目前行車距離：</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {formatDistance(nextStop.distanceMeters)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>
                    GPS 即時推算所需行車時間：約 {nextStop.estimatedDriveMinutes ?? 1} 分鐘（預計 {nextStop.estimatedArrivalTime} 抵達）
                  </span>
                </div>
              </div>
            </div>

            {isCloseProximity && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs animate-bounce">
                <span>📍 您已抵達景點周邊！</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Notes / Highlights */}
        {nextStop.notes && (
          <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-6 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900">隨行備註：</strong>
              {nextStop.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. View Attraction Guide */}
          <button
            onClick={() => onOpenGuide(nextStop)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>查看景點介紹</span>
          </button>

          {/* 2. Open Driving Map Navigation */}
          <button
            onClick={handleOpenGoogleMaps}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-sky-600" />
            <span>行車導航 (Google Maps)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* 3. Mark Complete */}
          <button
            onClick={() => onMarkComplete(nextStop.id)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>已抵達 / 前往下一站</span>
          </button>
        </div>

        {/* Next Subsequent Stop preview teaser */}
        {followingStop && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">更後續行程：</span>
              <span className="font-medium text-slate-700">{followingStop.title}</span>
              <span className="text-orange-600 font-bold">
                (預計 {followingStop.estimatedArrivalTime} 抵達 · 車程約 {followingStop.estimatedDriveMinutes} 分)
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 font-medium">
              <span>查看路線</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
