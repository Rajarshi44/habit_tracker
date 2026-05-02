'use client';

import { useHabitStore } from '@/lib/store';
import { PATH_STAGES, TASKS, SUBJECTS } from '@/lib/constants';
import { TaskCard } from '@/components/ui/TaskCard';
import { AICoachCard } from '@/components/ui/AICoachCard';
import { QUOTES } from '@/lib/quotes';
import { format } from 'date-fns';
import { Settings, RefreshCw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useStreaks } from '@/hooks/useStreaks';
import { useGemini } from '@/hooks/useGemini';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { getCollegeSubject } from '@/lib/calculations';

export default function TodayView() {
  const settings = useHabitStore((s) => s.settings);  
  const allDays = useHabitStore((s) => s.days);
  const pathState = useHabitStore((s) => s.path);
  const tasks = useHabitStore((s) => s.tasks);
  const subjects = useHabitStore((s) => s.subjects);
  const setTasks = useHabitStore((s) => s.setTasks);
  const setSubjects = useHabitStore((s) => s.setSubjects);
  const setMood = useHabitStore((s) => s.setMood);
  const now = new Date();
  const dateStr = format(now, 'yyyy-MM-dd');
  const { dayStreak } = useStreaks();
  const { getSmartQuote, loading: quoteLoading } = useGemini();
  const [geminiQuote, setQuote] = useState<string | null>(null);

  const fetchQuote = async (force = false) => {
    const res = await getSmartQuote({
      streakSummary: `${dayStreak} days`,
      recentRate: 80,
      stage: 'Frontend Foundation',
      dayName: format(now, 'EEEE'),
    }, force);
    setQuote(res);
  };

  useEffect(() => {
    fetchQuote();
  }, []);
  
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };
  
  // Calculate done tasks for today
  const dayData = allDays[dateStr] || {};
  const doneCount = tasks.filter(t => dayData[t.id] === 'done').length;
  const pct = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;
  
  // Calculate best day stats
  let bestDayCount = 0;
  Object.values(allDays).forEach(day => {
    const dailyDoneCount = tasks.filter(t => day[t.id] === 'done').length;
    if (dailyDoneCount > bestDayCount) {
      bestDayCount = dailyDoneCount;
    }
  });

  // Get active path stage name
  const currentStageName = PATH_STAGES.find(s => s.id === pathState.current)?.name || 'Web Dev';

  const loadTemplate = () => {
    setTasks(TASKS);
    setSubjects(SUBJECTS);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* SPLIT-GRID HERO */}
      <header className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end border-b border-[var(--border)] pb-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <h1 className="text-[10px] font-mono leading-none tracking-[0.2em] text-[var(--text-secondary)] uppercase">Telemetry // Live</h1>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight text-[var(--text-primary)]">
              {getGreeting()},<br />{settings.name}.
            </p>
            <p className="text-[var(--text-secondary)] font-mono text-xs mt-3 uppercase tracking-[0.1em]">
              {format(now, 'EEEE')} <span className="opacity-30 mx-2">|</span> {format(now, 'd MMM yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-6 justify-end">
          <Link href="/settings" className="flex items-center justify-center p-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded text-[var(--text-secondary)] hover:text-emerald-500 hover:border-[var(--border-bright)] transition-colors">
            <Settings size={16} strokeWidth={1.5} />
          </Link>
          
          <div className="text-left md:text-right font-mono">
            <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-1.5">Daily Completion</div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-emerald-500 tabular-nums">
                {Math.round(pct)}<span className="text-lg text-[var(--text-secondary)]">%</span>
              </span>
              <div className="hidden sm:block w-24 h-1.5 bg-[var(--surface-2)] overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                  style={{ width: `${pct}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI ORACLE BRIEFING */}
      <AICoachCard />

      {/* STATS TELEMETRY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-bright)] border-y border-[var(--border)]">
        <div className="flex flex-col p-4 md:p-6 bg-[var(--surface)]/20 hover:bg-[var(--surface-2)] transition-colors">
          <span className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-[0.15em] mb-2">Active Streak</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-3xl tabular-nums text-[var(--text-primary)]">{dayStreak}</span>
            <span className="text-sm font-mono text-[var(--text-secondary)]">DAYS</span>
          </div>
        </div>
        
        <div className="flex flex-col p-4 md:p-6 bg-[var(--surface)]/20 hover:bg-[var(--surface-2)] transition-colors">
          <span className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-[0.15em] mb-2">Executed Today</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-3xl tabular-nums text-emerald-500">{doneCount}</span>
            <span className="text-sm font-mono text-[var(--text-secondary)]">TASKS</span>
          </div>
        </div>

        <div className="flex flex-col p-4 md:p-6 bg-[var(--surface)]/20 hover:bg-[var(--surface-2)] transition-colors">
          <span className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-[0.15em] mb-2">Bypassed</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-3xl tabular-nums text-orange-500">
              {tasks.filter(t => dayData[t.id] === 'skip').length}
            </span>
            <span className="text-sm font-mono text-[var(--text-secondary)]">TASKS</span>
          </div>
        </div>

        <div className="flex flex-col p-4 md:p-6 bg-[var(--surface)]/20 hover:bg-[var(--surface-2)] transition-colors">
          <span className="text-[var(--text-secondary)] text-[10px] font-mono uppercase tracking-[0.15em] mb-2">Peak Capacity</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-3xl tabular-nums text-[var(--text-primary)]">{bestDayCount}</span>
            <span className="text-sm font-mono text-[var(--text-secondary)]">MAX</span>
          </div>
        </div>
      </div>

      {/* SCHEDULE GRID */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)] border-b border-[var(--border)] pb-2">Active Protocol</h2>
        {tasks.length === 0 ? (
          <div className="p-8 border border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center text-center bg-[var(--surface)]/50">
            <p className="text-[var(--text-secondary)] font-mono text-sm mb-6">No tasks defined for your routine.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/settings" className="px-5 py-2.5 bg-[var(--surface-3)] text-[var(--text-primary)] font-mono text-xs tracking-wider uppercase rounded-lg border border-[var(--border-bright)] hover:border-emerald-500 hover:text-emerald-500 transition-all">
                Initialize Protocol
              </Link>
              {settings.email === 'mrajarshi570@gmail.com' && (
                <button 
                  onClick={loadTemplate}
                  className="px-5 py-2.5 bg-emerald-500/10 text-emerald-500 font-mono text-xs tracking-wider uppercase rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                >
                  Load Developer Template
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => {
            const displayTask = { ...task };
            if (task.path) {
              displayTask.name = `${task.name}: ${currentStageName}`;
            }
            if (task.rotating) {
              const { current } = getCollegeSubject(now);
              if (current !== 'None') {
                 displayTask.name = `${task.name}: ${current}`;
              }
            }
            return <TaskCard key={task.id} task={displayTask} dateStr={dateStr} />;
          })}
          </div>
        )}
      </section>

      {/* FOOTER WIDGETS (BENTO 2.0) */}
      <div className="grid md:grid-cols-[1fr_2fr] gap-6 pt-8 border-t border-[var(--border)]">
        {/* MOOD TRACKER */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Systems Check</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Log your cognitive load & physical state today.</p>
          </div>
          <div className="flex gap-2 mt-6">
            {[
              { val: 1, label: 'LOW' },
              { val: 2, label: 'SUB' },
              { val: 3, label: 'AVG' },
              { val: 4, label: 'OPT' },
              { val: 5, label: 'MAX' }
            ].map((level) => {
              const currentMood = dayData.mood;
              const isSelected = currentMood === level.val;
              return (
                <button 
                  key={level.val}
                  onClick={() => setMood(dateStr, level.val as any)}
                  className={clsx(
                    "flex-1 flex flex-col items-center justify-center py-3 rounded border transition-all duration-300",
                    isSelected 
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[inset_0_1px_0_rgba(16,185,129,0.2)]" 
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-bright)] hover:bg-[var(--surface-3)] hover:-translate-y-[1px]"
                  )}
                >
                  <span className="font-mono font-bold text-lg leading-none">{level.val}</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-50 mt-1">{level.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUOTE MODULE */}
        <div className="relative group overflow-hidden border border-[var(--border)] bg-[var(--surface)] rounded flex flex-col justify-center p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <button 
            onClick={() => fetchQuote(true)}
            className="absolute top-4 right-4 p-1.5 text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors z-10 bg-[var(--background)] border border-[var(--border)] rounded"
            disabled={quoteLoading}
            title="Refresh Directives"
          >
            <RefreshCw size={14} className={quoteLoading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-emerald-500" />
            <h3 className="text-[10px] text-emerald-500 font-mono uppercase tracking-[0.15em]">Directive Payload</h3>
          </div>
          
          <p className="text-base font-medium leading-relaxed text-[var(--text-primary)] max-w-[90%]">
            {quoteLoading && !geminiQuote 
              ? "Synthesizing variables..." 
              : `"${geminiQuote || "Discipline equals freedom. Automate your execution."}"`
            }
          </p>
        </div>
      </div>

    </div>
  );
}