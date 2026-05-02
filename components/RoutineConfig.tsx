'use client';

import { useHabitStore } from '@/lib/store';
import { useState } from 'react';
import { Task, PathStage } from '@/lib/types';
import { TASKS, SUBJECTS, PATH_STAGES } from '@/lib/constants';
import { Plus, Trash2, Save, X, Download, Activity, Clock, Tag, RefreshCw, Hash, Edit2, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export function RoutineConfig() {
  const settings = useHabitStore((s) => s.settings);
  const tasks = useHabitStore((s) => s.tasks) || [];
  const subjects = useHabitStore((s) => s.subjects) || [];
  const pathStages = useHabitStore((s) => s.pathStages) || [];
  
  const setTasks = useHabitStore((s) => s.setTasks);
  const setSubjects = useHabitStore((s) => s.setSubjects);
  const setPathStages = useHabitStore((s) => s.setPathStages);
  const setCurrentPathStage = useHabitStore((s) => s.setCurrentPathStage);

  const [subjInput, setSubjInput] = useState(subjects.join(', '));
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingStage, setEditingStage] = useState<PathStage | null>(null);

  const handleSaveSubjects = () => {
    const newSubjects = subjInput.split(',').map(s => s.trim()).filter(Boolean);
    setSubjects(newSubjects);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task? All history for this task will become orphaned.')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
    const exists = tasks.some(t => t.id === editingTask.id);
    if (exists) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    } else {
      setTasks([...tasks, editingTask]);
    }
    setEditingTask(null);
  };

  const handleDeleteStage = (stageId: string) => {
    if (confirm('Are you sure you want to delete this pipeline stage?')) {
      setPathStages(pathStages.filter(s => s.id !== stageId));
    }
  };

  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage) return;
    
    const exists = pathStages.some(s => s.id === editingStage.id);
    if (exists) {
      setPathStages(pathStages.map(s => s.id === editingStage.id ? editingStage : s));
    } else {
      setPathStages([...pathStages, editingStage]);
    }
    setEditingStage(null);
  };

  const handleLoadTemplate = () => {
    if (confirm('This will overwrite any current configuration with the default protocol template. Proceed?')) {
      setTasks(TASKS);
      setSubjects(SUBJECTS);
      setSubjInput(SUBJECTS.join(', '));
      setPathStages(PATH_STAGES);
      if (PATH_STAGES.length > 0) {
        setCurrentPathStage(PATH_STAGES[0].id);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ─── EMPTY STATE & GLOBAL ACTIONS ─── */}
      {tasks.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-[#09090b] border border-white/5 p-8 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_70%)]" />
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 relative z-10 border border-white/10">
            <Activity className="text-emerald-500" size={24} />
          </div>
          <h3 className="text-2xl font-light text-white mb-2 relative z-10">System Unconfigured</h3>
          <p className="text-white/40 text-sm max-w-md mb-8 relative z-10">
            Your telemetry tracking is currently empty. You can manually build your routine below.
          </p>
          {settings.email === 'mrajarshi570@gmail.com' && (
            <button 
              onClick={handleLoadTemplate}
              className="group relative z-10 px-6 py-3 bg-white text-black text-xs font-mono uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              Initialize Default Protocol
            </button>
          )}
        </div>
      )}

      {/* ─── PIPELINE STAGE MANAGER ─── */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <ChevronRight size={16} className="text-emerald-500" /> Learning Pipeline
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">Manage overarching milestones</p>
          </div>
          <button 
            onClick={() => setEditingStage({ id: `stage_${Date.now()}`, name: '', source: '', color: '#3b82f6', description: '' })}
            className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> <span className="hidden sm:inline text-xs font-mono uppercase tracking-widest">Add Stage</span>
          </button>
        </div>

        {editingStage && (
          <div className="mb-8 p-6 rounded-2xl bg-[#111] border border-emerald-500/20 relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <form onSubmit={handleSaveStage} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <Edit2 size={14} /> Edit Stage
                </h4>
                <button type="button" onClick={() => setEditingStage(null)} className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Stage ID (Unique)</label>
                  <input required value={editingStage.id} onChange={e => setEditingStage({...editingStage, id: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Name</label>
                  <input required value={editingStage.name} onChange={e => setEditingStage({...editingStage, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="e.g. JavaScript" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Source / Curriculum</label>
                  <input required value={editingStage.source} onChange={e => setEditingStage({...editingStage, source: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="e.g. Official Docs" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Description</label>
                  <input required value={editingStage.description} onChange={e => setEditingStage({...editingStage, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="Brief summary" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Theme Color</label>
                  <div className="flex items-center gap-3 bg-black border border-white/10 rounded-lg p-1 pr-4 w-max">
                    <input type="color" value={editingStage.color} onChange={e => setEditingStage({...editingStage, color: e.target.value})} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <span className="text-xs font-mono text-white/60">{editingStage.color}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">Save Stage</button>
              </div>
            </form>
          </div>
        )}

        {pathStages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pathStages.map((stage, idx) => (
              <div key={stage.id} className="group p-5 rounded-xl bg-black border border-white/5 hover:border-white/20 relative overflow-hidden transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: stage.color }} />
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-xs font-mono opacity-50">{String(idx + 1).padStart(2, '0')}</span> {stage.name}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingStage(stage)} className="text-white/40 hover:text-white p-1"><Edit2 size={12}/></button>
                    <button onClick={() => handleDeleteStage(stage.id)} className="text-white/40 hover:text-red-400 p-1"><Trash2 size={12}/></button>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-white/40 mt-1 uppercase">{stage.source}</p>
                <p className="text-xs text-white/60 mt-2 line-clamp-2">{stage.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── SUBJECTS MANAGER ─── */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <RefreshCw size={16} className="text-emerald-500" /> Dynamic Rotation
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">Comma-separated rotation list</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              value={subjInput}
              onChange={(e) => setSubjInput(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
              placeholder="e.g. Algorithms, System Design, Frontend..."
            />
          </div>
          <button 
            onClick={handleSaveSubjects}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
          >
            <Save size={14} /> Update
          </button>
        </div>
      </div>

      {/* ─── TASKS MANAGER ─── */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" /> Protocol Configuration
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">Manage daily directives</p>
          </div>
          <button 
            onClick={() => setEditingTask({ id: `task_${Date.now()}`, name: '', subtitle: '', time: '', duration: '', color: '#10b981', icon: 'Box', path: false, category: 'learning', rotating: false })}
            className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            title="Create New Task"
          >
            <Plus size={16} /> <span className="hidden sm:inline text-xs font-mono uppercase tracking-widest">Add Task</span>
          </button>
        </div>

        {/* ─── TASK EDITOR MODAL / INLINE FORM ─── */}
        {editingTask && (
          <div className="mb-8 p-6 rounded-2xl bg-[#111] border border-emerald-500/20 relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <form onSubmit={handleSaveTask} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <Edit2 size={14} /> Edit Directive
                </h4>
                <button type="button" onClick={() => setEditingTask(null)} className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Unique ID</label>
                  <input required value={editingTask.id} onChange={e => setEditingTask({...editingTask, id: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Display Name</label>
                  <input required value={editingTask.name} onChange={e => setEditingTask({...editingTask, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="e.g. Deep Work" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Subtitle context</label>
                  <input value={editingTask.subtitle} onChange={e => setEditingTask({...editingTask, subtitle: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="e.g. System Architecture" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Time Window</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                    <input required value={editingTask.time} onChange={e => setEditingTask({...editingTask, time: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="8:00 - 9:00 AM" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Duration</label>
                  <input value={editingTask.duration} onChange={e => setEditingTask({...editingTask, duration: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" placeholder="1h 30m" />
                </div>
                
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Color Label</label>
                    <div className="flex items-center gap-3 bg-black border border-white/10 rounded-lg p-1 pr-4">
                      <input type="color" value={editingTask.color} onChange={e => setEditingTask({...editingTask, color: e.target.value})} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                      <span className="text-xs font-mono text-white/60">{editingTask.color}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/50 cursor-pointer hover:bg-white/5 transition-colors">
                    <input type="checkbox" checked={editingTask.rotating} onChange={e => setEditingTask({...editingTask, rotating: e.target.checked})} className="w-4 h-4 rounded border-white/20 text-emerald-500 bg-black focus:ring-emerald-500 focus:ring-offset-black" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">Follows Rotation List?</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-black/50 cursor-pointer hover:bg-white/5 transition-colors">
                    <input type="checkbox" checked={editingTask.path} onChange={e => setEditingTask({...editingTask, path: e.target.checked})} className="w-4 h-4 rounded border-white/20 text-emerald-500 bg-black focus:ring-emerald-500 focus:ring-offset-black" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">Tracks Current Path?</span>
                  </label>
                </div>

              </div>
              
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                  <Save size={14} /> Commit Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TASKS LIST ─── */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-4 rounded-xl bg-black border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: task.color }} />
                
                <div className="flex items-center gap-4 pl-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: task.color }}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">{task.name}</span>
                      <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{task.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{task.subtitle || 'No subtitle'}</span>
                      {task.rotating && (
                        <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <RefreshCw size={8} /> Rotating
                        </span>
                      )}
                      {task.path && (
                        <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                          <ChevronRight size={8} /> Path Stage
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingTask(task)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
