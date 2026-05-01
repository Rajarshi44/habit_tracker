'use client';

import { useHabitStore } from '@/lib/store';
import { TASKS } from '@/lib/constants';
import { TaskCard } from '@/components/ui/TaskCard';
import { AICoachCard } from '@/components/ui/AICoachCard';
import { QUOTES } from '@/lib/quotes';
import { format } from 'date-fns';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function TodayView() {
  const settings = useHabitStore((s) => s.settings);
  const now = new Date();
  const dateStr = format(now, 'yyyy-MM-dd');
  
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };
  
  // Calculate done tasks for today
  const dayData = useHabitStore((s) => s.days[dateStr]) || {};
  const doneCount = TASKS.filter(t => dayData[t.id] === 'done').length;
  const pct = (doneCount / TASKS.length) * 100;
  
  const quoteIndex = now.getDate() % QUOTES.length;
  const quote = QUOTES[quoteIndex];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting()}, {settings.name}.</h1>
          <p className="text-[var(--text-secondary)] font-mono text-sm mt-1">
            {format(now, 'EEEE, d MMMM yyyy')}
          </p>
        </div>
        <Link href="/settings" className="p-2 rounded-full hover:bg-[var(--surface-3)] transition-colors text-[var(--text-secondary)]">
          <Settings size={20} />
        </Link>
      </header>

      {/* AI ORACLE BRIEFING */}
      <AICoachCard />

      {/* STATS OVERVIEW */}
      <div className="flex gap-4 items-center p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-[var(--surface-3)]" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              className="stroke-emerald-500 transition-all duration-1000 ease-out" 
              strokeWidth="8" fill="none" strokeLinecap="round"
              strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * pct) / 100}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-xl font-bold">{doneCount}/{TASKS.length}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col">
            <span className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-wider mb-1">🔥 Day Streak</span>
            <span className="font-bold text-lg">12 days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-wider mb-1">✓ Done Today</span>
            <span className="font-bold text-lg">{doneCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-wider mb-1">→ Skipped</span>
            <span className="font-bold text-lg">{TASKS.filter(t => dayData[t.id] === 'skip').length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-wider mb-1">⚡ Best Day</span>
            <span className="font-bold text-lg">6/6</span>
          </div>
        </div>
      </div>

      {/* SCHEDULE */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Today's Schedule</h2>
        {TASKS.map((task) => (
          <TaskCard key={task.id} task={task} dateStr={dateStr} />
        ))}
      </section>

      {/* FOOTER WIDGETS */}
      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border-bright)]">
          <p className="text-sm text-[var(--text-secondary)] mb-3">How's the grind today?</p>
          <div className="flex justify-between">
            {['😩', '😕', '😐', '🙂', '🔥'].map((emoji, i) => (
              <button key={emoji} 
                className="text-2xl hover:scale-125 transition-transform hover:bg-[var(--surface-3)] p-2 rounded-full"
                onClick={() => useHabitStore.getState().setMood(dateStr, (i + 1) as any)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--surface-2)] flex flex-col justify-center">
          <p className="text-sm font-medium italic text-[var(--text-primary)]">"{quote.text}"</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-2 font-mono">— {quote.author}</p>
        </div>
      </div>

    </div>
  );
}