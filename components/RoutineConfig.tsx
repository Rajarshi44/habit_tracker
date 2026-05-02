'use client';

import { useHabitStore } from '@/lib/store';
import { useState } from 'react';
import { Task } from '@/lib/types';
import { TASKS, SUBJECTS } from '@/lib/constants';
import { Plus, Trash2, Save, X, Download } from 'lucide-react';
import { clsx } from 'clsx';

export function RoutineConfig() {
  const tasks = useHabitStore((s) => s.tasks) || [];
  const subjects = useHabitStore((s) => s.subjects) || [];
  const setTasks = useHabitStore((s) => s.setTasks);
  const setSubjects = useHabitStore((s) => s.setSubjects);
  const settings = useHabitStore((s) => s.settings);

  const [subjInput, setSubjInput] = useState(subjects.join(', '));
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleLoadTemplate = () => {
    if (confirm('This will overwrite any current configuration with the default developer template. Proceed?')) {
      setTasks(TASKS);
      setSubjects(SUBJECTS);
      setSubjInput(SUBJECTS.join(', '));
    }
  };

  return (
    <div className="space-y-8">
      {/* Global Actions */}
      {tasks.length === 0 && settings.email === 'mrajarshi570@gmail.com' && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleLoadTemplate}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-mono text-xs rounded hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
          >
            <Download size={14} /> Load Developer Template
          </button>
        </div>
      )}

      {/* Subjects Manager */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div>
          <p className="font-semibold text-sm">College Study Rotation</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Comma-separated list of subjects for the rotation.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={subjInput}
            onChange={(e) => setSubjInput(e.target.value)}
            className="flex-1 bg-[var(--surface-2)] border border-[var(--border-bright)] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="DBMS, CN, DDBMS..."
          />
          <button 
            onClick={handleSaveSubjects}
            className="px-4 py-2 bg-[var(--surface-3)] text-emerald-400 font-mono text-xs rounded hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
          >
            <Save size={14} /> Update
          </button>
        </div>
      </div>

      {/* Tasks Manager */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Task Definitions</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Configure your daily grind routine.</p>
          </div>
          <button 
            onClick={() => setEditingTask({ id: 'new_' + Date.now(), name: '', subtitle: '', time: '', duration: '', color: '#10b981', icon: 'Box', path: false, category: 'learning' })}
            className="p-2 bg-[var(--surface-3)] text-[var(--text-primary)] rounded hover:text-emerald-400 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {editingTask && (
          <form onSubmit={handleSaveTask} className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border-bright)] space-y-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-mono uppercase text-emerald-400">Edit Task</h4>
              <button type="button" onClick={() => setEditingTask(null)} className="text-[var(--text-tertiary)] hover:text-red-400"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">ID (Unique)</label>
                <input required value={editingTask.id} onChange={e => setEditingTask({...editingTask, id: e.target.value})} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">Name</label>
                <input required value={editingTask.name} onChange={e => setEditingTask({...editingTask, name: e.target.value})} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">Subtitle</label>
                <input value={editingTask.subtitle} onChange={e => setEditingTask({...editingTask, subtitle: e.target.value})} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">Time Window</label>
                <input required value={editingTask.time} onChange={e => setEditingTask({...editingTask, time: e.target.value})} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500" placeholder="8:00 - 9:00 AM" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">Duration</label>
                <input value={editingTask.duration} onChange={e => setEditingTask({...editingTask, duration: e.target.value})} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500" placeholder="1h" />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-1">Color</label>
                   <input type="color" value={editingTask.color} onChange={e => setEditingTask({...editingTask, color: e.target.value})} className="w-full h-8 bg-[var(--surface)] border border-[var(--border)] rounded p-1 cursor-pointer" />
                 </div>
                 <div className="flex items-end mb-1">
                   <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                     <input type="checkbox" checked={editingTask.rotating} onChange={e => setEditingTask({...editingTask, rotating: e.target.checked})} className="accent-emerald-500" />
                     Show Rotation?
                   </label>
                 </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
               <button type="submit" className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded hover:bg-emerald-500/20 transition-colors">Save Task</button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded bg-[var(--surface-2)] border border-transparent hover:border-[var(--border-bright)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: task.color }} />
                <div>
                  <div className="text-sm font-medium">{task.name} <span className="text-xs text-[var(--text-secondary)] font-normal ml-2">{task.time}</span></div>
                  <div className="text-[10px] text-[var(--text-tertiary)] font-mono uppercase mt-0.5">{task.subtitle} {task.rotating && "(Rotating)"}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingTask(task)} className="p-1.5 text-[var(--text-secondary)] hover:text-emerald-400 transition-colors"><Save size={14} /></button>
                <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
