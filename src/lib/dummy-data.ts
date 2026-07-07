import type { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

function dateStr(base: Date, h: number, m = 0): string {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function getDummyEvents(date: Date): CalendarEvent[] {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const base: Omit<CalendarEvent, 'id' | 'title' | 'start' | 'end' | 'categoryId' | 'status' | 'isCompleted' | 'isTaskLike'> = {
    userId: 'demo',
    provider: 'local',
    externalCalendarId: 'primary',
    isAllDay: false,
    isCarriedOver: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return [
    { ...base, id: '1', title: '英語長文演習', start: dateStr(d, 7, 0), end: dateStr(d, 8, 30), categoryId: 'study', status: 'completed', isCompleted: true, isTaskLike: true },
    { ...base, id: '2', title: '数学プラチカ', start: dateStr(d, 9, 0), end: dateStr(d, 11, 0), categoryId: 'study', status: 'in_progress', isCompleted: false, isTaskLike: true },
    { ...base, id: '3', title: '大学 講義', start: dateStr(d, 11, 30), end: dateStr(d, 13, 0), categoryId: 'class', status: 'not_started', isCompleted: false, isTaskLike: false },
    { ...base, id: '4', title: '移動', start: dateStr(d, 13, 0), end: dateStr(d, 13, 30), categoryId: 'move', status: 'not_started', isCompleted: false, isTaskLike: false },
    { ...base, id: '5', title: 'KingRisers MTG', start: dateStr(d, 14, 0), end: dateStr(d, 16, 0), categoryId: 'work', status: 'not_started', isCompleted: false, isTaskLike: true },
    { ...base, id: '6', title: 'トライ個別指導', start: dateStr(d, 17, 0), end: dateStr(d, 20, 0), categoryId: 'part_time', status: 'not_started', isCompleted: false, isTaskLike: false },
    { ...base, id: '7', title: '世界史まとめ', start: dateStr(d, 21, 0), end: dateStr(d, 22, 30), categoryId: 'study', status: 'not_started', isCompleted: false, isTaskLike: true },
  ];
}

export function getDummyWeekEvents(weekStart: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    if (i !== 0 && i !== 6) {
      events.push(...getDummyEvents(day));
    } else if (i === 0) {
      events.push(...getDummyEvents(day).slice(0, 3));
    } else {
      events.push(...getDummyEvents(day).slice(4));
    }
  }
  return events;
}
