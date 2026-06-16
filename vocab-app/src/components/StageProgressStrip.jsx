import { STAGE_COLORS } from '../lib/engine'

export default function StageProgressStrip({ currentStage, allStagesDone }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((s) => {
        const color = STAGE_COLORS[s]
        const isPast = allStagesDone || s < currentStage
        const isCurrent = !allStagesDone && s === currentStage
        return (
          <div
            key={s}
            className="flex-1 rounded-full"
            style={{
              height: 8,
              background: isPast || isCurrent ? color.accent : '#E2E6EC',
              opacity: isCurrent ? 1 : isPast ? 0.85 : 1,
            }}
          />
        )
      })}
    </div>
  )
}
