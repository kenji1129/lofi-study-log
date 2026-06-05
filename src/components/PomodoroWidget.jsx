import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { fmtMS } from '../lib/date'
import Icon from './Icon'
import Stepper from './Stepper'

export default function PomodoroWidget() {
  const p = useAppStore((s) => s.pomodoro)
  const start = useAppStore((s) => s.startPomodoro)
  const pause = useAppStore((s) => s.pausePomodoro)
  const stop = useAppStore((s) => s.stopPomodoro)
  const skip = useAppStore((s) => s.skipPhase)
  const tick = useAppStore((s) => s.tickPomodoro)
  const setConfig = useAppStore((s) => s.setPomodoroConfig)

  const [showConfig, setShowConfig] = useState(false)

  // single global ticker
  useEffect(() => {
    if (!p.running) return
    const id = setInterval(() => tick(), 1000)
    return () => clearInterval(id)
  }, [p.running, tick])

  const total = p.phase === 'break' ? p.breakMin * 60 : p.workMin * 60
  const pct = total > 0 ? 1 - p.remaining / total : 0
  const R = 52
  const C = 2 * Math.PI * R
  const label = p.phase === 'break' ? '休憩中' : p.phase === 'work' ? '作業中' : '準備OK'
  const ringColor = p.phase === 'break' ? 'var(--green)' : 'var(--orange)'

  return (
    <div className="pomo">
      <svg className="pomo__ring" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} className="pomo__track" />
        <circle
          cx="60"
          cy="60"
          r={R}
          className="pomo__prog"
          style={{
            stroke: ringColor,
            strokeDasharray: C,
            strokeDashoffset: C * (1 - pct),
          }}
        />
      </svg>
      <div className="pomo__inner">
        <button
          className="pomo__round"
          onClick={() => setShowConfig((v) => !v)}
          title="ポモドーロ設定"
        >
          {p.round}/{p.rounds}
        </button>
        <div className="pomo__label">{label}</div>
        {/* clicking the time opens the per-timer settings */}
        <button
          className="pomo__time"
          onClick={() => setShowConfig((v) => !v)}
          title="タップして設定"
        >
          {fmtMS(p.remaining)}
        </button>
        <div className="pomo__controls">
          <button className="pomo__btn" onClick={stop} title="停止">
            <Icon name="stop" size={15} />
          </button>
          {p.running ? (
            <button className="pomo__btn is-main" onClick={pause} title="一時停止">
              <Icon name="pause" size={17} />
            </button>
          ) : (
            <button className="pomo__btn is-main" onClick={start} title="開始">
              <Icon name="play" size={17} />
            </button>
          )}
          <button className="pomo__btn" onClick={skip} title="スキップ">
            <Icon name="skip" size={15} />
          </button>
        </div>
      </div>

      {showConfig && (
        <>
          <div className="pomo-config__scrim" onClick={() => setShowConfig(false)} />
          <div className="pomo-config glass">
            <div className="pomo-config__head">
              <span>ポモドーロ設定</span>
              <button className="icon-btn" onClick={() => setShowConfig(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <Stepper
              label="作業時間"
              value={p.workMin}
              min={5}
              max={90}
              step={5}
              suffix="分"
              onChange={(v) => setConfig({ workMin: v })}
            />
            <Stepper
              label="休憩時間"
              value={p.breakMin}
              min={1}
              max={30}
              suffix="分"
              onChange={(v) => setConfig({ breakMin: v })}
            />
            <Stepper
              label="セット数"
              value={p.rounds}
              min={1}
              max={12}
              suffix="回"
              onChange={(v) => setConfig({ rounds: v })}
            />
            {p.phase !== 'idle' && (
              <p className="pomo-config__hint">
                変更は次のセットから反映されます
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
