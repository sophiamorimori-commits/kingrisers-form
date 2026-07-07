'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { getDummyEvents } from '@/lib/dummy-data';
import { getMonthDays, isSameDay, isToday } from '@/lib/date-utils';
import { calculateStudyHours } from '@/lib/timeline';
import { getCategoryById } from '@/lib/categories';

const DOW_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export default function MonthView() {
  const [month, setMonth] = useState(() => new Date());
  const router = useRouter();

  const days = useMemo(() => getMonthDays(month), [month]);

  const allEvents = useMemo(() => {
    const unique = days.filter(Boolean) as Date[];
    return unique.map((d) => ({ date: d, events: getDummyEvents(d) }));
  }, [days]);

  const monthStudyH = useMemo(() =>
    allEvents.reduce((acc, { events }) => acc + calculateStudyHours(events), 0),
    [allEvents]
  );

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {format(month, 'yyyy年M月', { locale: ja })}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            月合計勉強 {monthStudyH.toFixed(1)}h
          </p>
        </div>
        <button
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day of week labels */}
      <div className="grid grid-cols-7 px-4 mb-1">
        {DOW_LABELS.map((d, i) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold py-1"
            style={{ color: i === 6 ? '#DC2626' : i === 5 ? '#2563EB' : 'var(--text-muted)' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px px-4">
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }
          const dayData = allEvents.find((e) => isSameDay(e.date, day));
          const events = dayData?.events ?? [];
          const studyH = calculateStudyHours(events);
          const today = isToday(day);
          const catIds = [...new Set(events.map((e) => e.categoryId))].slice(0, 3);

          return (
            <button
              key={day.toISOString()}
              onClick={() => router.push('/day')}
              className="flex flex-col items-center py-1.5 rounded-2xl transition-colors"
              style={{
                background: today ? 'var(--accent)' : 'transparent',
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: today ? '#fff' : 'var(--text-primary)' }}
              >
                {format(day, 'd')}
              </span>
              {/* Category dots */}
              <div className="flex gap-0.5 mt-0.5 h-1.5">
                {catIds.map((id) => {
                  const cat = getCategoryById(id);
                  return (
                    <span
                      key={id}
                      className="w-1 h-1 rounded-full"
                      style={{ background: today ? 'rgba(255,255,255,0.7)' : cat.color }}
                    />
                  );
                })}
              </div>
              {/* Study hours */}
              {studyH > 0 && (
                <span
                  className="text-[9px] font-medium mt-0.5"
                  style={{ color: today ? 'rgba(255,255,255,0.8)' : '#7C3AED' }}
                >
                  {studyH.toFixed(1)}h
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="h-6" />
    </div>
  );
}
