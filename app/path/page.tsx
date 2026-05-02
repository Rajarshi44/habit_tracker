'use client';

import { useHabitStore } from '@/lib/store';
import { format, differenceInDays, addDays } from 'date-fns';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { Check, Lock, ChevronRight, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

export default function PathPage() {
  const path = useHabitStore((s) => s.path);
  const updatePath = useHabitStore((s) => s.updatePath);
  const subjects = useHabitStore((s) => s.subjects) || [];
  const pathStages = useHabitStore((s) => s.pathStages) || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const baseDate = new Date('2026-05-02');
  const today = new Date();
  
  // Handle positive and negative day differences accurately
  const getSubjectForDate = (date: Date) => {
    if (subjects.length === 0) return 'None';
    const diff = differenceInDays(date, baseDate);
    const index = ((diff % subjects.length) + subjects.length) % subjects.length;
    return subjects[index];
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
      <header className="border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <h1 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">Telemetry // Path</h1>
        </div>
        <p className="text-3xl font-bold tracking-tight mt-2 text-white">Progression & Rotation.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">Learning Pipeline</h2>
        
        {pathStages.length === 0 ? (
          <div className="p-8 border border-white/5 rounded-2xl text-center bg-[#0A0A0A]">
            <p className="text-white/40 font-mono text-sm mb-4">No pipeline stages configured.</p>
            <Link href="/settings" className="inline-flex px-5 py-2.5 bg-white/5 text-white font-mono text-xs tracking-wider uppercase rounded-lg border border-white/10 hover:border-emerald-500 hover:text-emerald-500 transition-all">
              Configure Pipeline
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-center overflow-x-auto pb-4">
            {pathStages.map((stage, idx) => {
              const isCurrent = path.current === stage.id;
              const pct = path.pct?.[stage.id] || 0;
              const completedStr = path.completedDates?.[stage.id];
              const isCompleted = !!completedStr || pct === 100;
              const isLocked = !isCurrent && !isCompleted;

              return (
                <div key={`stage-wrapper-${stage.id}`} className="flex items-center w-full md:w-auto md:min-w-[320px] flex-shrink-0">
                  <div 
                    className={clsx(
                      "relative p-6 rounded-2xl border transition-all duration-300 w-full",
                      isCurrent ? "bg-[#111] shadow-2xl scale-105 z-10" : "bg-black",
                      isLocked && "opacity-50 grayscale"
                    )}
                    style={{ 
                      boxShadow: isCurrent ? `0 10px 40px ${stage.color}15` : 'none',
                      borderColor: isCurrent ? stage.color : 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold flex items-center gap-2 text-white">
                          {stage.name}
                          {isCompleted && <Check size={14} className="text-emerald-500" />}
                          {isLocked && <Lock size={14} className="text-white/20" />}
                        </h3>
                        <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">{stage.source}</p>
                        <p className="text-sm text-white/60 mt-2">{stage.description}</p>
                      </div>
                      <div className="text-xl font-mono font-bold" style={{ color: isCurrent ? stage.color : 'rgba(255,255,255,0.2)'}}>
                        {pct}%
                      </div>
                    </div>

                    {isCurrent ? (
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-[10px] text-white/40 uppercase font-mono tracking-widest">
                          <span>Progress Tracker</span>
                          <span>Drag to sync</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={pct}
                          onChange={(e) => updatePath(stage.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          style={{ accentColor: stage.color }}
                        />
                      </div>
                    ) : (
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-6">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: stage.color }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {idx < pathStages.length - 1 && (
                    <div className="hidden md:flex justify-center items-center px-4 text-white/20">
                      <ChevronRight size={24} />
                    </div>
                  )}
                  {/* Mobile downward arrow */}
                  {idx < pathStages.length - 1 && (
                    <div className="flex md:hidden justify-center items-center py-4 w-full text-white/20">
                      <ChevronRight size={24} className="rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4 pt-8">
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">Dynamic Rotation List</h2>
        {subjects.length === 0 ? (
          <div className="p-8 border border-white/5 rounded-2xl text-center bg-[#0A0A0A]">
             <p className="text-white/40 font-mono text-sm mb-4">No rotation subjects defined.</p>
             <Link href="/settings" className="inline-flex px-5 py-2.5 bg-white/5 text-white font-mono text-xs tracking-wider uppercase rounded-lg border border-white/10 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                Configure Rotation
             </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subj) => (
              <div 
                key={subj}
                className={clsx(
                  "p-6 rounded-2xl border transition-colors relative overflow-hidden",
                  subj === todaySubject ? "bg-emerald-950/20 border-emerald-900/50" : "bg-black border-white/5"
                )}
              >
                {subj === todaySubject && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                )}
                <h3 className="font-bold text-white flex items-center gap-2">
                  {subj === todaySubject && <Activity size={14} className="text-emerald-500" />}
                  {subj}
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-mono text-white/40 mt-2">
                  {subj === todaySubject ? "Active Focus" : "Pending Rotation"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 14 DAYS MINI CALENDAR */}
      {subjects.length > 0 && (
      <section className="space-y-4 pt-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
          <Calendar size={14} /> 14-Day Projection
        </h2>
        <div className="p-1 rounded-2xl bg-black border border-white/5 overflow-x-auto w-full no-scrollbar">
          <div className="flex w-max min-w-full">
            {next14Days.map((ds, idx) => (
               <div 
                 key={idx} 
                 className={clsx(
                   "flex flex-col items-center justify-center py-5 px-6 min-w-[80px] border-r border-white/5 last:border-r-0 transition-colors",
                   ds.isToday ? "bg-[#111] text-emerald-400" : "text-white/40 hover:bg-white/5"
                 )}
               >
                 <span className="text-[10px] font-mono uppercase mb-2 tracking-widest">{ds.dayName}</span>
                 <span className={clsx("font-bold mb-3 text-lg", ds.isToday ? "text-emerald-400" : "text-white")}>
                   {ds.dateStr.split(' ')[1]}
                 </span>
                 <span className={clsx(
                   "text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded w-full text-center truncate",
                   ds.isToday ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/60"
                 )} title={ds.subject}>
                   {ds.subject.length > 8 ? ds.subject.substring(0, 6) + '..' : ds.subject}
                 </span>
               </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </div>
  );
}