import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HabitStore, TaskStatus } from './types';
import { TASKS, SUBJECTS } from './constants';

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      subjects: [],
      days: {},
      path: {
        current: 'html',
        pct: { html: 0, js: 0, react: 0, practice: 0 },
        completedDates: {},
      },
      streaks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
      bestStreaks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
      settings: {
        name: '',
        email: '',
        onboarded: false,
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
      setMood: (date: string, mood: 1 | 2 | 3 | 4 | 5) =>
        set((state) => ({
          days: {
            ...state.days,
            [date]: {
              ...(state.days[date] || {}),
              mood,
            },
          },
        })),

      updatePath: (stageId: string, pct: number) =>
        set((state) => {
          const newPct = { ...state.path.pct, [stageId]: pct };
          const newCompletedDates = { ...state.path.completedDates };
          let newCurrent = state.path.current;
          
          if (pct === 100 && !newCompletedDates[stageId]) {
            newCompletedDates[stageId] = new Date().toISOString();
            
            const stageIds = ['html', 'js', 'react', 'practice'];
            const currentIndex = stageIds.indexOf(stageId);
            if (currentIndex !== -1 && currentIndex < stageIds.length - 1) {
              newCurrent = stageIds[currentIndex + 1] as any;
            }
          } else if (pct < 100 && newCompletedDates[stageId]) {
            delete newCompletedDates[stageId];
          }

          return {
            path: {
              ...state.path,
              current: newCurrent,
              pct: newPct,
              completedDates: newCompletedDates,
            },
          };
        }),
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, task],
        streaks: { ...state.streaks, [task.id]: 0 },
        bestStreaks: { ...state.bestStreaks, [task.id]: 0 }
      })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId)
      })),
      setSubjects: (subjects) => set({ subjects }),
    }),
    {
      name: 'grind-storage',
    }
  )
);