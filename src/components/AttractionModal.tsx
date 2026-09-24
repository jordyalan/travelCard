import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Ticket,
  Camera,
  Utensils,
  AlertCircle,
  Volume2,
  VolumeX,
  Navigation,
  ExternalLink,
  Check,
  Share2,
  Loader2,
  Car,
} from 'lucide-react';
import { AttractionGuide, ItineraryItem } from '../types/itinerary';
import { fetchAttractionGuide } from '../services/apiService';

interface AttractionModalProps {
  item: ItineraryItem | null;
  onClose: () => void;
}

export const AttractionModal: React.FC<AttractionModalProps> = ({ item, onClose }) => {
  const [guide, setGuide] = useState<AttractionGuide | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!item) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setIsPlayingAudio(false);
    window.speechSynthesis?.cancel();

    fetchAttractionGuide(item.title, item.location)
      .then((data) => {
        if (isMounted) {
          setGuide(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || '景點介紹讀取失敗');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      window.speechSynthesis?.cancel();
    };
  }, [item]);

  const handleToggleSpeech = () => {
    if (!guide?.audioGuide && !guide?.summary) return;

    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis?.cancel();
      const textToSpeak = guide.audioGuide || guide.summary;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis?.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyShare = () => {
    if (!item) return;
    const text = `【${item.title}】景點資訊\n地址：${item.location}\n特色：${guide?.summary || item.notes || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNavigation = () => {
    if (!item) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header with Title & Action */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-white flex items-center justify-between">
          <div className="pr-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                景點深度導覽
              </span>
              <span className="flex items-center gap-1 text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded-md">
                <Car className="w-3 h-3 text-orange-600" />
                預計 {item.estimatedArrivalTime || '--'} 抵達 (車程約 {item.estimatedDriveMinutes ?? 1} 分)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.location}</p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">正在為您調閱景點專屬導覽手冊...</p>
              <p className="text-xs text-slate-400 mt-1">整理營業時間、拍照秘境、必吃美食與門票資訊</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <p className="font-semibold">{error}</p>
              <p className="mt-1 text-slate-600">
                景點備註：{item.notes || '暫無額外備註'}
              </p>
            </div>
          ) : guide ? (
            <>
              {/* Audio Guide Player Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-4 text-white shadow-md shadow-orange-500/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide uppercase text-amber-100">
                      AI 隨身語音導遊
                    </h4>
                    <p className="text-xs text-white/90 line-clamp-1">
                      {isPlayingAudio ? '正在播放專屬語音解說...' : '一鍵聆聽景點精彩歷史與秘密故事'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleSpeech}
                  className="px-4 py-2 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-xs hover:bg-orange-50 transition-all cursor-pointer shrink-0"
                >
                  {isPlayingAudio ? '暫停播放' : '播放導覽'}
                </button>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  景點背景與特色介紹
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {guide.summary}
                </p>
              </div>

              {/* Highlights */}
              {guide.highlights?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2.5">⭐ 必看核心亮點</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {guide.highlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs sm:text-sm text-slate-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Grid: Hours, Tickets, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                    <Clock className="w-4 h-4 text-sky-500" />
                    開放營業時間
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    {guide.openingHours || '以現場公告為準'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                    <Ticket className="w-4 h-4 text-emerald-500" />
                    門票與參觀收費
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    {guide.ticketInfo || '免費參觀'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-800 mb-1">
                    <Car className="w-4 h-4 text-orange-600" />
                    行車與預計抵達
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-orange-950">
                    車程約 {item.estimatedDriveMinutes ?? 1} 分鐘 (預計 {item.estimatedArrivalTime || '--'})
                  </p>
                </div>
              </div>

              {/* Photo Spots & Nearby Food */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo Spots */}
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                  <h5 className="text-xs font-bold text-sky-900 mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-sky-600" />
                    最佳拍照打卡視角
                  </h5>
                  <ul className="space-y-1.5">
                    {guide.photoSpots?.map((spot, i) => (
                      <li key={i} className="text-xs text-sky-950 flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{spot}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nearby Food */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                  <h5 className="text-xs font-bold text-orange-900 mb-2 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-orange-600" />
                    周邊推薦美食
                  </h5>
                  <ul className="space-y-1.5">
                    {guide.nearbyFood?.map((food, i) => (
                      <li key={i} className="text-xs text-orange-950 flex items-start gap-1.5">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tips & Etiquette */}
              {guide.tips?.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <h5 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    在地旅遊達人叮嚀與參訪禮儀
                  </h5>
                  <div className="space-y-1.5">
                    {guide.tips.map((tip, i) => (
                      <p key={i} className="text-xs text-amber-950 leading-relaxed flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? '已複製景點資訊' : '複製分享'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNavigation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>導航前往景點</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
