'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Check, X, Code, Brain, BookOpen, Layers } from 'lucide-react';
import { Task } from '@/lib/types';
import { useHabitStore } from '@/lib/store';

const ICONS: Record<string, React.ElementType> = {
  Code, Brain, BookOpen, Layers
};

export function TaskCard({ task, dateStr }: { task: Task, dateStr: string }) {
  const status = useHabitStore((s) => s.days[dateStr]?.[task.id] || 'none');
  const toggleTask = useHabitStore((s) => s.toggleTask);
  const Icon = ICONS[task.icon] || Code;

  const isDone = status === 'done';
  const isSkip = status === 'skip';

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={clsx(
        "relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        isDone ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : 
        isSkip ? "border-orange-500/20 bg-[var(--surface)] opacity-70" : 
        "border-[var(--border)] bg-[var(--surface)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
      )}
      style={{ borderLeftColor: isDone ? '#10b981' : task.color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: `${task.color}15`, color: task.color }}>
          <Icon size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[15px]">{task.name}</h3>
            {task.rotating && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400">DBMS</span>
            )}
          </div>
          <p className={clsx("text-xs mt-0.5", isSkip ? "line-through text-[var(--text-tertiary)]" : "text-[var(--text-secondary)]")}>
            {task.time} <span className="mx-1 opacity-50">•</span> {task.duration}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex px-2 px-1 text-[11px] font-mono text-[var(--text-secondary)] mr-2 bg-[var(--surface-2)] rounded-md">
          🔥 3d
        </div>
        <button 
          title="Skip. Honest skips don't break streaks."
          onClick={() => toggleTask(dateStr, task.id, 'skip')}
          className={clsx(
            "flex items-center justify-center w-11 h-11 rounded-lg border transition-all",
            isSkip ? "bg-orange-500 text-white border-orange-500" : "border-[var(--border)] text-[var(--text-secondary)] hover:border-orange-500/50 hover:text-orange-500"
          )}
        >
          <X size={18} />
        </button>
        <button 
          onClick={() => toggleTask(dateStr, task.id, 'done')}
          className={clsx(
            "flex items-center justify-center w-11 h-11 rounded-lg border transition-all",
            isDone ? "bg-emerald-500 text-white border-emerald-500" : "border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-500/50 hover:text-emerald-500"
          )}
        >
          <Check size={18} strokeWidth={isDone ? 3 : 2} />
        </button>
      </div>
    </motion.div>
  );
}