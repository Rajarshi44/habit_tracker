'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CornerDownLeft, Loader2 } from 'lucide-react';
import { generateChatResponse } from '@/lib/gemini';

type ChatHistory = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, parts: [{ text: input }] };
    setHistory((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const responseText = await generateChatResponse(history, input);
    const modelMessage = { role: 'model' as const, parts: [{ text: responseText }] };
    
    setHistory((prev) => [...prev, modelMessage]);
    setLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ ease: 'circOut', duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            <header className="p-4 border-b border-[var(--border)] flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold tracking-tight">Oracle Coach</h3>
                <p className="text-xs text-[var(--text-secondary)]">Live Support</p>
              </div>
            </header>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-sm">
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-[var(--surface-2)]'}`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--text-secondary)]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-3 border-t border-[var(--border)]">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your coach..."
                  className="w-full bg-[var(--surface-2)] border border-transparent rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={loading}
                >
                  <CornerDownLeft size={18} />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}