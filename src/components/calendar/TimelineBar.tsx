'use client';
import type { CalendarEvent, Category } from '@/types/calendar';
import { calculateTimeline } from '@/lib/timeline';
import { getCategoryById } from '@/lib/categories';

interface Props {
  events: CalendarEvent[];
  startHour: number;
  endHour: number;
}

export default function TimelineBar({ events, startHour, endHour }: Props) {
  const blocks = calculateTimeline(events, startHour, endHour);
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <div className="px-4 py-2">
      {/* Hour ticks */}
      <div className="relative flex mb-1" style={{ height: '12px' }}>
        {hours.filter((h) => h % 3 === 0).map((h) => (
          <span
            key={h}
            className="absolute text-[9px] font-medium"
            style={{
              left: `${((h - startHour) / (endHour - startHour)) * 100}%`,
              color: 'var(--text-muted)',
              transform: 'translateX(-50%)',
            }}
          >
            {h}
          </span>
        ))}
      </div>
      {/* Bar */}
      <div
        className="relative w-full rounded-full overflow-hidden"
        style={{ height: '28px', background: 'var(--bg-subtle)' }}
      >
        {/* Now indicator */}
        <NowIndicator startHour={startHour} endHour={endHour} />
        {/* Event blocks */}
        {blocks.map(({ event, leftPercent, widthPercent, lane, totalLanes }) => {
          const cat = getCategoryById(event.categoryId);
          const h = totalLanes > 1 ? `${100 / totalLanes}%` : '100%';
          const top = totalLanes > 1 ? `${(lane / totalLanes) * 100}%` : '0%';
          return (
            <div
              key={event.id}
              title={event.title}
              className="absolute rounded-sm transition-opacity"
              style={{
                left: `${leftPercent}%`,
                width: `${Math.max(widthPercent, 0.5)}%`,
                top,
                height: h,
                background: cat.color,
                opacity: event.isCompleted ? 0.45 : 0.85,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function NowIndicator({ startHour, endHour }: { startHour: number; endHour: number }) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const startMins = startHour * 60;
  const endMins = endHour * 60;
  if (mins < startMins || mins > endMins) return null;
  const pct = ((mins - startMins) / (endMins - startMins)) * 100;
  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 z-10"
      style={{ left: `${pct}%`, background: 'var(--accent)', opacity: 0.9 }}
    />
  );
}
