import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getLevelInfo, XP } from '../lib/level'
import Icon from './Icon'

export default function LevelBadge() {
  const xp = useAppStore((s) => s.xp)
  const [open, setOpen] = useState(false)
  const { level, xpInLevel, need, progress } = getLevelInfo(xp)

  const R = 30
  const C = 2 * Math.PI * R

  return (
    <div className="level">
      <button
        className="level__badge"
        onClick={() => setOpen((v) => !v)}
        title="レベル"
      >
        <svg className="level__ring" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={R} className="level__track" />
          <circle
            cx="36"
            cy="36"
            r={R}
            className="level__prog"
            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - progress) }}
          />
        </svg>
        <span className="level__label">Level</span>
        <span className="level__num">{level}</span>
      </button>

      {open && (
        <>
          <div className="level__scrim" onClick={() => setOpen(false)} />
          <div className="level__pop glass">
            <div className="level__pop-head">
              <span className="level__pop-lv">Lv. {level}</span>
              <button className="icon-btn" onClick={() => setOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="level__bar">
              <span className="level__bar-fill" style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="level__xp">
              次のレベルまで <strong>{need - xpInLevel}</strong> XP
              <span className="level__xp-sub">（{xpInLevel} / {need}）</span>
            </div>
            <hr className="divider" />
            <p className="level__how-title">経験値の集めかた</p>
            <ul className="level__how">
              <li>
                <span className="level__how-ico">⏱</span>
                集中（{useAppStore.getState().pomodoro.workMin}分）を完了
                <b>+{XP.focusBlock}</b>
              </li>
              <li>
                <span className="level__how-ico">☕</span>
                休憩まで終えてサイクル達成 <b>+{XP.restBlock}</b>
              </li>
              <li>
                <span className="level__how-ico">✓</span>
                ToDoタスクを完了 <b>+{XP.taskDone}</b>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
