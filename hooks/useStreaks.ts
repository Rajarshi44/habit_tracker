'use client';

import { useHabitStore } from '@/lib/store';
import { calculateTaskStreaks, calculateDayStreak } from '@/lib/calculations';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function useStreaks() {
  const days = useHabitStore((s) => s.days);
  const bestStreaks = useHabitStore((s) => s.bestStreaks);
  
  const [taskStreaks, setTaskStreaks] = useState<Record<string, number>>({});
  const [dayStreak, setDayStreak] = useState(0);

  useEffect(() => {
    const today = new Date();
    setTaskStreaks(calculateTaskStreaks(days, today));
    setDayStreak(calculateDayStreak(days, today));
  }, [days]);

  return { taskStreaks, dayStreak, bestStreaks };
}