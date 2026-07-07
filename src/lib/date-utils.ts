import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatDayHeader(date: Date): string {
  return format(date, 'M月d日 EEE', { locale: ja });
}

export function formatTime(isoStr: string): string {
  return format(new Date(isoStr), 'HH:mm');
}

export function formatDuration(startIso: string, endIso: string): string {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  const hours = Math.floor(ms / 3600000);
  const mins = Math.round((ms % 3600000) / 60000);
  if (hours === 0) return `${mins}分`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}分`;
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export function getMonthDays(date: Date): (Date | null)[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  const startDow = (start.getDay() + 6) % 7; // Monday = 0
  const result: (Date | null)[] = Array(startDow).fill(null);
  return result.concat(days);
}

export function isSameDay(a: Date, b: Date): boolean {
  return format(a, 'yyyy-MM-dd') === format(b, 'yyyy-MM-dd');
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}
