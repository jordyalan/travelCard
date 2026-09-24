import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  Cloud,
  Thermometer,
  Umbrella,
  Wind,
  Droplets,
  ShieldAlert,
  Sparkles,
  Shirt,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { OutfitRecommendation, WeatherData } from '../types/itinerary';
import { fetchOutfitRecommendation } from '../services/apiService';

interface WeatherOutfitCardProps {
  weather: WeatherData | null;
  isLoadingWeather: boolean;
  onRefreshWeather: () => void;
  currentSpotTitle?: string;
  upcomingSpotsTitles?: string[];
}

export const WeatherOutfitCard: React.FC<WeatherOutfitCardProps> = ({
  weather,
  isLoadingWeather,
  onRefreshWeather,
  currentSpotTitle,
  upcomingSpotsTitles,
}) => {
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [loadingOutfit, setLoadingOutfit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendation = () => {
    if (!weather) return;
    setLoadingOutfit(true);
    setError(null);

    fetchOutfitRecommendation(weather, currentSpotTitle, upcomingSpotsTitles)
      .then((data) => {
        setRecommendation(data);
        setLoadingOutfit(false);
      })
      .catch((err) => {
        setError(err.message || '產生穿搭建議失敗');
        setLoadingOutfit(false);
      });
  };

  useEffect(() => {
    if (weather && !recommendation) {
      loadRecommendation();
    }
  }, [weather]);

  const getWeatherIcon = (code?: number) => {
    if (!code && code !== 0) return <CloudSun className="w-8 h-8 text-amber-500" />;
    if (code === 0) return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
    if (code <= 3) return <CloudSun className="w-8 h-8 text-amber-500" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-sky-500" />;
    if (code >= 80) return <CloudRain className="w-8 h-8 text-indigo-500" />;
    return <Cloud className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Weather Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-7 shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                即時氣象監測 · LIVE WEATHER
              </span>
            </div>

            <button
              onClick={onRefreshWeather}
              disabled={isLoadingWeather}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
              <span>更新天氣</span>
            </button>
          </div>

          {weather ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Main Temp & Condition */}
              <div className="md:col-span-6 flex items-center gap-5">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner">
                  {getWeatherIcon(weather.weatherCode)}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">
                      {weather.temperature}°C
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      體感 {weather.apparentTemperature}°C
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-amber-300 mt-1">
                    {weather.condition}
                  </p>
                </div>
              </div>

              {/* Weather Indicators */}
              <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Rain */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <div className="flex items-center justify-center text-sky-300 mb-1">
                    <Umbrella className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">降雨機率</span>
                  <span className="text-xs sm:text-sm font-bold">{weather.rainProbability}%</span>
                </div>

                {/* Humidity */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <div className="flex items-center justify-center text-teal-300 mb-1">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">濕度</span>
                  <span className="text-xs sm:text-sm font-bold">{weather.humidity}%</span>
                </div>

                {/* UV Index */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <div className="flex items-center justify-center text-amber-300 mb-1">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">紫外線 UV</span>
                  <span className="text-xs sm:text-sm font-bold">級數 {weather.uvIndex}</span>
                </div>

                {/* Wind */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 text-center">
                  <div className="flex items-center justify-center text-indigo-300 mb-1">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">風速</span>
                  <span className="text-xs sm:text-sm font-bold">{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              正在讀取精準氣象資訊中...
            </div>
          )}

          {/* Hourly Forecast strip */}
          {weather?.hourly && weather.hourly.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2.5">
                接下來幾小時氣溫預報：
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {weather.hourly.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[70px] bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-2 text-center border border-white/5"
                  >
                    <span className="text-[11px] text-slate-400 block font-mono">{h.time}</span>
                    <span className="text-xs font-bold text-white block mt-0.5">{h.temp}°</span>
                    <span className="text-[10px] text-sky-300 block mt-0.5">☔ {h.pop}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. AI Weather Outfit Recommendation Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-orange-500/5 overflow-hidden">
        {/* Card Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-r from-orange-50/60 via-amber-50/30 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  AI 時尚與機能顧問
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                  Gemini 3.8
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                今日氣候智慧穿搭指南
              </h3>
            </div>
          </div>

          <button
            onClick={loadRecommendation}
            disabled={loadingOutfit}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOutfit ? 'animate-spin' : ''}`} />
            <span>重新分析穿搭</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7">
          {loadingOutfit ? (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-orange-500 animate-spin-slow mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">
                AI 正在綜合氣溫、濕度、紫外線與景點活動計算最舒適裝扮...
              </p>
              <p className="text-xs text-slate-400 mt-1">考慮健走步行、戶外與室內切換之需求</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <p className="font-semibold">{error}</p>
              <button
                onClick={loadRecommendation}
                className="mt-2 text-xs font-bold text-rose-700 underline"
              >
                重試
              </button>
            </div>
          ) : recommendation ? (
            <div className="space-y-6">
              {/* Highlight Headline */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80">
                <h4 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                  ✨ {recommendation.headline}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {recommendation.summary}
                </p>

                {/* Style Tags */}
                {recommendation.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {recommendation.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 text-orange-800 border border-orange-200 shadow-2xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Detailed Outfit Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Top */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        上
                      </span>
                      上身穿著 (TOP)
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {recommendation.outfit.top}
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                        下
                      </span>
                      下身褲裝 (BOTTOM)
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {recommendation.outfit.bottom}
                    </p>
                  </div>
                </div>

                {/* Outerwear */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        外
                      </span>
                      外套保暖 (OUTERWEAR)
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {recommendation.outfit.outerwear}
                    </p>
                  </div>
                </div>

                {/* Shoes */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        鞋
                      </span>
                      適合鞋款 (SHOES)
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {recommendation.outfit.shoes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accessories Checklist */}
              {recommendation.outfit.accessories?.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                    🎒 建議隨身裝備與配件清單
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.outfit.accessories.map((acc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-xs font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{acc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Travel Tips */}
              {recommendation.practicalTips?.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <h5 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    氣候溫差與場域穿著叮嚀
                  </h5>
                  <div className="space-y-1.5">
                    {recommendation.practicalTips.map((tip, idx) => (
                      <p key={idx} className="text-xs text-amber-950 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
