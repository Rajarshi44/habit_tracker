'use client';

import { useState, useEffect } from 'react';
import { useHabitStore } from '@/lib/store';
import { Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function AuthModal() {
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);
  
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || settings.onboarded) {
    return null;
  }

  // Password Strength Logic
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z\d]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);
  
  const getStrengthConfig = () => {
    switch (strength) {
      case 0: return { label: '', color: 'bg-white/10' };
      case 1: return { label: 'Weak', color: 'bg-red-500', w: 'w-1/4' };
      case 2: return { label: 'Fair', color: 'bg-orange-500', w: 'w-2/4' };
      case 3: return { label: 'Good', color: 'bg-yellow-400', w: 'w-3/4' };
      case 4: return { label: 'Strong', color: 'bg-emerald-500', w: 'w-full' };
      default: return { label: '', color: 'bg-white/10', w: 'w-0' };
    }
  };
  const strConfig = getStrengthConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    updateSettings({ 
      name: name.trim() || (mode === 'signin' ? email.split('@')[0] : 'User'), 
      email: email.trim(), 
      onboarded: true 
    });
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen overflow-y-auto font-sans">
      {/* Fullscreen gradient background */}
      <div className="absolute inset-0 bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] -z-10" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in-95 duration-500 mt-8 mb-8">
        
        {/* Glass Card Container */}
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/20 shadow-inner text-white mb-6 backdrop-blur-md">
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-white/60">
              {mode === 'signin' ? 'Enter your credentials to access your terminal' : 'Initialize your personal productivity protocol'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[11px] font-medium tracking-wide text-white/70">NAME</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-white/30 backdrop-blur-md"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-medium tracking-wide text-white/70">EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-white/30 backdrop-blur-md"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-medium tracking-wide text-white/70">PASSWORD</label>
                {mode === 'signin' && (
                  <a href="#" className="text-[11px] text-indigo-300 hover:text-indigo-200 transition-colors">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-white/30 backdrop-blur-md"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[11px] font-medium tracking-wide text-white/70">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-white/30 backdrop-blur-md"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="pt-2 pb-1 space-y-1.5 animate-in fade-in">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={clsx(
                            "flex-1 rounded-full transition-colors duration-300",
                            strength >= level ? strConfig.color : 'bg-white/10'
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-right font-medium text-white/60">
                      {strConfig.label}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center gap-2 pt-1 pb-2">
                <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-indigo-500" />
                <label htmlFor="remember" className="text-xs text-white/60 cursor-pointer">Remember me for 30 days</label>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-white text-indigo-950 hover:bg-white/90 font-semibold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-white/50">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={toggleMode}
                className="ml-1.5 text-white hover:text-indigo-300 font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
