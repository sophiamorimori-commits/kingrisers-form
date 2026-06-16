import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { STAGE_COLORS, buildQuizOptions } from '../lib/engine'

export default function Learn() {
  const { state, answerWord } = useApp()
  const navigate = useNavigate()
  const { today } = state
  const [revealed, setRevealed] = useState(false)
  const [feedback, setFeedback] = useState(null) // { selected, isCorrect }

  const word = today && !today.done ? today.queue[0] : null

  useEffect(() => {
    setRevealed(false)
    setFeedback(null)
  }, [word?.word, word?.group])

  const options = useMemo(() => (word ? buildQuizOptions(word) : []), [word])

  if (!today) {
    navigate('/', { replace: true })
    return null
  }

  const color = STAGE_COLORS[today.stage]

  if (today.done) {
    return (
      <div className="mx-auto max-w-md px-5 pt-10 pb-28 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="text-5xl">✅</div>
          <h1 className="mt-4 text-xl font-bold text-[#1A2332]">今日のタスク完了！</h1>
          <p className="mt-2 text-sm text-slate-500">
            {today.total}語すべてに正解しました（初回正答 {today.correctFirstTry}/{today.total}）
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md"
            style={{ background: color.accent }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  if (!word) return null

  function handleReveal() {
    if (!revealed) setRevealed(true)
  }

  function handleSelect(option) {
    if (feedback) return
    const isCorrect = option === word.correct
    setFeedback({ selected: option, isCorrect })
    setTimeout(() => {
      answerWord(word, option)
    }, 850)
  }

  const progressPct = Math.round(
    ((today.total - today.queue.length) / today.total) * 100,
  )

  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-sm text-slate-400">
          ← 戻る
        </button>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: color.accent }}
        >
          {today.phase === 'retry' ? `誤答復習 R${today.round}` : 'ステージ' + today.stage}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progressPct}%`, background: color.accent }}
        />
      </div>
      <div className="mt-1 text-right text-xs text-slate-400">
        残り {today.queue.length} / {today.total}
      </div>

      <div
        className={`mt-6 rounded-2xl bg-white p-8 text-center shadow-sm ${
          feedback ? (feedback.isCorrect ? 'anim-correct' : 'anim-wrong') : ''
        }`}
        onClick={handleReveal}
      >
        <div className="text-3xl font-extrabold tracking-wide text-[#1A2332]">{word.word}</div>
        <div className="mt-1 text-xs text-slate-400">{word.pos}</div>
        {!revealed && (
          <div className="mt-6 text-sm font-semibold text-slate-400">
            タップして選択肢を表示
          </div>
        )}
      </div>

      {revealed && (
        <div className="mt-5 grid grid-cols-1 gap-3">
          {options.map((opt) => {
            let style = 'border-slate-200 bg-white text-[#1A2332]'
            if (feedback) {
              if (opt === word.correct) {
                style = 'border-emerald-400 bg-emerald-50 text-emerald-700'
              } else if (opt === feedback.selected) {
                style = 'border-red-400 bg-red-50 text-red-600'
              } else {
                style = 'border-slate-200 bg-white text-slate-400'
              }
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={!!feedback}
                className={`rounded-xl border-1.5 px-4 py-3.5 text-left text-sm font-semibold shadow-sm transition ${style}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {feedback && (
        <div
          className={`mt-4 rounded-xl py-2.5 text-center text-sm font-bold ${
            feedback.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}
        >
          {feedback.isCorrect ? '正解！' : `不正解（正解: ${word.correct}）`}
        </div>
      )}
    </div>
  )
}
