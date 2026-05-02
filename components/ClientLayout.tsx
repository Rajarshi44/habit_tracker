'use client';

import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Sidebar } from '@/components/ui/Sidebar';
import { AuthModal } from '@/components/ui/AuthModal';
import { NotificationEngine } from '@/components/NotificationEngine';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      <main className={clsx(
        "flex-1 w-full",
        isLanding ? "max-w-full" : "max-w-4xl mx-auto p-6 md:p-10 lg:p-12 pb-24 md:pb-12"
      )}>
        {children}
      </main>
      <NotificationEngine />
      <AuthModal />
    </div>
  );
}
