import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { ItineraryItem } from '../types/itinerary';
import { parseItineraryText } from '../services/apiService';

interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: ItineraryItem[], title?: string) => void;
}

const SAMPLE_TEXT = `早上9點先去淺草寺雷門拍照參觀，11點走到晴空塔350m展望台看風景，中午在晴空塔吃敘敘苑燒肉。
下午2點半去上野恩賜公園散步逛阿美橫丁，傍晚5點到秋葉原逛扭蛋電器街，晚上7點去銀座和光鐘樓欣賞夜景散策。`;

export const SmartImportModal: React.FC<SmartImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!inputText.trim()) {
      setError('請先貼上或輸入行程內容文字');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await parseItineraryText(inputText);
      if (!data.items || data.items.length === 0) {
        throw new Error('未能識別出明確的景點行程，請補充時間或地點描述');
      }

      const formattedItems: ItineraryItem[] = data.items.map(
        (item: any, idx: number) => ({
          id: `ai-item-${Date.now()}-${idx}`,
          title: item.title,
          location: item.location || item.title,
          lat: item.lat || 25.0330,
          lng: item.lng || 121.5654,
          category: item.category || 'scenic',
          notes: item.notes || '',
          completed: false,
        })
      );

      onImport(formattedItems, data.itineraryTitle);
      onClose();
    } catch (err: any) {
      setError(err.message || 'AI 行程分析解析失敗，請確認網路或簡化描述');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">AI 智慧快速匯入行程</h3>
              <p className="text-[11px] text-slate-500">
                貼上朋友的聊天訊息或旅行筆記，AI 自動解析成結構化景點導覽清單
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                行程筆記 / 訊息內容
              </label>
              <button
                type="button"
                onClick={() => setInputText(SAMPLE_TEXT)}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer underline"
              >
                帶入範例內容
              </button>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例如：早上9點先去淺草寺雷門拍照，11點去晴空塔看展，中午吃敘敘苑燒肉，下午2點逛阿美橫丁..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-slate-900 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">💡 智慧辨識支援：</p>
            <p>• 自動估算各景點約略經緯度座標與推薦景點分類</p>
            <p>• 預計到達時間由手機 GPS 定位自動計算所需行車時間，無須手動指定</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleParse}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 正在解析拆解中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>一鍵解析並建立行程</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
