import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { weekStrip, dayKey, weekdayJP } from '../../lib/date'
import Icon from '../Icon'

export default function HabitsPanel() {
  const habits = useAppStore((s) => s.habits)
  const addHabit = useAppStore((s) => s.addHabit)
  const toggleHabit = useAppStore((s) => s.toggleHabit)
  const renameHabit = useAppStore((s) => s.renameHabit)
  const removeHabit = useAppStore((s) => s.removeHabit)
  const [edit, setEdit] = useState(false)

  const [anchor, setAnchor] = useState(() => new Date())
  const days = weekStrip(anchor)
  const todayKey = dayKey()

  const shift = (delta) => {
    const d = new Date(anchor)
    d.setDate(anchor.getDate() + delta * 7)
    setAnchor(d)
  }

  const streak = (h) => {
    let n = 0
    const d = new Date()
    while (h.records[dayKey(d)]) {
      n++
      d.setDate(d.getDate() - 1)
    }
    return n
  }

  return (
    <div className="panel">
      <h2 className="section-title">習慣トラッカー</h2>
      <hr className="divider" />

      <div className="habit-actions">
        <button className="pill" onClick={addHabit}>
          <span className="plus">＋</span> 新しい習慣
        </button>
        <button
          className={`pill${edit ? ' is-on' : ''}`}
          onClick={() => setEdit((v) => !v)}
        >
          <Icon name="gear" size={16} /> 習慣の編集
        </button>
      </div>

      <hr className="divider" />

      {/* week strip */}
      <div className="week-strip">
        <button className="icon-btn" onClick={() => shift(-1)}>
          <Icon name="chevLeft" size={18} />
        </button>
        <div className="week-strip__days">
          {days.map((d) => {
            const k = dayKey(d)
            return (
              <div
                key={k}
                className={`week-day${k === todayKey ? ' is-today' : ''}`}
              >
                <span className="week-day__num">{d.getDate()}</span>
                <span className="week-day__wd">{weekdayJP(d)}</span>
              </div>
            )
          })}
        </div>
        <button className="icon-btn" onClick={() => shift(1)}>
          <Icon name="chevRight" size={18} />
        </button>
      </div>

      {/* habit rows */}
      <div className="habit-list">
        {habits.length === 0 && <p className="empty">習慣を追加しよう</p>}
        {habits.map((h) => (
          <div className="habit-card" key={h.id} style={{ '--habit': h.color }}>
            <div className="habit-card__head">
              <span className="habit-card__streak" title="連続日数">
                🔥 {streak(h)}
              </span>
              {edit ? (
                <input
                  className="habit-card__name-input"
                  value={h.name}
                  onChange={(e) => renameHabit(h.id, e.target.value)}
                />
              ) : (
                <span className="habit-card__name">{h.name}</span>
              )}
              {edit ? (
                <button
                  className="icon-btn habit-card__del"
                  onClick={() => removeHabit(h.id)}
                  title="削除"
                >
                  <Icon name="trash" size={16} />
                </button>
              ) : (
                <span className="habit-card__drag">
                  <Icon name="drag" size={16} />
                </span>
              )}
            </div>
            <div className="habit-card__cells">
              {days.map((d) => {
                const k = dayKey(d)
                const on = !!h.records[k]
                return (
                  <button
                    key={k}
                    className={`habit-cell${on ? ' is-on' : ''}${
                      k === todayKey ? ' is-today' : ''
                    }`}
                    onClick={() => toggleHabit(h.id, k)}
                    aria-label={`${h.name} ${k}`}
                  >
                    {on && <Icon name="check" size={18} />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
