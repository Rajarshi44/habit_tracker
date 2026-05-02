'use client';

import { useHabitStore } from '@/lib/store';
import { PATH_STAGES, SUBJECTS } from '@/lib/constants';
import { format, differenceInDays, addDays } from 'date-fns';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { Check, Lock, ChevronRight, Calendar } from 'lucide-react';

export default function PathPage() {
  const path = useHabitStore((s) => s.path);
  const updatePath = useHabitStore((s) => s.updatePath);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const baseDate = new Date('2026-05-02');
  const today = new Date();
  
  // Handle positive and negative day differences accurately
  const getSubjectForDate = (date: Date) => {
    const diff = differenceInDays(date, baseDate);
    const index = ((diff % 4) + 4) % 4;
    return SUBJECTS[index];
  };
  
  const todaySubject = getSubjectForDate(today);

  // Generate next 14 days rotation array
  const next14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = addDays(today, i);
    return {
      dateStr: format(d, 'MMM d'),
      dayName: format(d, 'EE'),
      subject: getSubjectForDate(d),
      isToday: i === 0
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="border-b border-[var(--border)] pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f0db4f] shadow-[0_0_8px_rgba(240,219,79,0.8)]" />
          <h1 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">Telemetry // Path</h1>
        </div>
        <p className="text-3xl font-bold tracking-tight mt-2 text-[var(--text-primary)]">Progression & Rotation.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)]">Learning Pipeline</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {PATH_STAGES.map((stage, idx) => {
            const isCurrent = path.current === stage.id;
            const pct = path.pct[stage.id] || 0;
            const completedStr = path.completedDates[stage.id];
            const isCompleted = !!completedStr || pct === 100;
            const isLocked = !isCurrent && !isCompleted;

            return (
              <div key={`stage-wrapper-${stage.id}`} className="flex items-center w-full md:w-auto flex-1">
                <div 
                  className={clsx(
                    "relative p-5 rounded-2xl border transition-all duration-300 w-full",
                    isCurrent ? "bg-[var(--surface-3)] border-[var(--border-bright)] shadow-lg" : "bg-[var(--surface)] border-[var(--border)]",
                    isLocked && "opacity-50 grayscale",
                    isCurrent && "ring-1 ring-inset ring-white/10 flex-col"
                  )}
                  style={{ 
                    boxShadow: isCurrent ? `0 0 20px ${stage.color}15` : 'none',
                    borderColor: isCurrent ? stage.color : 'var(--border)'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold flex items-center gap-2">
                         {stage.name}
                         {isCompleted && <Check size={14} className="text-emerald-500" />}
                         {isLocked && <Lock size={14} className="text-[var(--text-tertiary)]" />}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{stage.description}</p>
                    </div>
                    <div className="text-lg font-mono font-bold" style={{ color: isCurrent ? stage.color : 'var(--text-secondary)'}}>
                      {pct}%
                    </div>
                  </div>

                  {isCurrent ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)] uppercase font-mono">
                        <span>Progress</span>
                        <span>Drag to update</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={pct}
                        onChange={(e) => updatePath(stage.id, parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-black/40 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: stage.color }}
                      />
                    </div>
                  ) : (
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mt-4">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: stage.color }}
                      />
                    </div>
                  )}
                </div>
                
                {idx < PATH_STAGES.length - 1 && (
                  <div className="hidden md:flex justify-center items-center px-2 text-[var(--text-tertiary)]">
                    <ChevronRight size={20} />
                  </div>
                )}
                {/* Mobile downward arrow */}
                {idx < PATH_STAGES.length - 1 && (
                  <div className="flex md:hidden justify-center items-center py-2 text-[var(--text-tertiary)]">
                    <ChevronRight size={20} className="rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)]">College Subject Rotation</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((subj) => (
            <div 
              key={subj}
              className={clsx(
                "p-5 rounded-2xl border border-[var(--border)] transition-colors relative overflow-hidden",
                subj === todaySubject ? "bg-emerald-950/20 border-emerald-900/50" : "bg-[var(--surface)]"
              )}
            >
              {subj === todaySubject && (
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              )}
              <h3 className="font-bold">{subj}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {subj === todaySubject ? "Today's Focus" : "Pending Rotation"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 14 DAYS MINI CALENDAR */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
          <Calendar size={14} /> Next 14 Days
        </h2>
        <div className="p-1 rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-x-auto w-full">
          <div className="flex w-max min-w-full">
            {next14Days.map((ds, idx) => (
               <div 
                 key={idx} 
                 className={clsx(
                   "flex flex-col items-center justify-center py-4 px-5 min-w-[70px] border-r border-[var(--border-bright)] last:border-r-0",
                   ds.isToday ? "bg-[var(--surface-3)] text-emerald-400" : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                 )}
               >
                 <span className="text-[10px] font-mono uppercase mb-1 opacity-70">{ds.dayName}</span>
                 <span className="font-bold mb-2">{ds.dateStr.split(' ')[1]}</span>
                 <span className="text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded bg-[var(--surface-2)] text-[var(--text-primary)]" title={ds.subject}>
                   {ds.subject.length > 6 ? ds.subject.substring(0, 4) + '..' : ds.subject}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}