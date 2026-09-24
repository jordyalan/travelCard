import React from 'react';
import { Crosshair, MapPin, Radio, RefreshCw, AlertCircle } from 'lucide-react';
import { UserLocation } from '../types/itinerary';

interface GpsStatusBannerProps {
  userLocation: UserLocation | null;
  isLocating: boolean;
  gpsError: string | null;
  onRefreshGps: () => void;
  onSimulateNearNextStop: () => void;
  onSwitchToRealGps: () => void;
  nextStopTitle?: string;
}

export const GpsStatusBanner: React.FC<GpsStatusBannerProps> = ({
  userLocation,
  isLocating,
  gpsError,
  onRefreshGps,
  onSimulateNearNextStop,
  onSwitchToRealGps,
  nextStopTitle,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 px-4 py-2.5 rounded-2xl shadow-sm mb-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Left Status info */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                userLocation?.isSimulated
                  ? 'bg-amber-400'
                  : userLocation
                  ? 'bg-emerald-400'
                  : 'bg-rose-400'
              }`}
            />
            {(!userLocation?.isSimulated && userLocation) && (
              <span className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold text-slate-200">
              {isLocating
                ? '正在獲取手機 GPS 定位...'
                : userLocation?.isSimulated
                ? '模擬定位模式'
                : userLocation
                ? '即時手機 GPS 連線中'
                : '尚未獲取定位'}
            </span>

            {userLocation && (
              <span className="text-slate-400 font-mono text-[11px]">
                ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                {userLocation.accuracy ? ` · 精確度 ±${Math.round(userLocation.accuracy)}m` : ''}
              </span>
            )}

            {userLocation?.cityName && (
              <span className="inline-flex items-center gap-0.5 text-amber-300 font-medium bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                <MapPin className="w-3 h-3" />
                {userLocation.cityName}
              </span>
            )}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {gpsError && (
            <div className="flex items-center gap-1 text-rose-400 text-[11px] bg-rose-950/40 px-2 py-1 rounded-md">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{gpsError}</span>
            </div>
          )}

          <button
            onClick={onRefreshGps}
            disabled={isLocating}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="重新讀取目前手機 GPS 位置"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
            <span>重新定位</span>
          </button>

          {userLocation?.isSimulated ? (
            <button
              onClick={onSwitchToRealGps}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
              title="切換回真實手機 GPS 定位"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>切換真實 GPS</span>
            </button>
          ) : (
            <button
              onClick={onSimulateNearNextStop}
              className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="模擬移至下個景點附近 (約500公尺)，測試接近提醒與導航"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>模擬在景點旁</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
