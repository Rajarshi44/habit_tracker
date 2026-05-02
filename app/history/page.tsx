'use client';

import { useHabitStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List as ListIcon } from 'lucide-react';

export default function HistoryPage() {
  const allDays = useHabitStore((s) => s.days);
  const tasks = useHabitStore((s) => s.tasks);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const allLoggedDates = Object.keys(allDays).sort((a, b) => b.localeCompare(a));

  const getEmoji = (mood?: number) => {
    if (!mood) return null;
    return ['😩', '😕', '😐', '🙂', '🔥'][mood - 1];
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="border-b border-[var(--border)] pb-6 mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <h1 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">Telemetry // History</h1>
          </div>
          <p className="text-3xl font-bold tracking-tight mt-2 text-[var(--text-primary)]">Look back at the grind.</p>
        </div>
        <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] w-fit">
          <button 
            onClick={() => setView('calendar')}
            className={clsx("p-2 rounded-md transition-colors", view === 'calendar' ? 'bg-[var(--surface-3)] text-white' : 'text-[var(--text-secondary)]')}
          >
            <CalendarIcon size={16} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={clsx("p-2 rounded-md transition-colors", view === 'list' ? 'bg-[var(--surface-3)] text-white' : 'text-[var(--text-secondary)]')}
          >
            <ListIcon size={16} />
          </button>
        </div>
      </header>

      {view === 'calendar' && (
        <div className="animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors border border-transparent hover:border-[var(--border)]"><ChevronLeft size={20} /></button>
            <h2 className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors border border-transparent hover:border-[var(--border)]"><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs font-mono text-[var(--text-secondary)]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {daysInMonth.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const data = allDays[dateStr];
              const isCurrentMonth = isSameMonth(date, currentMonth);
              
              return (
                <div 
                  key={dateStr}
                  onClick={() => data && setSelectedDay(selectedDay === dateStr ? null : dateStr)}
                  className={clsx(
                    "aspect-square p-1 md:p-2 rounded-xl flex flex-col items-center justify-between border cursor-pointer transition-all",
                    isCurrentMonth ? "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-3)]" : "bg-transparent border-transparent opacity-30 cursor-default",
                    isToday(date) && "ring-1 ring-white/20",
                    selectedDay === dateStr && "ring-2 ring-emerald-500 bg-[var(--surface-3)]",
                    !data && isCurrentMonth && "opacity-50"
                  )}
                >
                  <span className={clsx("text-xs font-mono", isToday(date) ? "text-emerald-400 font-bold" : "")}>{format(date, 'd')}</span>
                  {data && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-0.5 mt-1">
                        {tasks.map((t, i) => (
                           <div key={i} className={clsx("w-1 md:w-1.5 h-1 md:h-1.5 rounded-full", data[t.id] === 'done' ? 'bg-emerald-500' : data[t.id] === 'skip' ? 'bg-orange-500' : 'bg-transparent border border-white/10')} />
                        ))}
                      </div>
                      {data.mood && <span className="text-[10px] md:text-sm">{getEmoji(data.mood)}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDay && allDays[selectedDay] && (
            <div className="mt-8 p-6 rounded-2xl bg-[var(--surface)] border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
               <h3 className="font-bold text-lg flex items-center justify-between">
                 {format(parseISO(selectedDay), 'EEEE, MMMM d')}
                 <span className="text-xl">{getEmoji(allDays[selectedDay].mood)}</span>
               </h3>
               <div className="h-px w-full bg-[var(--border)] my-4" />
               <div className="space-y-3">
                 {tasks.map(t => {
                    const status = allDays[selectedDay][t.id];
                    if (!status || status === 'none') return null;
                    return (
                      <div key={t.id} className="flex justify-between items-center text-sm">
                        <span className="font-mono text-[var(--text-secondary)]">{t.name}</span>
                        <span className={clsx("px-2 py-1 rounded-md bg-[var(--surface-2)] text-xs font-mono lowercase tracking-wide", status === 'done' ? 'text-emerald-400' : 'text-orange-400')}>{status}</span>
                      </div>
                    )
                 })}
               </div>
            </div>
          )}
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-3 animate-in fade-in">
          {allLoggedDates.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)] bg-[var(--surface)] rounded-2xl border border-[var(--border-bright)] border-dashed">
              No historical logs found yet. Get to work.
            </div>
          ) : (
            allLoggedDates.map(dateStr => {
              const data = allDays[dateStr];
              const doneCount = tasks.filter(t => data[t.id] === 'done').length;
              const skipCount = tasks.filter(t => data[t.id] === 'skip').length;
              
              return (
                <div key={dateStr} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] flex flex-col items-center justify-center border border-[var(--border-bright)] shrink-0">
                      <span className="text-xs text-[var(--text-secondary)]">{format(parseISO(dateStr), 'MMM')}</span>
                      <span className="font-bold">{format(parseISO(dateStr), 'dd')}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{format(parseISO(dateStr), 'EEEE')}</h3>
                      <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                        {doneCount}/{tasks.length} completed
                        {skipCount > 0 && ` • ${skipCount} skipped`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm bg-[var(--surface-2)] px-3 py-2 rounded-lg md:bg-transparent md:px-0">
                     <div className="flex gap-1">
                        {tasks.map((t, i) => (
                           <div key={i} title={t.name} className={clsx("w-2 h-2 md:w-3 md:h-3 rounded-sm", data[t.id] === 'done' ? 'bg-emerald-500' : data[t.id] === 'skip' ? 'bg-orange-500' : 'bg-[var(--surface-3)]')} />
                        ))}
                     </div>
                     {data.mood && <span className="ml-2 border-l border-[var(--border)] pl-3 text-lg">{getEmoji(data.mood)}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}