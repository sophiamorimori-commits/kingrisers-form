'use client';
import { useSettingsStore } from '@/store/settings-store';
import type { Theme, DisplayDensity } from '@/types/settings';

const THEMES: { value: Theme; label: string; desc: string }[] = [
  { value: 'warm', label: 'Warm Minimal', desc: '白を基調にした標準テーマ' },
  { value: 'dark', label: 'Dark Precision', desc: '黒を基調にした集中テーマ' },
  { value: 'neon', label: 'Neon Focus', desc: '深夜青とエメラルドのネオンテーマ' },
  { value: 'system', label: 'System Default', desc: 'OSの設定に従う' },
];

const DENSITIES: { value: DisplayDensity; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'large', label: 'Large' },
];

export default function SettingsView() {
  const { settings, setTheme, updateSettings } = useSettingsStore();

  return (
    <div className="px-4 py-4">
      {/* Theme */}
      <Section title="テーマ">
        <div className="flex flex-col gap-2">
          {THEMES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl card text-left transition-colors"
              style={{
                borderColor: settings.theme === value ? 'var(--accent)' : 'var(--border)',
                borderWidth: settings.theme === value ? '1.5px' : '1px',
              }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              {settings.theme === value && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Display */}
      <Section title="表示密度">
        <div className="flex gap-2">
          {DENSITIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSettings({ displayDensity: value })}
              className="flex-1 py-2 rounded-2xl text-sm font-semibold transition-colors"
              style={{
                background: settings.displayDensity === value ? 'var(--accent)' : 'var(--bg-subtle)',
                color: settings.displayDensity === value ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Time range */}
      <Section title="表示時間範囲">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>開始</label>
            <select
              value={settings.dayStartHour}
              onChange={(e) => updateSettings({ dayStartHour: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
              style={
                { background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
              }
            >
              {Array.from({ length: 12 }, (_, i) => i + 4).map((h) => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <div className="flex-1">
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>終了</label>
            <select
              value={settings.dayEndHour}
              onChange={(e) => updateSettings({ dayEndHour: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              {Array.from({ length: 8 }, (_, i) => i + 18).map((h) => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Completed toggle */}
      <Section title="完了済み予定">
        <button
          onClick={() => updateSettings({ showCompleted: !settings.showCompleted })}
          className="flex items-center justify-between w-full px-4 py-3 rounded-2xl card"
        >
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>完了済み予定を表示する</span>
          <div
            className="w-10 h-6 rounded-full transition-colors flex items-center px-0.5"
            style={{ background: settings.showCompleted ? 'var(--accent)' : 'var(--bg-subtle)' }}
          >
            <div
              className="w-5 h-5 rounded-full transition-transform"
              style={{
                background: '#fff',
                transform: settings.showCompleted ? 'translateX(16px)' : 'translateX(0)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </button>
      </Section>

      {/* Google Calendar placeholder */}
      <Section title="Googleカレンダー">
        <div className="px-4 py-4 rounded-2xl card text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Googleカレンダー連携は次のフェーズで実装予定
          </p>
          <button
            className="mt-3 text-sm font-semibold px-4 py-2 rounded-full"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
            disabled
          >
            Googleでログイン（次フェーズ）
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
