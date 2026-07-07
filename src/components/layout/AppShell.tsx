'use client';
import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/store/settings-store';
import { applyTheme } from '@/lib/theme';
import MobileNav from './MobileNav';
import Header from './Header';

export default function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const theme = useSettingsStore((s) => s.settings.theme);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useSettingsStore.getState().loadFromStorage();
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto" style={{ background: 'var(--bg)' }}>
      <Header title={title} />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <MobileNav />
    </div>
  );
}
