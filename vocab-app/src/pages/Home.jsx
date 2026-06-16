import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { STAGE_COLORS, totalWordsInStage } from '../lib/engine'
import StageProgressStrip from '../components/StageProgressStrip'

export default function Home() {
  const { state } = useApp()
  const navigate = useNavigate()
  const { progress, today, streak, settings } = state

  if (progress.allStagesDone) {
    return (
      <div className="mx-auto max-w-md px-5 pt-10 pb-28">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-4 text-xl font-bold text-[#1A2332]">全4ステージ完了！</h1>
          <p className="mt-2 text-sm text-slate-500">
            1,582語すべての学習サイクルを完了しました。お疲れさまでした。
          </p>
        </div>
      </div>
    )
  }

  const color = STAGE_COLORS[progress.stage]
  const total = totalWordsInStage(progress.stage)

  let statusLabel = '未着手'
  let statusDetail = `今日は ${today?.groups?.join(' + ')} グループ・${today?.total ?? 0}語`
  if (today?.done) {
    statusLabel = '完了 🎉'
    statusDetail = `今日のタスクは完了しました（正答 ${today.correctFirstTry}/${today.total}）`
  } else if (today && today.answeredCount > 0) {
    statusLabel = '学習中'
    const remaining = today.queue.length
    statusDetail =
      today.phase === 'retry'
        ? `誤答復習 ラウンド${today.round} ・ 残り${remaining}語`
        : `残り ${remaining} / ${today.total} 語`
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8 pb-28">
      <div className="mb-1 text-xs font-bold tracking-widest text-slate-400">VOCAB MASTER</div>
      <h1 className="text-2xl font-extrabold text-[#1A2332]">東大英単語マスター</h1>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: color.accent }}
          >
            ステージ {progress.stage} ・ {color.name}
          </span>
          <span className="text-xs text-slate-400">{total}語</span>
        </div>
        <div className="mt-3">
          <StageProgressStrip currentStage={progress.stage} allStagesDone={false} />
        </div>
        <div className="mt-2 text-xs text-slate-400">
          第{today?.cycle ?? 1}周目 ・ {today?.dayInCycle ?? 1}/4日目
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="text-xs font-bold text-slate-400">今日のタスク</div>
        <div className="mt-1 text-lg font-bold text-[#1A2332]">{statusLabel}</div>
        <p className="mt-1 text-sm text-slate-500">{statusDetail}</p>
        <button
          onClick={() => navigate('/learn')}
          disabled={today?.done}
          className="mt-4 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition disabled:opacity-50"
          style={{ background: color.accent }}
        >
          {today?.done ? '今日は完了しました' : today?.answeredCount > 0 ? '学習を続ける' : '今日の学習を始める'}
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-2xl bg-white p-4 text-center shadow-sm">
          <div className="text-2xl">🔥</div>
          <div className="mt-1 text-xl font-extrabold text-[#1A2332]">{streak.count}</div>
          <div className="text-xs text-slate-400">連続学習日数</div>
        </div>
        <div className="flex-1 rounded-2xl bg-white p-4 text-center shadow-sm">
          <div className="text-2xl">🔁</div>
          <div className="mt-1 text-xl font-extrabold text-[#1A2332]">{settings.cyclesPerStage}周</div>
          <div className="text-xs text-slate-400">1ステージの目標周回数</div>
        </div>
      </div>
    </div>
  )
}
