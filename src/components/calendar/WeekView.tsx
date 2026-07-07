'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { getDummyEvents } from '@/lib/dummy-data';
import { getWeekDays, isSameDay, isToday } from '@/lib/date-utils';
import { calculateStudyHours } from '@/lib/timeline';
import { getCategoryById, DEFAULT_CATEGORIES } from '@/lib/categories';
import { useSettingsStore } from '@/store/settings-store';

export default function WeekView() {
  const [weekBase, setWeekBase] = useState(() => new Date());
  const settings = useSettingsStore((s) => s.settings);
  const router = useRouter();

  const weekDays = useMemo(() => getWeekDays(weekBase), [weekBase]);
  const startLabel = format(weekDays[0], 'M/d', { locale: ja });
  const endLabel = format(weekDays[6], 'M/d EEE', { locale: ja });

  const weekEvents = useMemo(() =>
    weekDays.flatMap((d) => getDummyEvents(d)),
    [weekDays]
  );

  const totalStudy = useMemo(() => calculateStudyHours(weekEvents), [weekEvents]);

  return (
    <div>
      {/* Week header */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => setWeekBase((d) => subWeeks(d, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {startLabel} – {endLabel}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            週合計勉強 {totalStudy.toFixed(1)}h
          </p>
        </div>
        <button
          onClick={() => setWeekBase((d) => addWeeks(d, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day cards */}
      <div className="px-4 flex flex-col gap-3">
        {weekDays.map((day) => {
          const dayEvents = getDummyEvents(day);
          const studyH = calculateStudyHours(dayEvents);
          const incomplete = dayEvents.filter((e) => e.isTaskLike && !e.isCompleted).length;
          const today = isToday(day);

          // Category density for mini bar
          const totalMins = (settings.dayEndHour - settings.dayStartHour) * 60;
          const categoryMinutes: Record<string, number> = {};
          dayEvents.forEach((e) => {
            const mins = (new Date(e.end).getTime() - new Date(e.start).getTime()) / 60000;
            categoryMinutes[e.categoryId] = (categoryMinutes[e.categoryId] ?? 0) + mins;
          });

          return (
            <button
              key={day.toISOString()}
              onClick={() => router.push('/day')}
              className="w-full text-left rounded-3xl p-4 card"
              style={{
                borderColor: today ? 'var(--accent)' : 'var(--border)',
                borderWidth: today ? '1.5px' : '1px',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg font-bold"
                    style={{ color: today ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {format(day, 'd', { locale: ja })}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {format(day, 'EEE', { locale: ja })}
                  </span>
                  {today && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      TODAY
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {studyH > 0 && (
                    <span className="font-semibold" style={{ color: '#7C3AED' }}>
                      {studyH.toFixed(1)}h
                    </span>
                  )}
                  {incomplete > 0 && (
                    <span style={{ color: '#EA580C' }}>{incomplete}未完了</span>
                  )}
                </div>
              </div>

              {/* Mini timeline bar */}
              <div className="relative h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-subtle)' }}>
                {Object.entries(categoryMinutes).map(([catId, mins]) => {
                  const cat = getCategoryById(catId);
                  const pct = (mins / totalMins) * 100;
                  const offset = Object.entries(categoryMinutes)
                    .filter(([id]) => DEFAULT_CATEGORIES.findIndex((c) => c.id === id) < DEFAULT_CATEGORIES.findIndex((c) => c.id === catId))
                    .reduce((acc, [, m]) => acc + (m / totalMins) * 100, 0);
                  return (
                    <div
                      key={catId}
                      className="absolute top-0 bottom-0"
                      style={{ left: `${offset}%`, width: `${pct}%`, background: cat.color }}
                    />
                  );
                })}
              </div>

              {/* Top events */}
              <div className="flex flex-col gap-1">
                {dayEvents.slice(0, 3).map((e) => {
                  const cat = getCategoryById(e.categoryId);
                  return (
                    <div key={e.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {e.title}
                      </span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    もっと{dayEvents.length - 3}件
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="h-6" />
    </div>
  );
}
