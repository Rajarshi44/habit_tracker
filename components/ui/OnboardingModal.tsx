'use client';

import { useState, useEffect } from 'react';
import { useHabitStore } from '@/lib/store';
import { Sparkles, ArrowRight } from 'lucide-react';

export function OnboardingModal() {
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);
  
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || settings.onboarded) {
    return null;
  }

  const handleInit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateSettings({ 
      name: name.trim(), 
      email: email.trim(), 
      onboarded: true 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--background)]/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--surface-3)] border border-[var(--border-bright)] shadow-inner text-emerald-400">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Initialize Terminal</h1>
              <p className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-tertiary)] uppercase mt-1">Auth Sequence</p>
            </div>
          </div>
          
          <form onSubmit={handleInit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)]">Alias / Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your alias"
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border-bright)] rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-[var(--text-tertiary)]"
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)]">Authorization Key (Email)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional for public access"
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border-bright)] rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-[var(--text-tertiary)]"
                autoComplete="email"
              />
            </div>
            
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-[var(--text-primary)] text-[var(--background)] hover:bg-emerald-400 hover:text-emerald-950 font-bold tracking-wide rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              INITIALIZE PROTOCOL
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
