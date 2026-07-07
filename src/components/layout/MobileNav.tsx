'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarDays, CalendarRange, CheckSquare, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/day', label: 'Today', Icon: Calendar },
  { href: '/week', label: 'Week', Icon: CalendarDays },
  { href: '/month', label: 'Month', Icon: CalendarRange },
  { href: '/tasks', label: 'Tasks', Icon: CheckSquare },
  { href: '/analytics', label: 'Stats', Icon: BarChart3 },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex items-center justify-around px-2 py-2 safe-area-inset-bottom"
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
    >
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-colors"
            style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
