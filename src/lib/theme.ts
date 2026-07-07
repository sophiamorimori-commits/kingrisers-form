import type { Theme } from '@/types/settings';

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'warm');
  } else if (theme === 'warm') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'warm';
  return (localStorage.getItem('theme') as Theme) ?? 'warm';
}

export function storeTheme(theme: Theme): void {
  localStorage.setItem('theme', theme);
}
