export type TaskStatus = 'done' | 'skip' | 'none';

export interface DayData {
  [taskId: string]: TaskStatus | string | number | undefined;
  clg_subj?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
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
  email?: string;
  onboarded?: boolean;
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
  tasks: Task[];
  subjects: string[];
  pathStages: PathStage[];
  days: Record<string, DayData>;
  path: {
    current: string;
    pct: Record<string, number>;
    completedDates: Record<string, string>;
  };
  streaks: Record<string, number>;
  bestStreaks: Record<string, number>;
  settings: Settings;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  toggleTask: (date: string, taskId: string, status: TaskStatus) => void;
  setMood: (date: string, mood: 1 | 2 | 3 | 4 | 5) => void;
  updatePath: (stageId: string, pct: number) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setSubjects: (subjects: string[]) => void;
  setPathStages: (stages: PathStage[]) => void;
  setCurrentPathStage: (stageId: string) => void;
}