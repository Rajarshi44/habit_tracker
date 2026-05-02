'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Today', href: '/dashboard' },
  { name: 'Heatmap', href: '/heatmap' },
  { name: 'Path', href: '/path' },
  { name: 'Insights', href: '/insights' },
  { name: 'History', href: '/history' },
];

export function Sidebar() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--background)] border-r border-[var(--border)] p-6 shrink-0 z-50">
      <div className="font-mono font-bold text-2xl tracking-[0.2em] mb-12 text-[var(--text-primary)]">
        GRIND<span className="text-emerald-500">.</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={clsx(
              "block px-4 py-3 rounded text-[13px] font-mono tracking-widest uppercase cursor-pointer transition-all duration-300",
              isActive 
                ? "bg-[var(--surface-2)] text-emerald-500 border-l-2 border-emerald-500 shadow-[inset_1px_0_0_0_rgba(16,185,129,0.1)]" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] border-l-2 border-transparent"
            )}>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="text-[10px] text-[var(--text-tertiary)] font-mono mt-auto uppercase tracking-widest leading-loose">
        system v1.0<br/>
        <span className="text-emerald-500/50">routines locked</span><br/>
        telemetry online
      </div>
    </aside>
  );
}