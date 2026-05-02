'use client';

import { useHabitStore } from '@/lib/store';

import { format, subDays, startOfWeek, isSameMonth } from 'date-fns';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';

export default function HeatmapPage() {
  const allDays = useHabitStore((s) => s.days);
  const tasks = useHabitStore((s) => s.tasks);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const today = new Date();

  const getDayColor = (dateStr: string) => {
    const data = allDays[dateStr];
    if (!data) return 'bg-[var(--surface-2)] font-transparent';
    
    let done = 0;
    let skip = 0;
    
    tasks.forEach(t => {
      if (data[t.id] === 'done') done++;
      if (data[t.id] === 'skip') skip++;
    });

    if (done === 0 && skip > 0) return 'bg-orange-500/20 border-orange-500/20 font-transparent';
    if (done === 0) return 'bg-[var(--surface-2)] font-transparent';
    if (done <= 1) return 'bg-emerald-950 font-transparent';
    if (done <= 2) return 'bg-emerald-800 font-transparent';
    if (done <= 3) return 'bg-emerald-600 font-transparent';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-transparent';
  };

  const getTaskColor = (dateStr: string, taskId: string, color: string) => {
    const val = allDays[dateStr]?.[taskId];
    if (val === 'done') return color;
    if (val === 'skip') return '#f9731640'; // orange-500 rounded 20%
    return 'transparent';
  };

  if (!mounted) return null;

  // Let's do 52 weeks (364 days)
  const daysArray = Array.from({ length: 364 }).map((_, i) => {
    const d = subDays(today, 363 - i);
    return { date: d, dateStr: format(d, 'yyyy-MM-dd') };
  });

  // Calculate month label positions
  const monthLabels: { label: string, colIndex: number }[] = [];
  let lastMonth = -1;
  daysArray.forEach((day, i) => {
    if (i % 7 === 0) { // Check only first day of the week
      const currentMonth = day.date.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({ label: format(day.date, 'MMM'), colIndex: Math.floor(i / 7) });
        lastMonth = currentMonth;
      }
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <header className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <h1 className="text-[10px] font-mono leading-none tracking-[0.2em] text-[var(--text-secondary)] uppercase">Telemetry // Heatmap</h1>
        </div>
        <div>
          <p className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight text-[var(--text-primary)]">Visualize Consistency.</p>
        </div>
      </header>
      
      {/* MAIN OVERALL GRID */}
      <div className="flex flex-col w-full overflow-hidden">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)] border-b border-[var(--border)] pb-2 mb-6">Overall Completion Matrix</h2>
        
        <div className="relative w-full overflow-x-auto pb-6 scrollbar-thin">
          <div className="min-w-max relative">
            {/* MONTH LABELS */}
            <div className="flex h-6 relative w-full mb-1">
              {monthLabels.map((lbl, idx) => (
                <div 
                  key={idx} 
                  className="absolute text-[10px] font-mono text-[var(--text-tertiary)]"
                  style={{ left: `${lbl.colIndex * 15}px`, width: '15px' }}
                >
                  {lbl.label}
                </div>
              ))}
            </div>

            {/* HEATMAP GRID */}
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-full relative">
              {daysArray.map((day, i) => (
                  <div 
                    key={day.dateStr}
                    title={day.dateStr}
                    className={clsx(
                      "w-[11px] h-[11px] rounded-sm transition-colors",
                      getDayColor(day.dateStr),
                      day.dateStr === format(today, 'yyyy-MM-dd') ? "border border-white/40" : "border border-black/10"
                    )}
                  />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 mt-4 text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
          <span>Sparse</span>
          <div className="w-2.5 h-2.5 bg-[var(--surface-2)]"></div>
          <div className="w-2.5 h-2.5 bg-emerald-950"></div>
          <div className="w-2.5 h-2.5 bg-emerald-800"></div>
          <div className="w-2.5 h-2.5 bg-emerald-600"></div>
          <div className="w-2.5 h-2.5 bg-emerald-500"></div>
          <span>Dense</span>
        </div>
      </div>

      {/* PER-TASK MINI HEATMAPS */}
      <div className="space-y-4 pt-4">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)] border-b border-[var(--border)] pb-2 mb-6">Execution Arrays (Per Task)</h2>
        <div className="grid gap-3">
          {tasks.map(task => (
            <div key={task.id} className="p-4 border-b border-x lg:border-l-0 lg:border-r-0 lg:border-x-transparent bg-transparent hover:bg-[var(--surface)] shadow-[inset_4px_0_0_0_var(--surface-2)] overflow-x-auto flex items-center gap-6 transition-colors">
                <div className="w-40 flex-shrink-0">
                  <span className="text-[13px] font-medium tracking-tight block transition-colors" style={{ color: task.color }}>{task.name}</span>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest mt-1 block">{task.time}</span>
                </div>
                <div className="flex-1 w-full min-w-max relative group">
                  <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                    {daysArray.map((day) => (
                      <div 
                        key={day.dateStr}
                        title={`${day.dateStr} - ${task.name}`}
                        className={clsx(
                          "w-2 h-2 transition-colors",
                          day.dateStr === format(today, 'yyyy-MM-dd') ? "border border-[var(--text-secondary)]" : ""
                        )}
                        style={{ 
                          backgroundColor: getTaskColor(day.dateStr, task.id, task.color),
                          ...(getTaskColor(day.dateStr, task.id, task.color) === 'transparent' ? { backgroundColor: 'var(--surface-2)' } : {})
                        }}
                      />
                    ))}
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}