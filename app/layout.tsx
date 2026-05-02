import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { ClientLayout } from '@/components/ClientLayout';

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
      <body className={clsx(mainFont.variable, jbMono.variable, 'antialiased bg-[#0a0a0a] text-white selection:bg-emerald-500/30')}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}