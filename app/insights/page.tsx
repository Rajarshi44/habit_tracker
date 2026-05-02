'use client';

import { useState, useMemo } from 'react';
import { useHabitStore } from '@/lib/store';
import { useGemini } from '@/hooks/useGemini';
import { Sparkles, Loader2, RefreshCw, BarChart2, TrendingUp, Activity, Award } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { useStreaks } from '@/hooks/useStreaks';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Legend
} from 'recharts';

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const allDays = useHabitStore((s) => s.days);
  const tasks = useHabitStore((s) => s.tasks);
  const { taskStreaks, bestStreaks, dayStreak } = useStreaks();
  const { getWeeklyReview, loading } = useGemini();
  const [review, setReview] = useState<string | null>(null);

  require('react').useEffect(() => setMounted(true), []);

  // Stats Calculations
  const stats = useMemo(() => {
    let totalSessions = 0;
    const taskCounts: Record<string, { done: number, skip: number }> = {};
    tasks.forEach(t => taskCounts[t.id] = { done: 0, skip: 0 });

    Object.values(allDays).forEach(day => {
      tasks.forEach(t => {
        if (day[t.id] === 'done') {
          totalSessions++;
          taskCounts[t.id].done++;
        } else if (day[t.id] === 'skip') {
          taskCounts[t.id].skip++;
        }
      });
    });

    let mostConsistent = null;
    let mostSkipped = null;

    tasks.forEach(t => {
      if (taskCounts[t.id].done > 0 && (!mostConsistent || taskCounts[t.id].done > taskCounts[mostConsistent.id].done)) {
        mostConsistent = t;
      }
      if (taskCounts[t.id].skip > 0 && (!mostSkipped || taskCounts[t.id].skip > taskCounts[mostSkipped.id].skip)) {
        mostSkipped = t;
      }
    });

    return { totalSessions, taskCounts, mostConsistent, mostSkipped };
  }, [allDays, tasks]);

  // Chart 1: Weekly completion %
  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dStr = format(d, 'yyyy-MM-dd');
      const dayData = allDays[dStr] || {};
      const done = tasks.filter(t => dayData[t.id] === 'done').length;
      data.push({
        name: format(d, 'EEE'),
        completion: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
      });
    }
    return data;
  }, [allDays, tasks]);

  // Chart 2 & 3: Task Breakdown & Streaks
  const taskChartData = useMemo(() => {
    return tasks.map(t => ({
      name: t.name,
      done: stats.taskCounts[t.id]?.done || 0,
      skip: stats.taskCounts[t.id]?.skip || 0,
      currentStreak: taskStreaks[t.id] || 0,
      bestStreak: bestStreaks[t.id] || 0
    }));
  }, [stats, taskStreaks, bestStreaks, tasks]);

  const fetchReview = async (force = false) => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    let weekDone = 0;
    let weekTotal = 0;
    for (let i = 0; i < 7; i++) {
        const dStr = format(subDays(today, i), 'yyyy-MM-dd');
        const dayData = allDays[dStr];
        weekTotal += tasks.length;
        if (dayData) {
            weekDone += tasks.filter(t => dayData[t.id] === 'done').length;
        }
    }

    const res = await getWeeklyReview({
      weekNumber: format(today, 'I'),
      weekStart: format(weekStart, 'MMM d'),
      weekEnd: format(weekEnd, 'MMM d'),
      dailyBreakdown: `${weekDone} tasks done out of ${weekTotal}`,
      taskStats: `Most consistent: ${stats.mostConsistent?.name}, Most skipped: ${stats.mostSkipped?.name}`,
      skipData: `Total skips: ${Object.values(stats.taskCounts).reduce((acc, val) => acc + val.skip, 0)}`,
      moodData: "Average 4/5",
      streakChanges: `Day streak: ${dayStreak}`,
      pathProgress: "Frontend Foundation",
      subjData: ""
    }, force);

    setReview(res);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="border-b border-[var(--border)] pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <h1 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">Telemetry // Insights</h1>
        </div>
        <p className="text-3xl font-bold tracking-tight mt-2 text-[var(--text-primary)]">Data-driven behavioral analysis.</p>
      </header>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2"><Activity size={16}/> <span className="text-xs font-mono uppercase">Total Sessions</span></div>
          <div className="text-3xl font-bold">{stats.totalSessions}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2"><Award size={16}/> <span className="text-xs font-mono uppercase">Best Streak</span></div>
          <div className="text-3xl font-bold">{Math.max(...Object.values(bestStreaks), 0)}<span className="text-sm font-normal text-[var(--text-tertiary)] ml-1">days</span></div>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2"><TrendingUp size={16}/> <span className="text-xs font-mono uppercase">Most Consistent</span></div>
          <div className="text-xl font-bold truncate">{stats.mostConsistent?.name || "N/A"}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--text-tertiary)] mb-2"><BarChart2 size={16}/> <span className="text-xs font-mono uppercase">Most Skipped</span></div>
          <div className="text-xl font-bold truncate">{stats.mostSkipped?.name || "N/A"}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CHART 1: WEEKLY COMPLETION */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-6">Weekly Completion %</h3>
          <div className="h-[250px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-bright)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="completion" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: TASK BREAKDOWN */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-6">Task Breakdown (All Time)</h3>
          <div className="h-[250px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={taskChartData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-bright)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="done" name="Done" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="skip" name="Skipped" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: STREAK COMPARISON */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] md:col-span-2">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-6">Current vs Best Streaks</h3>
          <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={taskChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-bright)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="currentStreak" name="Current Streak" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bestStreak" name="Best Streak" fill="#4f46e5" fillOpacity={0.3} stroke="#4f46e5" strokeDasharray="3 3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STREAKS TABLE */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
        <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-6">Detailed Task Statistics</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-3 px-4 text-xs font-mono uppercase text-[var(--text-tertiary)] font-normal">Task</th>
              <th className="py-3 px-4 text-xs font-mono uppercase text-[var(--text-tertiary)] font-normal">All-Time Done</th>
              <th className="py-3 px-4 text-xs font-mono uppercase text-[var(--text-tertiary)] font-normal">All-Time Skipped</th>
              <th className="py-3 px-4 text-xs font-mono uppercase text-[var(--text-tertiary)] font-normal">Current Streak</th>
              <th className="py-3 px-4 text-xs font-mono uppercase text-[var(--text-tertiary)] font-normal">Best Streak</th>
            </tr>
          </thead>
          <tbody>
            {taskChartData.map((row, i) => (
              <tr key={i} className="border-b border-[var(--border-bright)] hover:bg-[var(--surface-2)] transition-colors">
                <td className="py-3 px-4 font-medium">{row.name}</td>
                <td className="py-3 px-4 text-emerald-500">{row.done}</td>
                <td className="py-3 px-4 text-orange-500">{row.skip}</td>
                <td className="py-3 px-4">{row.currentStreak} <span className="text-xs text-[var(--text-tertiary)]">days</span></td>
                <td className="py-3 px-4 font-bold">{row.bestStreak} <span className="text-xs text-[var(--text-tertiary)] font-normal">days</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI WEEKLY REVIEW */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
            Weekly Performance Review
          </h2>
          <button 
            onClick={() => fetchReview(true)} 
            disabled={loading}
            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-emerald-500 text-xs font-mono disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-100 flex items-center gap-2">
                Oracle Insights
              </h3>
              <p className="text-xs text-indigo-300/60 font-mono">Week {format(new Date(), 'I')}</p>
            </div>
          </div>

          {!review && !loading ? (
            <button 
              onClick={() => fetchReview(false)}
              className="w-full py-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-sm hover:bg-indigo-500/20 transition-colors"
            >
              Generate AI Review
            </button>
          ) : (
            <div className="text-indigo-200/90 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {loading && !review ? (
                <div className="flex items-center gap-2 text-indigo-400">
                  <Loader2 size={16} className="animate-spin" /> Compiling weekly data...
                </div>
              ) : (
                review
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
