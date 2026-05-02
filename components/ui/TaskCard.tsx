'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Check, X, Code, Brain, BookOpen, Layers, Sparkles } from 'lucide-react';
import { Task } from '@/lib/types';
import { useHabitStore } from '@/lib/store';
import { useStreaks } from '@/hooks/useStreaks';
import { AiInsightCard } from './AiInsightCard';
import { useGemini } from '@/hooks/useGemini';
import { useState } from 'react';

const ICONS: Record<string, React.ElementType> = {
  Code, Brain, BookOpen, Layers
};

export function TaskCard({ task, dateStr }: { task: Task, dateStr: string }) {
  const status = useHabitStore((s) => s.days[dateStr]?.[task.id] || 'none');
  const toggleTask = useHabitStore((s) => s.toggleTask);
  const { taskStreaks, bestStreaks } = useStreaks();
  const Icon = ICONS[task.icon] || Code;

  const { getTaskInsight, loading } = useGemini();
  const [insight, setInsight] = useState<string | null>(null);

  const isDone = status === 'done';
  const isSkip = status === 'skip';
  const currentStreak = taskStreaks[task.id] || 0;
  const bestStreak = bestStreaks[task.id] || 0;

  const fetchInsight = async () => {
    if (insight) return; // already fetched this session
    // Provide generic recentData logic - this should ideally be derived from actual past days
    const res = await getTaskInsight({
      taskName: task.name,
      rate: 85, // mockup global rate
      streak: currentStreak,
      bestStreak: bestStreak,
      skipPattern: "Skipped on weekends roughly 30% of the time",
      recentData: "done, done, skip, done, done"
    });
    setInsight(res);
  };

  return (
    <div className="flex flex-col">
      <motion.div 
        whileHover={{ y: -2 }}
        className={clsx(
          "relative flex items-center justify-between p-4 border-b border-x lg:border-l-0 lg:border-r-0 lg:border-x-transparent transition-all duration-300 group",
          isDone ? "border-emerald-500/30 bg-emerald-500/5 shadow-[inset_4px_0_0_0_#10b981]" : 
          isSkip ? "border-orange-500/20 bg-transparent opacity-50 shadow-[inset_4px_0_0_0_#f97316]" : 
          "border-[var(--border)] bg-transparent hover:bg-[var(--surface)] shadow-[inset_4px_0_0_0_var(--surface-3)] hover:shadow-[inset_4px_0_0_0_var(--text-secondary)]"
        )}
      >
        <div className="flex items-center gap-5">
          <div className={clsx(
            "flex items-center justify-center w-10 h-10 rounded border transition-colors", 
            isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : 
            isSkip ? "border-orange-500/20 bg-orange-500/5 text-orange-500/50" :
            "border-[var(--border-bright)] bg-[var(--surface-2)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
          )}>
            <Icon strokeWidth={1.5} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className={clsx(
                "font-medium text-[15px] tracking-tight transition-colors",
                isSkip ? "line-through text-[var(--text-tertiary)]" : isDone ? "text-emerald-50" : "text-[var(--text-primary)]"
              )}>{task.name}</h3>
              {task.rotating && (
                <span className="px-1.5 py-0.5 rounded-sm border border-emerald-500/20 text-[9px] font-mono bg-emerald-500/5 text-emerald-500 uppercase tracking-[0.2em]">Rotation</span>
              )}
            </div>
            <p className="text-[10px] mt-1.5 flex items-center gap-3 font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
              <span className={clsx(isDone && "text-emerald-500/50")}>{task.time}</span>
              <span className="opacity-20">/</span>
              <span className={clsx(isDone && "text-emerald-500/50")}>{task.duration}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); fetchInsight(); }}
                className={clsx(
                  "flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-[var(--border)] rounded px-1.5 py-0.5",
                  isDone ? "hover:border-emerald-500/50 hover:text-emerald-400 bg-emerald-500/5" : "hover:border-amber-500/50 hover:text-amber-400 bg-[var(--surface)]"
                )}
                title="Request Protocol Analysis"
              >
                <Sparkles size={10} className="mr-1" /> AI
              </button>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentStreak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 h-8 text-[10px] font-mono tracking-widest text-emerald-500 mr-2 bg-emerald-500/5 border border-emerald-500/10 rounded">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentStreak} DAY
            </div>
          )}
          <div className="flex items-stretch bg-[var(--surface)] border border-[var(--border)] p-1 rounded-md">
            <button 
              title="Bypass Protocol"
              onClick={() => toggleTask(dateStr, task.id, 'skip')}
              className={clsx(
                "flex items-center justify-center px-3 h-8 text-[11px] font-mono uppercase tracking-[0.1em] rounded-sm transition-all focus:scale-95",
                isSkip ? "bg-orange-500 text-[var(--background)] shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "text-[var(--text-tertiary)] hover:bg-[var(--surface-3)] hover:text-orange-500"
              )}
            >
              SKIP
            </button>
            <div className="w-[1px] bg-[var(--border)] mx-0.5 my-1" />
            <button 
              onClick={() => toggleTask(dateStr, task.id, 'done')}
              className={clsx(
                "flex items-center justify-center px-3 h-8 text-[11px] font-mono uppercase tracking-[0.1em] rounded-sm transition-all focus:scale-95",
                isDone ? "bg-emerald-500 text-[var(--background)] shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-emerald-500"
              )}
            >
              EXECUTE
            </button>
          </div>
        </div>
      </motion.div>
      
      <AiInsightCard loading={loading} insight={insight} onClose={() => setInsight(null)} />
    </div>
  );
}
