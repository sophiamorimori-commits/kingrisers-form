'use client';
import { useState, useMemo } from 'react';
import { getDummyEvents } from '@/lib/dummy-data';
import { getCategoryById } from '@/lib/categories';
import { formatTime } from '@/lib/date-utils';
import { format, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Check, ArrowRight, Trash2 } from 'lucide-react';
import type { CalendarEvent } from '@/types/calendar';

export default function TasksView() {
  const today = new Date();
  const yesterday = subDays(today, 1);

  const [todayTasks, setTodayTasks] = useState(() =>
    getDummyEvents(today).filter((e) => e.isTaskLike)
  );
  const [yesterdayTasks, setYesterdayTasks] = useState(() =>
    getDummyEvents(yesterday).filter((e) => e.isTaskLike && !e.isCompleted)
  );

  const toggleToday = (id: string) =>
    setTodayTasks((p) => p.map((e) => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e));

  const removeToday = (id: string) =>
    setTodayTasks((p) => p.filter((e) => e.id !== id));

  const toggleYesterday = (id: string) =>
    setYesterdayTasks((p) => p.map((e) => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e));

  const removeYesterday = (id: string) =>
    setYesterdayTasks((p) => p.filter((e) => e.id !== id));

  const carry = (id: string) => {
    const task = yesterdayTasks.find((e) => e.id === id);
    if (task) {
      setTodayTasks((p) => [...p, { ...task, id: `${task.id}-carried`, isCarriedOver: true }]);
      removeYesterday(id);
    }
  };

  return (
    <div className="px-4 py-4">
      <Section title="今日の未完了" count={todayTasks.filter((e) => !e.isCompleted).length}>
        {todayTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={toggleToday}
            onRemove={removeToday}
          />
        ))}
        {todayTasks.filter((e) => !e.isCompleted).length === 0 && (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
            完了！
          </p>
        )}
      </Section>

      {yesterdayTasks.length > 0 && (
        <Section title="未完了（昨日以前）" count={yesterdayTasks.length}>
          {yesterdayTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleYesterday}
              onRemove={removeYesterday}
              onCarry={carry}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        {count > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onRemove,
  onCarry,
}: {
  task: CalendarEvent;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onCarry?: (id: string) => void;
}) {
  const cat = getCategoryById(task.categoryId);
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-3xl mb-2 card"
      style={{ opacity: task.isCompleted ? 0.55 : 1 }}
    >
      <button
        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
        style={{
          background: task.isCompleted ? cat.color : 'transparent',
          border: `2px solid ${cat.color}`,
        }}
        onClick={() => onToggle(task.id)}
      >
        {task.isCompleted && <Check size={12} strokeWidth={3} color="#fff" />}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: 'var(--text-primary)', textDecoration: task.isCompleted ? 'line-through' : 'none' }}
        >
          {task.title}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {formatTime(task.start)} – {formatTime(task.end)}
        </p>
      </div>
      {onCarry && (
        <button
          onClick={() => onCarry(task.id)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
        >
          <ArrowRight size={12} />
          明日
        </button>
      )}
      <button
        onClick={() => onRemove(task.id)}
        className="w-7 h-7 flex items-center justify-center rounded-full"
        style={{ color: 'var(--text-muted)' }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
