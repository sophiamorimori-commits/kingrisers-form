import {
  getDayPlan,
  getWordsForGroups,
  isStageComplete,
  shuffle,
  todayDateKey,
  daysBetween,
  wordKey,
} from './engine'

const STORAGE_KEY = 'vocab_app_state_v1'

export function defaultState() {
  return {
    settings: {
      cyclesPerStage: 6,
      reminderEnabled: false,
      reminderTime: '20:00',
    },
    progress: {
      stage: 1,
      dayIndex: 1,
      allStagesDone: false,
    },
    today: null,
    wordStats: {},
    streak: {
      count: 0,
      lastDoneDate: null,
    },
    history: [],
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode etc.) - fail silently
  }
}

export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  return defaultState()
}

function buildSessionForDay(stageNum, dayIndex) {
  const plan = getDayPlan(dayIndex)
  const words = getWordsForGroups(stageNum, plan.groups)
  return {
    dateKey: todayDateKey(),
    stage: stageNum,
    dayIndex,
    cycle: plan.cycle,
    dayInCycle: plan.dayInCycle,
    groups: plan.groups,
    phase: 'main',
    round: 1,
    queue: shuffle(words),
    wrongThisRound: [],
    total: words.length,
    answeredCount: 0,
    correctFirstTry: 0,
    done: false,
  }
}

// Ensures state.today reflects the session that should be active right now.
// Advances progress/stage if the previous day's session was completed.
export function ensureSession(state) {
  const todayKey = todayDateKey()
  let { progress, today } = state

  if (progress.allStagesDone) {
    return state
  }

  if (!today) {
    today = buildSessionForDay(progress.stage, progress.dayIndex)
    return { ...state, today }
  }

  if (today.done && today.dateKey !== todayKey) {
    // Previous session finished on an earlier day -> advance.
    let nextStage = progress.stage
    let nextDayIndex = progress.dayIndex + 1
    let allStagesDone = false

    if (isStageComplete(nextDayIndex, state.settings.cyclesPerStage)) {
      if (nextStage < 4) {
        nextStage += 1
        nextDayIndex = 1
      } else {
        allStagesDone = true
      }
    }

    progress = { stage: nextStage, dayIndex: nextDayIndex, allStagesDone }
    today = allStagesDone ? null : buildSessionForDay(nextStage, nextDayIndex)
    return { ...state, progress, today }
  }

  if (today.dateKey !== todayKey) {
    // Still mid-session from a previous day - just relabel, keep progress.
    today = { ...today, dateKey: todayKey }
    return { ...state, today }
  }

  return state
}

export function answerWord(state, word, selectedOption) {
  const today = state.today
  if (!today || today.queue.length === 0) return state

  const isCorrect = selectedOption === word.correct
  const key = wordKey(today.stage, word.group, word.word)
  const prevStat = state.wordStats[key] || { correct: 0, wrong: 0, mastery: 0 }
  const nextStat = isCorrect
    ? { correct: prevStat.correct + 1, wrong: prevStat.wrong, mastery: Math.min(3, prevStat.mastery + 1) }
    : { correct: prevStat.correct, wrong: prevStat.wrong + 1, mastery: 0 }

  const remainingQueue = today.queue.slice(1)
  const wrongThisRound = isCorrect ? today.wrongThisRound : [...today.wrongThisRound, word]
  const correctFirstTry =
    today.round === 1 && isCorrect ? today.correctFirstTry + 1 : today.correctFirstTry

  let nextToday = {
    ...today,
    queue: remainingQueue,
    wrongThisRound,
    answeredCount: today.answeredCount + 1,
    correctFirstTry,
  }

  let nextHistory = state.history
  let nextStreak = state.streak

  if (remainingQueue.length === 0) {
    if (wrongThisRound.length === 0) {
      // Round complete with nothing wrong -> day done.
      nextToday = { ...nextToday, done: true }
      const todayKey = todayDateKey()
      if (state.streak.lastDoneDate !== todayKey) {
        const gap = state.streak.lastDoneDate ? daysBetween(state.streak.lastDoneDate, todayKey) : null
        const newCount = gap === 1 ? state.streak.count + 1 : 1
        nextStreak = { count: newCount, lastDoneDate: todayKey }
      }
      nextHistory = [
        ...state.history,
        {
          date: todayKey,
          stage: today.stage,
          dayIndex: today.dayIndex,
          total: today.total,
          correctFirstTry: nextToday.correctFirstTry,
        },
      ].slice(-60)
    } else {
      // Start a new retry round with only the missed words.
      nextToday = {
        ...nextToday,
        phase: 'retry',
        round: today.round + 1,
        queue: shuffle(wrongThisRound),
        wrongThisRound: [],
      }
    }
  }

  return {
    ...state,
    today: nextToday,
    wordStats: { ...state.wordStats, [key]: nextStat },
    streak: nextStreak,
    history: nextHistory,
  }
}

export function stageMasteryPercent(state, stageNum, allWordsInStageFn) {
  const words = allWordsInStageFn(stageNum)
  if (words.length === 0) return 0
  let total = 0
  for (const w of words) {
    const key = wordKey(stageNum, w.group, w.word)
    const stat = state.wordStats[key]
    total += stat ? stat.mastery : 0
  }
  return Math.round((total / (words.length * 3)) * 100)
}

export function groupMasteryPercent(state, stageNum, groupLetter, getGroupWordsFn) {
  const words = getGroupWordsFn(stageNum, groupLetter)
  if (words.length === 0) return 0
  let total = 0
  for (const w of words) {
    const key = wordKey(stageNum, groupLetter, w.word)
    const stat = state.wordStats[key]
    total += stat ? stat.mastery : 0
  }
  return Math.round((total / (words.length * 3)) * 100)
}
