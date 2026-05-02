import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { NotificationEngine } from '@/components/NotificationEngine';
import { Sidebar } from '@/components/ui/Sidebar';

const mainFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-main' });
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={clsx(mainFont.variable, jbMono.variable, 'antialiased bg-[var(--background)] text-[var(--text-primary)]')}>
        <div className="flex min-h-[100dvh]">
          <Sidebar />
          <main className="flex-1 max-w-4xl mx-auto p-6 md:p-10 lg:p-12 pb-24 md:pb-12 w-full">
            {children}
          </main>
        </div>
        <NotificationEngine />
      </body>
    </html>
  );
}