import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HabitStore, TaskStatus } from './types';
import { TASKS } from './constants';

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      days: {},
      path: {
        current: 'html',
        pct: { html: 0, js: 0, react: 0, practice: 0 },
        completedDates: {},
      },
      streaks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
      bestStreaks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
      settings: {
        name: 'Rajarshi',
        theme: 'dark',
        startDate: new Date().toISOString(),
        preTaskReminders: true,
        taskStartNotifications: true,
        endReminders: true,
        eveningCheckIn: true,
        streakProtection: true,
        midnightWarning: true,
        weeklyReviewNotification: true,
        streakMilestoneCelebrations: true,
        pathMilestoneNotifications: true,
        aiMorningBriefingNotification: true,
      },
      updateSettings: (partial) => 
        set((state) => ({ 
          settings: { ...state.settings, ...partial } 
        })),
      toggleTask: (date: string, taskId: string, status: TaskStatus) =>
        set((state) => {
          const dayData = state.days[date] || {};
          const currentStatus = dayData[taskId];
          const newStatus = currentStatus === status ? 'none' : status;
          
          return {
            days: {
              ...state.days,
              [date]: {
                ...dayData,
                [taskId]: newStatus,
              },
            },
          };
        }),

      updatePath: (stageId: string, pct: number) =>
        set((state) => ({
          path: {
            ...state.path,
            pct: { ...state.path.pct, [stageId]: pct },
            // Auto complete logic would go here
          },
        })),
    }),
    {
      name: 'grind-storage',
    }
  )
);