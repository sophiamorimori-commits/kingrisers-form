import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { STAGE_COLORS, GROUP_LETTERS, allWordsInStage, getGroupWords, totalWordsInStage } from '../lib/engine'
import { stageMasteryPercent, groupMasteryPercent } from '../lib/storage'

export default function Progress() {
  const { state } = useApp()
  const [selectedStage, setSelectedStage] = useState(state.progress.stage)

  return (
    <div className="mx-auto max-w-md px-5 pt-8 pb-28">
      <h1 className="text-xl font-extrabold text-[#1A2332]">学習進捗</h1>

      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4].map((s) => {
          const color = STAGE_COLORS[s]
          const active = selectedStage === s
          return (
            <button
              key={s}
              onClick={() => setSelectedStage(s)}
              className="flex-1 rounded-xl py-2 text-xs font-bold transition"
              style={{
                background: active ? color.accent : '#fff',
                color: active ? '#fff' : color.accent,
                border: `1.5px solid ${color.accent}`,
              }}
            >
              S{s}
            </button>
          )
        })}
      </div>

      {[1, 2, 3, 4].map((s) => {
        if (s !== selectedStage) return null
        const color = STAGE_COLORS[s]
        const pct = stageMasteryPercent(state, s, allWordsInStage)
        const total = totalWordsInStage(s)
        return (
          <div key={s} className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1A2332]">
                ステージ{s}・{color.name}
              </span>
              <span className="text-xs text-slate-400">{total}語</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: color.accent }}
              />
            </div>
            <div className="mt-1 text-right text-xs font-bold" style={{ color: color.accent }}>
              定着率 {pct}%
            </div>

            <div className="mt-5 space-y-3">
              {GROUP_LETTERS.map((g) => {
                const gpct = groupMasteryPercent(state, s, g, getGroupWords)
                return (
                  <div key={g}>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>グループ {g}</span>
                      <span>{gpct}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${gpct}%`, background: color.accent, opacity: 0.75 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="text-sm font-bold text-[#1A2332]">これまでの学習履歴</div>
        {state.history.length === 0 && (
          <p className="mt-2 text-xs text-slate-400">まだ完了した日がありません。</p>
        )}
        <ul className="mt-3 space-y-2">
          {[...state.history]
            .slice(-7)
            .reverse()
            .map((h, i) => (
              <li key={i} className="flex justify-between text-xs text-slate-500">
                <span>{h.date}</span>
                <span>
                  S{h.stage}・{h.correctFirstTry}/{h.total} 初回正答
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
