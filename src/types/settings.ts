export type Theme = 'warm' | 'dark' | 'neon' | 'system';
export type DefaultView = 'day' | 'week' | 'month';
export type DisplayDensity = 'compact' | 'standard' | 'large';

export interface UserSettings {
  theme: Theme;
  defaultView: DefaultView;
  displayDensity: DisplayDensity;
  dayStartHour: number;
  dayEndHour: number;
  showCompleted: boolean;
  showStudySummary: boolean;
  showWorkSummary: boolean;
  dailyStudyGoalHours: number;
  dailyWorkGoalHours: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'warm',
  defaultView: 'day',
  displayDensity: 'standard',
  dayStartHour: 6,
  dayEndHour: 24,
  showCompleted: true,
  showStudySummary: true,
  showWorkSummary: true,
  dailyStudyGoalHours: 6,
  dailyWorkGoalHours: 4,
};
