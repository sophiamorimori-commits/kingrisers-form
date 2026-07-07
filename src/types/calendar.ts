export type CategoryId = 'study' | 'class' | 'part_time' | 'work' | 'private' | 'move' | 'other';

export type EventStatus = 'not_started' | 'in_progress' | 'completed';

export interface CalendarEvent {
  id: string;
  userId: string;
  provider: 'google' | 'local';
  externalCalendarId: string;
  googleEventId?: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  isAllDay: boolean;
  categoryId: CategoryId;
  status: EventStatus;
  isCompleted: boolean;
  isTaskLike: boolean;
  isCarriedOver: boolean;
  originalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: CategoryId | string;
  labelJa: string;
  labelEn: string;
  color: string;
  bgColor: string;
  textColor: string;
  isDefault: boolean;
  isVisible: boolean;
  sortOrder: number;
}
