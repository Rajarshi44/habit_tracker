import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { NotificationEngine } from '@/components/NotificationEngine';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'GRIND | Habit Tracker',
  description: 'Premium habit tracker for developers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={clsx(inter.variable, jbMono.variable, 'antialiased')}>
        <div className="flex min-h-screen">
          <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] p-4">
            <div className="font-mono font-bold text-xl mb-8 tracking-wider">GRIND.</div>
            <nav className="flex-1 space-y-2">
              {['Today', 'Heatmap', 'Path', 'Insights', 'History'].map((item, i) => (
                <div key={i} className={clsx(
                  "px-4 py-3 rounded-lg text-sm cursor-pointer transition-colors",
                  i === 0 ? "bg-[var(--surface-3)] text-white border-l-2 border-emerald-500" : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-2)]"
                )}>
                  {item}
                </div>
              ))}
            </nav>
            <div className="text-xs text-[var(--text-tertiary)] font-mono mt-auto">
              grind v1 · routine locked<br/>
              built with intention
            </div>
          </aside>
          <main className="flex-1 max-w-3xl mx-auto p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
        <NotificationEngine />
      </body>
    </html>
  );
}