'use client';

import { useHabitStore } from '@/lib/store';
import { Switch } from '@/components/ui/Switch';
import { testNotification, requestNotificationPermission } from '@/lib/notifications';
import { Bell, Briefcase, Zap, Moon, Orbit } from 'lucide-react';
import { useState } from 'react';
import { RoutineConfig } from '@/components/RoutineConfig';

export default function SettingsView() {
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);
  const [permission, setPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const handlePermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings.</h1>
        <p className="text-[var(--text-secondary)] font-mono text-sm mt-1">Configure your environment.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
          <Briefcase size={14} /> Routine Configuration
        </h2>
        <RoutineConfig />
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
          <Bell size={14} /> System Notifications
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Browser Permission</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Allow GRIND to send desktop notifications.</p>
            </div>
            <button 
              onClick={handlePermission}
              disabled={permission === 'granted'}
              className="px-4 py-2 text-xs font-mono bg-[var(--surface-3)] rounded-lg disabled:opacity-50"
            >
              {permission.toUpperCase()}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Pre-task reminders</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">15 min before block starts</p>
              </div>
              <Switch checked={true} onChange={() => {}} />
            </div>
            <div className="h-px bg-[var(--border)] w-full" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Task start notifications</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">When it's time to begin</p>
              </div>
              <Switch checked={true} onChange={() => {}} />
            </div>
            <div className="h-px bg-[var(--border)] w-full" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">End reminders</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">When block is ending</p>
              </div>
              <Switch checked={true} onChange={() => {}} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
          <Orbit size={14} /> AI Communications
        </h2>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-emerald-400">Morning Briefing</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Generate AI briefing on mount</p>
            </div>
            <Switch 
              checked={settings.aiMorningBriefingNotification} 
              onChange={(checked) => updateSettings({ aiMorningBriefingNotification: checked })} 
            />
          </div>
          <div className="h-px bg-[var(--border)] w-full" />
          <div className="flex items-center justify-between opacity-50">
            <div>
              <p className="font-semibold text-sm">Evening Check-in (9 PM)</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Status wrapper (auto-on)</p>
            </div>
            <Switch checked={true} disabled onChange={() => {}} />
          </div>
          <div className="h-px bg-[var(--border)] w-full" />
          <div className="flex items-center justify-between opacity-50">
            <div>
              <p className="font-semibold text-sm">Streak Protection Alerts</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">11:00 PM risk warnings</p>
            </div>
            <Switch checked={true} disabled onChange={() => {}} />
          </div>
        </div>
      </section>

      <section className="pt-4">
        <button 
          onClick={testNotification}
          className="w-full p-4 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-secondary)] text-sm font-mono hover:text-white transition-colors"
        >
          &gt; Send test notification
        </button>
      </section>

      <footer className="pt-8 text-center text-xs text-[var(--text-tertiary)] font-mono leading-loose">
        <p>grind v1 · routine locked till further notice</p>
        <p>built with intention · may 2026</p>
      </footer>
    </div>
  );
}
