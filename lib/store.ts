import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { HabitStore, TaskStatus } from './types';
import { TASKS, SUBJECTS } from './constants';
import Cookies from 'js-cookie';

const mongoStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // Only attempt to fetch if we have the cookie set (user is "logged in")
    if (!Cookies.get('grind_user')) return null;
    
    try {
      const res = await fetch('/api/store');
      if (!res.ok) return null;
      const data = await res.json();
      return data.state || null;
    } catch (e) {
      console.error('Failed to fetch from MongoDB', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (!Cookies.get('grind_user')) return;

    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: value }),
      });
    } catch (e) {
      console.error('Failed to save to MongoDB', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    // We don't typically delete the user's DB doc on logout, 
    // but we could if we wanted to clear it.
  },
};

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      subjects: [],
      pathStages: [],
      days: {},
      path: {
        current: '',
        pct: {},
        completedDates: {},
      },
      streaks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
      bestStreaks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
      authModalOpen: false,
      setAuthModalOpen: (open: boolean) => set({ authModalOpen: open }),
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
            
            const stageIds = state.pathStages.map(s => s.id);
            const currentIndex = stageIds.indexOf(stageId);
            if (currentIndex !== -1 && currentIndex < stageIds.length - 1) {
              newCurrent = stageIds[currentIndex + 1];
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
      setCurrentPathStage: (stageId: string) => 
        set((state) => ({
          path: { ...state.path, current: stageId }
        })),
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
      setPathStages: (pathStages) => set({ pathStages }),
    }),
    {
      name: 'grind-storage',
      storage: createJSONStorage(() => mongoStorage),
      partialize: (state) => {
        const { authModalOpen, setAuthModalOpen, ...rest } = state;
        return rest;
      },
    }
  )
);