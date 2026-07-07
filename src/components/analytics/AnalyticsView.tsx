'use client';
import { useState, useMemo } from 'react';
import { getDummyEvents } from '@/lib/dummy-data';
import { getWeekDays } from '@/lib/date-utils';
import { calculateStudyHours } from '@/lib/timeline';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

type Period = 'today' | 'week' | 'month';

export default function AnalyticsView() {
  const [period, setPeriod] = useState<Period>('week');

  const events = useMemo(() => {
    const today = new Date();
    if (period === 'today') return getDummyEvents(today);
    if (period === 'week') {
      return getWeekDays(today).flatMap((d) => getDummyEvents(d));
    }
    // Month: approximate with 4 weeks
    const result = [];
    for (let i = -14; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      result.push(...getDummyEvents(d));
    }
    return result;
  }, [period]);

  const catHours = useMemo(() => {
    return DEFAULT_CATEGORIES.map((cat) => {
      const hours = events
        .filter((e) => e.categoryId === cat.id)
        .reduce((acc, e) => acc + (new Date(e.end).getTime() - new Date(e.start).getTime()) / 3600000, 0);
      return { ...cat, hours };
    }).filter((c) => c.hours > 0);
  }, [events]);

  const total = catHours.reduce((a, c) => a + c.hours, 0);
  const completedCount = events.filter((e) => e.isCompleted).length;
  const taskCount = events.filter((e) => e.isTaskLike).length;
  const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div className="px-4 py-4">
      {/* Period tabs */}
      <div
        className="flex rounded-2xl p-1 mb-6"
        style={{ background: 'var(--bg-subtle)' }}
      >
        {(['today', 'week', 'month'] as Period[]).map((p) => (
          <button
            key={p}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: period === p ? 'var(--bg-card)' : 'transparent',
              color: period === p ? 'var(--accent)' : 'var(--text-secondary)',
              boxShadow: period === p ? 'var(--shadow)' : 'none',
            }}
            onClick={() => setPeriod(p)}
          >
            {p === 'today' ? '今日' : p === 'week' ? '週' : '月'}
          </button>
        ))}
      </div>

      {/* Completion rate */}
      <div className="card rounded-3xl p-4 mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>完了率</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{completionRate}%</span>
          <span className="text-sm pb-1" style={{ color: 'var(--text-muted)' }}>{completedCount}/{taskCount}件</span>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${completionRate}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card rounded-3xl p-4">
        <p className="text-xs font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>カテゴリ別時間</p>
        <div className="flex flex-col gap-3">
          {catHours.map(({ id, labelJa, color, hours }) => {
            const pct = total > 0 ? (hours / total) * 100 : 0;
            return (
              <div key={id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{labelJa}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color }}>
                    {hours.toFixed(1)}h
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
