'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { CalendarEvent, CategoryId } from '@/types/calendar';
import { getDummyEvents } from '@/lib/dummy-data';
import { useSettingsStore } from '@/store/settings-store';
import TimelineBar from './TimelineBar';
import EventCard from './EventCard';
import CategoryFilter from './CategoryFilter';
import SummaryCards from './SummaryCards';
import { getWeekNumber } from '@/lib/date-utils';

export default function DayView() {
  const [date, setDate] = useState(() => new Date());
  const [filterCats, setFilterCats] = useState<CategoryId[]>([]);
  const settings = useSettingsStore((s) => s.settings);
  const [events, setEvents] = useState<CalendarEvent[]>(() => getDummyEvents(new Date()));

  const today = isToday(date);
  const weekNum = getWeekNumber(date);

  const dayEvents = useMemo(() => {
    const base = getDummyEvents(date);
    if (filterCats.length === 0) return base;
    return base.filter((e) => filterCats.includes(e.categoryId as CategoryId));
  }, [date, filterCats]);

  const handleToggle = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, isCompleted: !e.isCompleted, status: !e.isCompleted ? 'completed' : 'not_started' }
          : e
      )
    );
  };

  const displayEvents = useMemo(() => {
    const base = getDummyEvents(date).map((e) => {
      const match = events.find((ev) => ev.id === e.id);
      return match ?? e;
    });
    if (filterCats.length === 0) return base;
    return base.filter((e) => filterCats.includes(e.categoryId as CategoryId));
  }, [date, filterCats, events]);

  const sortedEvents = [...displayEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div>
      {/* Date header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDate((d) => subDays(d, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {format(date, 'M月d日', { locale: ja })}
              </span>
              <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {format(date, 'EEE', { locale: ja })}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              {today && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  TODAY
                </span>
              )}
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                WEEK {weekNum}
              </span>
            </div>
          </div>

          <button
            onClick={() => setDate((d) => addDays(d, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {!today && (
          <button
            className="mt-2 w-full text-xs font-medium py-1 rounded-full"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
            onClick={() => setDate(new Date())}
          >
            今日に戻る
          </button>
        )}
      </div>

      {/* Category filter */}
      <CategoryFilter selected={filterCats} onChange={setFilterCats} />

      {/* Today summary bar */}
      <div className="px-4 py-2">
        <div
          className="flex items-center gap-4 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--bg-subtle)' }}
        >
          <SummaryItem label="予定" value={`${displayEvents.length}件`} />
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <SummaryItem
            label="勉強"
            value={`${displayEvents.filter((e) => e.categoryId === 'study').reduce((a, e) => a + (new Date(e.end).getTime() - new Date(e.start).getTime()) / 3600000, 0).toFixed(1)}h`}
          />
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <SummaryItem
            label="未完了"
            value={`${displayEvents.filter((e) => e.isTaskLike && !e.isCompleted).length}件`}
          />
        </div>
      </div>

      {/* Timeline bar */}
      <TimelineBar
        events={displayEvents}
        startHour={settings.dayStartHour}
        endHour={settings.dayEndHour}
      />

      {/* Event list */}
      <div className="px-0 pt-2">
        {sortedEvents.length === 0 ? (
          <EmptyState />
        ) : (
          sortedEvents.map((event) => (
            <div key={event.id} className="px-4">
              <EventCard event={event} onToggleComplete={handleToggle} />
            </div>
          ))
        )}
      </div>

      {/* Summary cards */}
      <SummaryCards
        events={displayEvents}
        startHour={settings.dayStartHour}
        endHour={settings.dayEndHour}
      />
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</span>
      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 px-8 text-center">
      <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
        今日は予定がありません
      </p>
      <button
        className="text-sm font-semibold px-4 py-2 rounded-full"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        予定を追加する
      </button>
    </div>
  );
}
