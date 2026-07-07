'use client';
import Link from 'next/link';
import { Settings, Plus } from 'lucide-react';

export default function Header({ title }: { title?: string }) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        {title ?? 'Timeline'}
      </span>
      <div className="flex items-center gap-2">
        <Link
          href="/day"
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ background: 'var(--accent)', color: '#fff' }}
          aria-label="予定を追加"
        >
          <Plus size={16} strokeWidth={2.5} />
        </Link>
        <Link
          href="/settings"
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
          aria-label="設定"
        >
          <Settings size={16} />
        </Link>
      </div>
    </header>
  );
}
