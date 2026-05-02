'use client';

import { useHabitStore } from '@/lib/store';
import { testNotification, requestNotificationPermission } from '@/lib/notifications';
import { Switch } from '@/components/ui/Switch';
import { Bell, BellOff, VolumeX, Beaker, Brain } from 'lucide-react';
import { useState } from 'react';

export function SettingsView() {
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);
  const [permission, setPermission] = useState<NotificationPermission>(typeof window !== 'undefined' ? Notification.permission : 'default');

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notification Center</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Control your connection to GRIND.</p>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              System Notifications
              {permission === 'granted' ? <Bell className="w-5 h-5 text-emerald-400" /> : <BellOff className="w-5 h-5 text-rose-400" />}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">Required for all alerts and AI briefs.</p>
          </div>
          {permission !== 'granted' && (
            <button 
              onClick={handleRequestPermission}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Allow Priority
            </button>
          )}
        </div>

        <div className="grid gap-4">
          <button 
            onClick={testNotification}
            disabled={permission !== 'granted'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors rounded-xl font-mono text-sm disabled:opacity-50"
          >
            <Beaker className="w-4 h-4" /> 
            FIRE TEST PAYLOAD
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-4">Daily Operations</h3>
        
        <SettingRow 
          title="Pre-task reminders (15 min)"
          desc="Get warned before a working block drops."
          checked={settings.preTaskReminders ?? true}
          onChange={(checked) => updateSettings({ preTaskReminders: checked })}
        />
        
        <SettingRow 
          title="Task start notifications"
          desc="The exact minute it's time to begin."
          checked={settings.taskStartNotifications ?? true}
          onChange={(checked) => updateSettings({ taskStartNotifications: checked })}
        />
        
        <SettingRow 
          title="End block reminders"
          desc="Alerts you when the scheduled session is over."
          checked={settings.endReminders ?? true}
          onChange={(checked) => updateSettings({ endReminders: checked })}
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-4">AI Coaching & Checks</h3>
        
        <SettingRow 
          title="AI Morning Briefing"
          desc="AI-generated daily instruction at 7:50 AM."
          checked={settings.aiMorningBriefingNotification ?? true}
          onChange={(checked) => updateSettings({ aiMorningBriefingNotification: checked })}
        />
        
        <SettingRow 
          title="Evening check-in (9:00 PM)"
          desc="Smart progress reflection."
          checked={settings.eveningCheckIn ?? true}
          onChange={(checked) => updateSettings({ eveningCheckIn: checked })}
        />

        <SettingRow 
          title="Midnight Warning"
          desc="Last chance warning 1 min before midnight."
          checked={settings.midnightWarning ?? true}
          onChange={(checked) => updateSettings({ midnightWarning: checked })}
        />
        
        <SettingRow 
          title="Streak protection alerts"
          desc="Fires if you are about to lose a 3+ day streak."
          checked={settings.streakProtection ?? true}
          onChange={(checked) => updateSettings({ streakProtection: checked })}
        />
      </div>
      
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-4">Milestones & History</h3>
        
        <SettingRow 
          title="Weekly AI Review"
          desc="Sunday 8:00 PM and Monday morning overview."
          checked={settings.weeklyReviewNotification ?? true}
          onChange={(checked) => updateSettings({ weeklyReviewNotification: checked })}
        />
        
        <SettingRow 
          title="Streak Celebrations"
          desc="Milestone prompts (3, 7, 21, 50, 100 days)."
          checked={settings.streakMilestoneCelebrations ?? true}
          onChange={(checked) => updateSettings({ streakMilestoneCelebrations: checked })}
        />

        <SettingRow 
          title="Path Progress"
          desc="Halfway and completion alerts for skill trees."
          checked={settings.pathMilestoneNotifications ?? true}
          onChange={(checked) => updateSettings({ pathMilestoneNotifications: checked })}
        />
      </div>
      
      <div className="space-y-4 pt-4 border-t border-[var(--border)] opacity-80 backdrop-blur-sm grayscale-[20%]">
        <h3 className="text-sm font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-4 flex items-center gap-2">
          <VolumeX className="w-4 h-4" /> Quiet Hours
        </h3>
        <div className="p-4 rounded-xl bg-[var(--surface-2)] flex justify-between items-center">
             <div className="space-y-1">
               <div className="font-medium text-sm">Do Not Disturb</div>
               <div className="text-xs text-[var(--text-secondary)]">2:30 AM to 7:30 AM (Scheduled Sleep)</div>
             </div>
             <Switch checked={true} disabled={true} onChange={() => {}} />
        </div>
      </div>
      
    </div>
  );
}

function SettingRow({ title, desc, checked, onChange }: { title: string, desc: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <label className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] cursor-pointer group hover:border-[var(--surface-3)] transition-colors">
      <div className="space-y-1 pr-6">
        <div className="font-semibold text-[var(--text)] group-hover:text-white transition-colors">{title}</div>
        <div className="text-xs text-[var(--text-secondary)]">{desc}</div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </label>
  );
}