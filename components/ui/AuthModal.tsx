'use client';

import { useState, useEffect } from 'react';
import { useHabitStore } from '@/lib/store';
import { Mail, Lock, User, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export function AuthModal() {
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);
  const authModalOpen = useHabitStore((s) => s.authModalOpen);
  const setAuthModalOpen = useHabitStore((s) => s.setAuthModalOpen);
  const pathname = usePathname();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('Welcome');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning.');
    else if (hour < 18) setGreeting('Good afternoon.');
    else setGreeting('Good evening.');
  }, []);

  if (!mounted) {
    return null;
  }

  // Show if user explicitly clicked a login button, OR if they're on a protected route while not onboarded
  const isProtectedRoute = pathname !== '/';
  const shouldShow = authModalOpen || (isProtectedRoute && !settings.onboarded);

  if (!shouldShow) {
    return null;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    if (mode === 'signup') {
      // --- SIGN UP: store initial state with name to MongoDB, then switch to sign-in ---
      try {
        // Temporarily set cookie so the API route can identify the user
        Cookies.set('grind_user', email.trim(), { expires: 365 });

        // Build the initial state payload with the user's name
        const initialSettings = {
          name: name.trim(),
          email: email.trim(),
          onboarded: true,
          theme: 'dark',
          startDate: new Date().toISOString(),
          preTaskReminders: true,
          taskStartNotifications: true,
          endReminders: true,
          eveningCheckIn: true,
          streakProtection: true,
          midnightWarning: true,
          weeklyReviewNotification: true,
          streakMilestoneCelebrations: true,
          pathMilestoneNotifications: true,
          aiMorningBriefingNotification: true,
        };

        const statePayload = JSON.stringify({
          state: {
            tasks: [],
            subjects: [],
            pathStages: [],
            days: {},
            path: { current: '', pct: {}, completedDates: {} },
            streaks: {},
            bestStreaks: {},
            settings: initialSettings,
          },
          version: 0,
        });

        await fetch('/api/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: statePayload }),
        });

        // Remove the cookie — they haven't signed in yet
        Cookies.remove('grind_user');
      } catch (err) {
        console.error('Signup save error:', err);
      }

      setIsLoading(false);
      setSuccessMsg('Account created! Please sign in.');
      setMode('signin');
      setPassword('');
      setConfirmPassword('');
      setName('');
      return;
    }

    // --- SIGN IN: set cookie, rehydrate from DB, redirect ---
    await new Promise(resolve => setTimeout(resolve, 1000));

    Cookies.set('grind_user', email.trim(), { expires: 365 });

    // Rehydrate the store from MongoDB
    await useHabitStore.persist.rehydrate();

    // Use stored name from DB, fallback to email prefix
    const currentStoredName = useHabitStore.getState().settings.name;
    
    updateSettings({ 
      name: currentStoredName || email.split('@')[0], 
      email: email.trim(), 
      onboarded: true 
    });

    setIsLoading(false);
    setAuthModalOpen(false);
    if (pathname === '/') {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen overflow-y-auto font-sans text-white animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-30" onClick={() => setAuthModalOpen(false)} />
      
      {/* Mesh Gradient Background matching the image */}
      <div className="absolute inset-0 bg-[#1a0f0a] -z-20 overflow-hidden">
        {/* Emerald/Teal Left */}
        <div className="absolute -left-[10%] top-0 w-[50%] h-[80%] bg-[#008f7a] rounded-full mix-blend-normal filter blur-[160px] opacity-70" />
        {/* Magenta/Purple Bottom Left */}
        <div className="absolute -left-[10%] bottom-0 w-[40%] h-[60%] bg-[#4b1d52] rounded-full mix-blend-normal filter blur-[160px] opacity-80" />
        {/* Deep Orange Right */}
        <div className="absolute right-0 top-0 w-[60%] h-[100%] bg-[#ff5500] rounded-full mix-blend-normal filter blur-[180px] opacity-70" />
        {/* Bright Yellow/Orange Center Right */}
        <div className="absolute right-[5%] top-[20%] w-[40%] h-[60%] bg-[#ffb700] rounded-full mix-blend-normal filter blur-[160px] opacity-60" />
      </div>

      {/* SVG Grain/Noise Texture overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in-95 duration-500 mt-8 mb-8">
        
        {/* Glass Card Container matching image */}
        <div className="backdrop-blur-2xl bg-[#1c120c]/60 border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative">
          
          {/* Close Button */}
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* Pill Toggle */}
          <div className="flex bg-black/40 p-1 rounded-full w-max mb-8 border border-white/5 shadow-inner">
            <button 
              type="button"
              onClick={() => setMode('signup')}
              className={clsx(
                "px-6 py-2 rounded-full text-xs font-medium transition-all duration-500 ease-out",
                mode === 'signup' ? "bg-white/15 text-white border border-white/10 shadow-sm" : "text-white/40 hover:text-white"
              )}
            >
              Sign up
            </button>
            <button 
              type="button"
              onClick={() => setMode('signin')}
              className={clsx(
                "px-6 py-2 rounded-full text-xs font-medium transition-all duration-500 ease-out",
                mode === 'signin' ? "bg-white/15 text-white border border-white/10 shadow-sm" : "text-white/40 hover:text-white"
              )}
            >
              Sign In
            </button>
          </div>

          <div className="mb-10">
            <h1 className="text-[2.25rem] leading-none font-light tracking-tight text-white mb-3">
              {mode === 'signin' ? greeting : 'Create an account.'}
            </h1>
            <p className="text-[13px] text-white/50 font-light">
              {mode === 'signin' ? 'Sign in to access your protocol.' : 'Initialize your personal productivity protocol.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl text-sm focus:outline-none transition-all duration-500 ease-out backdrop-blur-md bg-black/40 border border-white/5 text-white focus:border-white/20 focus:bg-black/60 focus:ring-1 focus:ring-white/10 placeholder:text-white/30"
                    placeholder="Name"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-xl text-sm focus:outline-none transition-all duration-500 ease-out backdrop-blur-md bg-black/40 border border-white/5 text-white focus:border-white/20 focus:bg-black/60 focus:ring-1 focus:ring-white/10 placeholder:text-white/30"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-4 rounded-xl text-sm focus:outline-none transition-all duration-500 ease-out backdrop-blur-md bg-black/40 border border-white/5 text-white focus:border-white/20 focus:bg-black/60 focus:ring-1 focus:ring-white/10 placeholder:text-white/30"
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl text-sm focus:outline-none transition-all duration-500 ease-out backdrop-blur-md bg-black/40 border border-white/5 text-white focus:border-white/20 focus:bg-black/60 focus:ring-1 focus:ring-white/10 placeholder:text-white/30"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs text-center animate-in fade-in zoom-in-95">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full mt-6 py-4 font-medium text-sm rounded-xl transition-all duration-700 ease-out disabled:opacity-70 flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-500 ease-out">
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                  mode === 'signin' ? 'Sign In' : 'Create an account'
                )}
              </span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
