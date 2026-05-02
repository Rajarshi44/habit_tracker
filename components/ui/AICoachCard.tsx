'use client';

import { useHabitStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { useGemini } from '@/hooks/useGemini';
import { useStreaks } from '@/hooks/useStreaks';
import { getCollegeSubject } from '@/lib/calculations';
import { TASKS } from '@/lib/constants';

export function AICoachCard() {
  const settings = useHabitStore((s) => s.settings);
  const allDays = useHabitStore((s) => s.days);
  const { dayStreak } = useStreaks();
  const { getDailyBriefing, loading } = useGemini();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const fetchBriefing = async (force = false) => {
    const today = new Date();
    const dateStr = format(today, 'yyyy-MM-dd');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    const yesterdayData = allDays[yesterdayStr];
    let yDone = 0;
    if (yesterdayData) {
      yDone = TASKS.filter(t => yesterdayData[t.id] === 'done').length;
    }

    const { current: todaySubject } = getCollegeSubject(today);

    const taskList = TASKS.map(t => `- ${t.name}`).join('\n');
    const streakSummary = `${dayStreak}d global streak.`;

    const res = await getDailyBriefing({
      name: settings.name,
      todayDate: dateStr,
      dayOfWeek: format(today, 'EEEE'),
      taskList: taskList,
      todaySubject: todaySubject,
      currentPathStage: 'Frontend Foundation', // Placeholder Path
      stagePct: 25,
      streakSummary,
      yesterdayStats: `${yDone}/${TASKS.length} tasks completed.`,
      weekStats: `In progress.`,
      yesterdayMood: yesterdayData?.mood ? `Score ${yesterdayData.mood}/5` : 'Not recorded'
    }, force);

    setBriefing(res);
  };

  useEffect(() => {
    if (settings.aiMorningBriefingNotification) {
      fetchBriefing();
    }
  }, [settings.name, settings.aiMorningBriefingNotification]);

  useEffect(() => {
    if (!briefing) return;
    if (!expanded) {
      setDisplayedText(briefing);
      return;
    }
    
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText(briefing.substring(0, i));
      i++;
      if (i > briefing.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [briefing, expanded]);

  if (!settings.aiMorningBriefingNotification) return null;

  return (
    <div className="p-5 rounded bg-[var(--surface)] border border-[var(--border)] relative transition-all duration-300 group hover:border-[var(--emerald-500)]/30">
      <div className="absolute top-0 left-0 w-0.5 h-full bg-emerald-500" />
      
      <div className="flex items-center justify-between pl-4 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-1.5 rounded-sm bg-emerald-500/10 text-emerald-500">
            <Sparkles size={14} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase">AI Protocol Override</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); fetchBriefing(true); }} 
            disabled={loading}
            className="text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
            {expanded ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
          </div>
        </div>
      </div>

      <div className={`pl-4 overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        {!briefing && loading ? (
          <div className="flex items-center gap-3 text-[var(--text-secondary)] text-[11px] font-mono mt-4 tracking-widest uppercase mb-2">
            <Loader2 size={12} className="animate-spin text-emerald-500" /> Compiling neural synthesis...
          </div>
        ) : (
          <div className="mt-4 text-[var(--text-primary)] text-sm whitespace-pre-wrap leading-loose border-l-2 border-[var(--surface-3)] pl-5 py-2 font-main">
            {displayedText}
          </div>
        )}
      </div>
      
      {!expanded && briefing && (
         <p className="pl-4 ml-10 mt-2 text-[11px] text-[var(--text-secondary)] truncate max-w-[85%] font-mono uppercase tracking-[0.05em] opacity-70">
           {briefing.split('\n').find(l => l.trim().length > 0)?.replace(/^\d+\.\s*/, '')}
         </p>
      )}
    </div>
  );
}
