'use client';

import { Sparkles, Loader2, X } from 'lucide-react';

interface AiInsightCardProps {
  loading: boolean;
  insight: string | null;
  onClose: () => void;
}

export function AiInsightCard({ loading, insight, onClose }: AiInsightCardProps) {
  if (!loading && !insight) return null;

  return (
    <div className="mt-3 p-4 rounded-xl border border-purple-500/30 bg-purple-950/10 relative overflow-hidden animate-in slide-in-from-top-2 duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-xs tracking-wider text-purple-400 font-mono uppercase font-bold">AI Insight</span>
        </div>
        <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <X size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-mono py-2">
          <Loader2 size={14} className="animate-spin text-purple-400" /> Analyzing patterns...
        </div>
      ) : (
        <p className="text-[var(--text-primary)] text-sm leading-relaxed tracking-wide">
          {insight}
        </p>
      )}
    </div>
  );
}