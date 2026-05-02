'use client';

import { format, parse, isBefore, addDays, getHours, getMinutes, addMinutes, differenceInMinutes, set } from 'date-fns';
import { useHabitStore } from './store';
import { Settings } from './types';

// Constants for Notifications
export const SCHEDULE_BLOCKS = [
  { id: 'morning_routine', label: 'Morning Routine & Gym', start: '08:00', end: '10:00' },
  { id: 'web_dev', label: 'Web Dev (2h 15m)', start: '10:30', end: '12:45' },
  { id: 'ai_ml', label: 'AI/ML', start: '12:00', end: '14:00' }, // Overlaps as requested by user logic, but strictly defining for SW
  { id: 'college_study', label: 'College Subject', start: '15:30', end: '16:30' },
  { id: 'dsa', label: 'DSA Block', start: '18:30', end: '20:00' },
  { id: 'evening_session', label: 'Evening Session', start: '20:30', end: '21:30' },
  { id: 'night_session', label: 'Final Push / Night', start: '23:45', end: '02:00' },
];

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications.');
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered with scope:', registration.scope);
      return registration;
    } catch (err) {
      console.error('ServiceWorker registration failed:', err);
      return null;
    }
  }
  return null;
}

export function testNotification() {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('GRIND: Test Notification', {
        body: 'If you see this, the system is fully armed and operational.',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'test-notification',
      } as any);
    });
  }
}

export async function scheduleNotification(title: string, options: NotificationOptions, delayMs: number = 0) {
  if (Notification.permission !== 'granted') return;

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      payload: {
        title,
        options,
        delay: delayMs
      }
    });
  } else {
    // Fallback if SW is not controlling the page yet
    if (delayMs > 0) {
      setTimeout(() => {
        new Notification(title, options);
      }, delayMs);
    } else {
      new Notification(title, options);
    }
  }
};

export function syncScheduleToServiceWorker(settings: Settings) {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.controller?.postMessage({
      type: 'SYNC_SETTINGS',
      settings,
      schedule: SCHEDULE_BLOCKS,
    });
  }
}

// Client-side execution helper for manual overrides or active-tab checks
export function checkAndTriggerCheckins(settings: Settings, dayStreak: number, completedTasksCount: number) {
  // Normally handled by SW, but this pushes client-side checks if the app is open
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (settings.eveningCheckIn && currentHour === 21 && currentMinute === 0) {
    // 9:00 PM Check-in
    let msg = "";
    if (completedTasksCount <= 1) msg = "Still time. What's one block you can do right now?";
    else if (completedTasksCount <= 3) msg = "Halfway there. Keep going.";
    else if (completedTasksCount <= 5) msg = "Almost there. Strong finish?";
    else msg = "Full day. Mark your mood. 🔥";

    triggerUIOrSWNotification("Evening Check-in", `You've done ${completedTasksCount}/6 today.\n${msg}`);
  }

  if (settings.streakProtection && currentHour === 23 && currentMinute === 0 && dayStreak > 3 && completedTasksCount < 3) {
    triggerUIOrSWNotification("Streak at Risk", `🔥 ${dayStreak}d streak at risk.\nYou need to complete more tasks immediately.`);
  }

  if (settings.midnightWarning && currentHour === 23 && currentMinute === 59 && completedTasksCount < 3) {
     triggerUIOrSWNotification("1 MINUTE TO MIDNIGHT", `Last chance for today's habit log.`);
  }
}

function triggerUIOrSWNotification(title: string, body: string) {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(`GRIND: ${title}`, {
        body,
        icon: '/icon-192x192.png',
        requireInteraction: true,
      });
    });
  }
}