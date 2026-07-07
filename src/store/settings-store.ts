'use client';
import { create } from 'zustand';
import type { UserSettings, Theme } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';
import { applyTheme, storeTheme } from '@/lib/theme';

interface SettingsStore {
  settings: UserSettings;
  setTheme: (t: Theme) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  loadFromStorage: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  setTheme: (theme) => {
    storeTheme(theme);
    applyTheme(theme);
    set((s) => ({ settings: { ...s.settings, theme } }));
  },
  updateSettings: (patch) =>
    set((s) => {
      const next = { ...s.settings, ...patch };
      try { localStorage.setItem('settings', JSON.stringify(next)); } catch {}
      return { settings: next };
    }),
  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem('settings');
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserSettings>;
        const settings = { ...DEFAULT_SETTINGS, ...parsed };
        applyTheme(settings.theme);
        set({ settings });
      }
    } catch {}
  },
}));
