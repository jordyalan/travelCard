/**
 * Date utilities for itinerary date detection and formatting
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateWithOffset(offsetDays: number, baseDate = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

export function formatDateDisplay(dateStr: string): {
  full: string;
  short: string;
  dayOfWeek: string;
  relative: string;
} {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = WEEKDAYS[targetDate.getDay()] || '';

  const todayStr = getTodayDateString();
  const tomorrowStr = getDateWithOffset(1);
  const yesterdayStr = getDateWithOffset(-1);

  let relative = '';
  if (dateStr === todayStr) {
    relative = '今天';
  } else if (dateStr === tomorrowStr) {
    relative = '明天';
  } else if (dateStr === yesterdayStr) {
    relative = '昨天';
  } else {
    const diffTime = targetDate.getTime() - new Date(todayStr).getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      relative = `${diffDays} 天後`;
    } else {
      relative = `${Math.abs(diffDays)} 天前`;
    }
  }

  return {
    full: `${year}年${month}月${day}日 (${dayOfWeek})`,
    short: `${month}/${day} (${dayOfWeek})`,
    dayOfWeek,
    relative,
  };
}
