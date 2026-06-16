import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { state, updateSettings, reset } = useApp()
  const { settings } = state
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleResetClick() {
    if (confirmingReset) {
      reset()
      setConfirmingReset(false)
    } else {
      setConfirmingReset(true)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8 pb-28">
      <h1 className="text-xl font-extrabold text-[#1A2332]">設定</h1>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="text-sm font-bold text-[#1A2332]">1ステージの周回数</div>
        <p className="mt-1 text-xs text-slate-400">
          4日で1周。この周回数を終えると次のステージへ進みます（デフォルト6周＝24日）。
        </p>
        <div className="mt-4 flex items-center justify-center gap-5">
          <button
            onClick={() => updateSettings({ cyclesPerStage: Math.max(1, settings.cyclesPerStage - 1) })}
            className="h-10 w-10 rounded-full bg-slate-100 text-lg font-bold text-[#1A2332]"
          >
            −
          </button>
          <span className="text-2xl font-extrabold text-[#1A2332]">{settings.cyclesPerStage}周</span>
          <button
            onClick={() => updateSettings({ cyclesPerStage: Math.min(20, settings.cyclesPerStage + 1) })}
            className="h-10 w-10 rounded-full bg-slate-100 text-lg font-bold text-[#1A2332]"
          >
            ＋
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-[#1A2332]">学習リマインダー</div>
          <button
            onClick={() => updateSettings({ reminderEnabled: !settings.reminderEnabled })}
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{ background: settings.reminderEnabled ? '#1A2332' : '#E2E6EC' }}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: settings.reminderEnabled ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          iOSではホーム画面に追加（PWAインストール）した状態でないと通知を許可できません。Safariのタブを開いているだけでは届きません。
        </p>
        {settings.reminderEnabled && (
          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-500">開始時刻</label>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="text-sm font-bold text-[#1A2332]">データ</div>
        <p className="mt-1 text-xs text-slate-400">
          学習履歴・進捗をすべて削除し、ステージ1の最初からやり直します。
        </p>
        <button
          onClick={handleResetClick}
          className={`mt-3 w-full rounded-xl py-3 text-sm font-bold transition ${
            confirmingReset ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'
          }`}
        >
          {confirmingReset ? 'もう一度タップして完全に削除' : 'すべての学習データをリセット'}
        </button>
      </div>
    </div>
  )
}
