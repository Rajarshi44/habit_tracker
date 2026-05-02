'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  generateDailyBriefing, 
  generateWeeklyReview, 
  generateTaskInsights, 
  generateSmartQuote 
} from '@/lib/gemini';

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const getDailyBriefing = useCallback(async (params: any, forceRegenerate = false) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cacheKey = `grind-briefing-${today}`;
    
    if (!forceRegenerate) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;
    }

    setLoading(true);
    try {
      const res = await generateDailyBriefing(
        params.name,
        params.todayDate,
        params.dayOfWeek,
        params.taskList,
        params.todaySubject,
        params.currentPathStage,
        params.stagePct,
        params.streakSummary,
        params.yesterdayStats,
        params.weekStats,
        params.yesterdayMood
      );
      localStorage.setItem(cacheKey, res);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSmartQuote = useCallback(async (params: any, forceRegenerate = false) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cacheKey = `grind-quote-${today}`;
    
    if (!forceRegenerate) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;
    }

    setLoading(true);
    try {
      const res = await generateSmartQuote(
        params.streakSummary,
        params.recentRate,
        params.stage,
        params.dayName
      );
      localStorage.setItem(cacheKey, res);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTaskInsight = useCallback(async (params: any) => {
    setLoading(true);
    try {
      return await generateTaskInsights(
        params.taskName,
        params.rate,
        params.streak,
        params.bestStreak,
        params.skipPattern,
        params.recentData
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeeklyReview = useCallback(async (params: any, forceRegenerate = false) => {
    const cacheKey = `grind-weekly-${params.weekNumber}`;
    if (!forceRegenerate) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;
    }

    setLoading(true);
    try {
      const res = await generateWeeklyReview(
        params.weekNumber,
        params.weekStart,
        params.weekEnd,
        params.dailyBreakdown,
        params.taskStats,
        params.skipData,
        params.moodData,
        params.streakChanges,
        params.pathProgress,
        params.subjData
      );
      localStorage.setItem(cacheKey, res);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getDailyBriefing,
    getSmartQuote,
    getTaskInsight,
    getWeeklyReview
  };
}