import stagesData from '../data/stages.json' with { type: 'json' }

// Day-in-cycle (0-indexed) -> the two groups studied that day.
// Day1: D+A, Day2: A+B, Day3: B+C, Day4: C+D, then repeats (4 days = 1 cycle).
export const GROUP_ROTATION = [
  ['D', 'A'],
  ['A', 'B'],
  ['B', 'C'],
  ['C', 'D'],
]

export const STAGE_COLORS = {
  1: { name: 'ブルー', accent: '#2563eb', light: '#dbeafe', dark: '#1d4ed8' },
  2: { name: 'グリーン', accent: '#16a34a', light: '#dcfce7', dark: '#15803d' },
  3: { name: 'アンバー', accent: '#d97706', light: '#fef3c7', dark: '#b45309' },
  4: { name: 'レッド', accent: '#dc2626', light: '#fee2e2', dark: '#b91c1c' },
}

export const STAGES = stagesData.stages
export const META = stagesData.meta
export const GROUP_LETTERS = ['A', 'B', 'C', 'D']

export function getStage(stageNum) {
  return STAGES.find((s) => s.stage === stageNum)
}

export function getGroupWords(stageNum, groupLetter) {
  const stage = getStage(stageNum)
  if (!stage) return []
  return stage.groups[groupLetter] || []
}

export function getWordsForGroups(stageNum, groupLetters) {
  const words = []
  for (const g of groupLetters) {
    for (const w of getGroupWords(stageNum, g)) {
      words.push({ ...w, group: g })
    }
  }
  return words
}

export function wordKey(stageNum, group, word) {
  return `${stageNum}-${group}-${word}`
}

export function getDayPlan(dayIndex) {
  // dayIndex is 1-based, counts up indefinitely within a stage.
  const idx0 = dayIndex - 1
  const dayInCycle0 = idx0 % 4
  const cycle = Math.floor(idx0 / 4) + 1
  return {
    cycle,
    dayInCycle: dayInCycle0 + 1,
    groups: GROUP_ROTATION[dayInCycle0],
  }
}

export function isStageComplete(dayIndex, cyclesPerStage) {
  return dayIndex > cyclesPerStage * 4
}

export function totalWordsInStage(stageNum) {
  const stage = getStage(stageNum)
  if (!stage) return 0
  return stage.n_words
}

export function allWordsInStage(stageNum) {
  const stage = getStage(stageNum)
  if (!stage) return []
  const words = []
  for (const g of GROUP_LETTERS) {
    for (const w of stage.groups[g] || []) {
      words.push({ ...w, group: g })
    }
  }
  return words
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildQuizOptions(word) {
  return shuffle([word.correct, ...word.distractors])
}

export function todayDateKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function daysBetween(dateKeyA, dateKeyB) {
  const a = new Date(dateKeyA + 'T00:00:00')
  const b = new Date(dateKeyB + 'T00:00:00')
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}
