'use client';

import { useHabitStore } from '@/lib/store';
import { generateDailyBriefing, generateSmartQuote } from '@/lib/gemini';
import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function AICoachCard() {
  const settings = useHabitStore((s) => s.settings);
  const bestStreaks = useHabitStore((s) => s.bestStreaks);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBriefing() {
      // Cache briefing locally per day to save API calls
      const today = format(new Date(), 'yyyy-MM-dd');
      const cacheKey = `grind-ai-briefing-${today}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setBriefing(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      // We pass 0 for current streak temporarily as we need to calculate it properly
      // You would fetch 'currentStreak' from your streak logic here.
      const aiResponse = await generateDailyBriefing(settings.name, 0, Object.values(bestStreaks)[0] || 0);
      setBriefing(aiResponse);
      localStorage.setItem(cacheKey, aiResponse);
      setLoading(false);
    }
    
    if (settings.aiMorningBriefingNotification) {
       fetchBriefing();
    } else {
       setLoading(false);
       setBriefing(null);
    }
  }, [settings.name, settings.aiMorningBriefingNotification, bestStreaks]);

  if (!settings.aiMorningBriefingNotification) return null;

  return (
    <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-indigo-100 tracking-wide text-sm flex items-center gap-2">
              ORACLE COACH
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            </h3>
            <span className="text-xs text-indigo-300/50 font-mono">GEMINI 2.5</span>
          </div>
          
          <div className="text-indigo-200/90 text-sm leading-relaxed min-h-[40px]">
            {loading ? (
              <div className="space-y-2 pt-1 animate-pulse opacity-50">
                <div className="h-3 bg-indigo-400 rounded w-full"></div>
                <div className="h-3 bg-indigo-400 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="font-mono text-[13px]">{briefing}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}