import React, { useState } from 'react';
import { X, MapPin, Tag, FileText, Compass, Sparkles, Car } from 'lucide-react';
import { CategoryType, ItineraryItem } from '../types/itinerary';

interface AddItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ItineraryItem, 'id' | 'completed' | 'distanceMeters'>) => void;
  referenceLat?: number;
  referenceLng?: number;
}

export const AddItineraryModal: React.FC<AddItineraryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  referenceLat = 35.7148,
  referenceLng = 139.7967,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<CategoryType>('scenic');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState<number>(referenceLat);
  const [lng, setLng] = useState<number>(referenceLng);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      location: location.trim() || title.trim(),
      lat: lat || referenceLat,
      lng: lng || referenceLng,
      category,
      notes: notes.trim(),
    });

    // Reset
    setTitle('');
    setLocation('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
              +
            </span>
            <h3 className="text-lg font-bold text-slate-900">手動新增行程景點</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Smart GPS arrival time notice */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
            <Car className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              <strong>GPS 智慧抵達估算：</strong>到達時間將從您當下定位自動推算行車時間，無須手動輸入時間！
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              景點或店家名稱 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：清水寺、晴空塔、鼎泰豐"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-slate-900 font-medium"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">詳細地址或鄰近站點</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例如：押上站B3出口 / 台北市信義區..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-slate-900"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">行程類型</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { key: 'scenic', label: '觀光風景' },
                { key: 'culture', label: '人文古蹟' },
                { key: 'food', label: '特色美食' },
                { key: 'shopping', label: '購物商圈' },
                { key: 'nature', label: '自然步道' },
                { key: 'entertainment', label: '休閒娛樂' },
                { key: 'other', label: '其他' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setCategory(cat.key as CategoryType)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    category === cat.key
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">旅行備註或必吃必看叮嚀</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：需先線上預約門票、推薦點草莓大福..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-slate-900"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 cursor-pointer"
            >
              新增至行程
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
