'use client';

import { useEffect } from 'react';
import { useHabitStore } from '@/lib/store';
import { checkAndTriggerCheckins, SCHEDULE_BLOCKS } from '@/lib/notifications';
import { format } from 'date-fns';

export function NotificationEngine() {
  const settings = useHabitStore((s) => s.settings);
  const days = useHabitStore((s) => s.days);
  const streaks = useHabitStore((s) => s.streaks);
  const tasks = useHabitStore((s) => s.tasks);
  
  useEffect(() => {
    // We only attach this engine if permissions are presumed granted/requested
    // and if notifications are enabled.
    
    // A 60-second polling loop to trigger check-ins locally 
    // when the PWA is open or running in background tab.
    const interval = setInterval(() => {
      const now = new Date();
      const dateStr = format(now, 'yyyy-MM-dd');
      
      const dayData = days[dateStr] || {};
      const completedTasksCount = tasks.filter(t => dayData[t.id] === 'done').length;
      // Get the highest streak among tasks (simplified logic for overarching 'day streak')
      const highestStreak = Math.max(0, ...Object.values(streaks));
      
      // Call the main check function that handles 9 PM, Midnight, etc.
      checkAndTriggerCheckins(settings, highestStreak, completedTasksCount);
      
      // Also check specific SCHEDULE_BLOCKS
      const currentTime = format(now, 'HH:mm');
      
      SCHEDULE_BLOCKS.forEach(block => {
        // Pre-task reminder (15 min before)
        if (settings.preTaskReminders) {
          const [h, m] = block.start.split(':').map(Number);
          const startMin = h * 60 + m;
          const [ch, cm] = currentTime.split(':').map(Number);
          const currentMin = ch * 60 + cm;
          
          if (startMin - currentMin === 15) {
             trigger('Incoming Block', `15 minutes until ${block.label} starts. Wrap up.`);
          }
        }

        // Exact start time
        if (settings.taskStartNotifications && currentTime === block.start) {
          trigger('Block Active', `${block.label} starts now. Let's go.`);
        }

        // Exact end time
        if (settings.endReminders && currentTime === block.end) {
          trigger('Block Complete', `${block.label} is done. Log your progress.`);
        }
      });
      
    }, 60000); // 1 minute interval
    
    // Check once explicitly on mount
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const dayData = days[dateStr] || {};
    const completedCount = tasks.filter(t => dayData[t.id] === 'done').length;
    const streak = Math.max(0, ...Object.values(streaks));
    checkAndTriggerCheckins(settings, streak, completedCount);

    return () => clearInterval(interval);
  }, [settings, days, streaks]);

  return null; // Silent Engine Component
}

function trigger(title: string, body: string) {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(`GRIND: ${title}`, {
        body,
        icon: '/icon-192x192.png',
      });
    });
  }
}
