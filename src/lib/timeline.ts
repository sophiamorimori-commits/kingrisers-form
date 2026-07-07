import type { CalendarEvent } from '@/types/calendar';

export interface TimelineBlock {
  event: CalendarEvent;
  leftPercent: number;
  widthPercent: number;
  lane: number;
  totalLanes: number;
}

export function calculateTimeline(
  events: CalendarEvent[],
  startHour: number,
  endHour: number,
): TimelineBlock[] {
  const totalMinutes = (endHour - startHour) * 60;

  const toMinutes = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.getHours() * 60 + d.getMinutes();
  };

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const blocks: TimelineBlock[] = events
    .filter((e) => !e.isAllDay)
    .map((event) => {
      const startMin = clamp(toMinutes(event.start) - startHour * 60, 0, totalMinutes);
      const endMin = clamp(toMinutes(event.end) - startHour * 60, 0, totalMinutes);
      const leftPercent = (startMin / totalMinutes) * 100;
      const widthPercent = ((endMin - startMin) / totalMinutes) * 100;
      return { event, leftPercent, widthPercent, lane: 0, totalLanes: 1 };
    })
    .filter((b) => b.widthPercent > 0);

  // Assign lanes for overlapping events
  for (let i = 0; i < blocks.length; i++) {
    const lanes: boolean[] = [];
    for (let j = 0; j < i; j++) {
      const a = blocks[i];
      const b = blocks[j];
      const overlap = a.leftPercent < b.leftPercent + b.widthPercent && a.leftPercent + a.widthPercent > b.leftPercent;
      if (overlap) {
        lanes[b.lane] = true;
      }
    }
    let lane = 0;
    while (lanes[lane]) lane++;
    blocks[i].lane = lane;
  }

  const maxLane = Math.max(...blocks.map((b) => b.lane), 0);
  blocks.forEach((b) => (b.totalLanes = maxLane + 1));

  return blocks;
}

export function calculateStudyHours(events: CalendarEvent[]): number {
  return events
    .filter((e) => e.categoryId === 'study')
    .reduce((acc, e) => {
      const ms = new Date(e.end).getTime() - new Date(e.start).getTime();
      return acc + ms / 3600000;
    }, 0);
}

export function calculateFreeHours(
  events: CalendarEvent[],
  startHour: number,
  endHour: number,
): number {
  const totalMinutes = (endHour - startHour) * 60;
  const timeline = new Array(totalMinutes).fill(false);
  events
    .filter((e) => !e.isAllDay)
    .forEach((e) => {
      const s = Math.max(0, Math.floor(new Date(e.start).getHours() * 60 + new Date(e.start).getMinutes() - startHour * 60));
      const end = Math.min(totalMinutes, Math.floor(new Date(e.end).getHours() * 60 + new Date(e.end).getMinutes() - startHour * 60));
      for (let i = s; i < end; i++) timeline[i] = true;
    });
  const busyMinutes = timeline.filter(Boolean).length;
  return (totalMinutes - busyMinutes) / 60;
}
