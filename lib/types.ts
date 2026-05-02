export type TaskStatus = 'done' | 'skip' | 'none';

export interface DayData {
  [taskId: string]: TaskStatus | string | number | undefined;
  clg_subj?: string;
  note?: string;
}

export interface Task {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  duration: string;
  color: string;
  icon: string;
  path: boolean;
  category: string;
  rotating?: boolean;
}

export interface PathStage {
  id: string;
  name: string;
  source: string;
  color: string;
  description: string;
}

export interface Settings {
  name: string;
  theme: 'dark' | 'darker';
  startDate: string;
  preTaskReminders?: boolean;
  taskStartNotifications?: boolean;
  endReminders?: boolean;
  eveningCheckIn?: boolean;
  streakProtection?: boolean;
  midnightWarning?: boolean;
  weeklyReviewNotification?: boolean;
  streakMilestoneCelebrations?: boolean;
  pathMilestoneNotifications?: boolean;
  aiMorningBriefingNotification?: boolean;
}

export interface HabitStore {
  days: Record<string, DayData>;
  path: {
    current: 'html' | 'js' | 'react' | 'practice';
    pct: Record<string, number>;
    completedDates: Record<string, string>;
  };
  streaks: Record<string, number>;
  bestStreaks: Record<string, number>;
  settings: Settings;
  toggleTask: (date: string, taskId: string, status: TaskStatus) => void;
  updatePath: (stageId: string, pct: number) => void;
  updateSettings: (partial: Partial<Settings>) => void;
}