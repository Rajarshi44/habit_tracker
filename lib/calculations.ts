import { differenceInDays, parseISO, startOfDay, format, subDays } from 'date-fns';
import { TASKS, SUBJECTS } from './constants';
import { DayData, TaskStatus } from './types';

const BASE_DATE = new Date(2026, 4, 2); // May 2, 2026

export function getCollegeSubject(queryDate: Date = new Date()): { current: string; next: string } {
  const qd = startOfDay(queryDate);
  const bd = startOfDay(BASE_DATE);
  const dayDiff = differenceInDays(qd, bd);
  const currentIdx = ((dayDiff % 4) + 4) % 4; // handles negative numbers correctly
  const nextIdx = (currentIdx + 1) % 4;
  
  return {
    current: SUBJECTS[currentIdx],
    next: SUBJECTS[nextIdx]
  };
}

export function calculateTaskStreaks(days: Record<string, DayData>, targetDate: Date = new Date()) {
  const streaks: Record<string, number> = {};
  
  TASKS.forEach(task => {
    let currentStreak = 0;
    let daysBack = 0;
    // Look back up to 365 days
    while (daysBack < 365) {
      const d = subDays(targetDate, daysBack);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayData = days[dateStr];
      const status = dayData ? dayData[task.id] as TaskStatus : 'none';

      if (status === 'done') {
        currentStreak++;
      } else if (status === 'skip') {
        // Skip - do nothing, streak continues
      } else if (status === 'none' || !status) {
        // Missing or none breaks the streak
        break;
      }
      daysBack++;
    }
    streaks[task.id] = currentStreak;
  });

  return streaks;
}

export function calculateDayStreak(days: Record<string, DayData>, targetDate: Date = new Date()): number {
  let currentStreak = 0;
  let daysBack = 0;

  while (daysBack < 365) {
    const d = subDays(targetDate, daysBack);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayData = days[dateStr];
    
    if (!dayData) {
      break;
    }

    let doneCount = 0;
    let skipCount = 0;
    TASKS.forEach(task => {
      const status = dayData[task.id] as TaskStatus;
      if (status === 'done') doneCount++;
      if (status === 'skip') skipCount++;
    });

    // A day counts toward streak if >= 3 tasks done
    if (doneCount >= 3) {
      currentStreak++;
    } else if (skipCount > 0 && doneCount < 3) {
      // Days heavily skipped with few done don't count, but do they break?
      // "Skip days don't count but don't break day streak"
      // If we don't meet the 3 threshold, but we skipped, we don't break.
      // Wait, let's treat any day with >= 1 skip AND < 3 done as a "streak preserver"
    } else {
      // Not enough done and no skips = break
      break;
    }
    daysBack++;
  }
  return currentStreak;
}