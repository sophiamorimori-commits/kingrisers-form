'use client';
import { useState } from 'react';
import type { CalendarEvent } from '@/types/calendar';
import { getCategoryById } from '@/lib/categories';
import { formatTime, formatDuration } from '@/lib/date-utils';
import { Check, Circle } from 'lucide-react';

interface Props {
  event: CalendarEvent;
  onToggleComplete?: (id: string) => void;
}

export default function EventCard({ event, onToggleComplete }: Props) {
  const cat = getCategoryById(event.categoryId);
  const duration = formatDuration(event.start, event.end);

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-3xl mb-2 card transition-opacity"
      style={{ opacity: event.isCompleted ? 0.6 : 1 }}
    >
      {/* Category dot + complete toggle */}
      <button
        className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: event.isCompleted ? cat.color : 'transparent',
          border: `2px solid ${cat.color}`,
        }}
        onClick={() => onToggleComplete?.(event.id)}
        aria-label={event.isCompleted ? '未完了に戻す' : '完了にする'}
      >
        {event.isCompleted && <Check size={12} strokeWidth={3} color="#fff" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-tight truncate"
          style={{
            color: 'var(--text-primary)',
            textDecoration: event.isCompleted ? 'line-through' : 'none',
          }}
        >
          {event.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {formatTime(event.start)} – {formatTime(event.end)}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {duration}
          </span>
        </div>
      </div>

      {/* Category chip */}
      <span
        className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: cat.color + '22', color: cat.color }}
      >
        {cat.labelJa}
      </span>
    </div>
  );
}
