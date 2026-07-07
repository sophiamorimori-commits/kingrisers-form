'use client';
import type { CalendarEvent } from '@/types/calendar';
import { calculateStudyHours, calculateFreeHours } from '@/lib/timeline';

interface Props {
  events: CalendarEvent[];
  startHour: number;
  endHour: number;
}

export default function SummaryCards({ events, startHour, endHour }: Props) {
  const studyHours = calculateStudyHours(events);
  const workHours = events
    .filter((e) => e.categoryId === 'work')
    .reduce((acc, e) => acc + (new Date(e.end).getTime() - new Date(e.start).getTime()) / 3600000, 0);
  const freeHours = calculateFreeHours(events, startHour, endHour);
  const totalTasks = events.filter((e) => e.isTaskLike);
  const completed = totalTasks.filter((e) => e.isCompleted).length;
  const remaining = totalTasks.length - completed;

  const items = [
    { label: '勉強', value: `${studyHours.toFixed(1)}h`, accent: '#7C3AED' },
    { label: '仕事', value: `${workHours.toFixed(1)}h`, accent: '#DC2626' },
    { label: '空き', value: `${freeHours.toFixed(1)}h`, accent: '#16A34A' },
    { label: '未完了', value: `${remaining}`, accent: '#EA580C' },
    { label: '完了', value: `${completed}`, accent: '#6B7280' },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 px-4 py-3">
      {items.map(({ label, value, accent }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5 p-2 rounded-2xl card"
        >
          <span className="text-base font-bold tabular-nums" style={{ color: accent }}>
            {value}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
