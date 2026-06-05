import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { monthMatrix, dayKey, fmtHMS, parseKey } from '../../lib/date'
import Icon from '../Icon'

const WD = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarPanel() {
  const days = useAppStore((s) => s.days)
  const todoLists = useAppStore((s) => s.todoLists)
  const setDiary = useAppStore((s) => s.setDiary)
  const setWorkSeconds = useAppStore((s) => s.setWorkSeconds)

  const today = new Date()
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [selected, setSelected] = useState(dayKey(today))
  const [editTime, setEditTime] = useState(false)

  const cells = monthMatrix(view.y, view.m)
  const todayKey = dayKey(today)
  const sel = days[selected] || { workSeconds: 0, diary: '' }

  const shiftMonth = (delta) => {
    let m = view.m + delta
    let y = view.y
    if (m < 0) {
      m = 11
      y--
    } else if (m > 11) {
      m = 0
      y++
    }
    setView({ y, m })
  }

  const doneTasks = todoLists.flatMap((l) =>
    l.tasks.filter((t) => t.done).map((t) => ({ ...t, list: l.name })),
  )

  const [showDone, setShowDone] = useState(true)

  return (
    <div className="panel">
      <h2 className="section-title">カレンダー</h2>
      <hr className="divider" />

      <div className="cal glass">
        <div className="cal__nav">
          <button className="icon-btn" onClick={() => shiftMonth(-1)}>
            <Icon name="chevLeft" size={18} />
          </button>
          <strong className="cal__month">
            {view.y}/{String(view.m + 1).padStart(2, '0')}
          </strong>
          <button className="icon-btn" onClick={() => shiftMonth(1)}>
            <Icon name="chevRight" size={18} />
          </button>
        </div>
        <div className="cal__wd">
          {WD.map((w, i) => (
            <span key={w} className={i === 0 ? 'is-sun' : i === 6 ? 'is-sat' : ''}>
              {w}
            </span>
          ))}
        </div>
        <div className="cal__grid">
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} className="cal__cell is-empty" />
            const k = dayKey(d)
            const log = days[k]
            const worked = log && log.workSeconds > 0
            return (
              <button
                key={k}
                className={`cal__cell${k === todayKey ? ' is-today' : ''}${
                  k === selected ? ' is-selected' : ''
                }`}
                onClick={() => setSelected(k)}
              >
                {d.getDate()}
                {worked && <span className="cal__mark">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* selected day detail */}
      <div className="cal-detail">
        <div className="cal-detail__label">
          {parseKey(selected).getFullYear()}/
          {String(parseKey(selected).getMonth() + 1).padStart(2, '0')}/
          {String(parseKey(selected).getDate()).padStart(2, '0')} の作業時間
        </div>
        <div className="cal-detail__time">
          {editTime ? (
            <input
              className="cal-detail__time-input"
              type="number"
              min="0"
              value={Math.round(sel.workSeconds / 60)}
              onChange={(e) =>
                setWorkSeconds(selected, Math.max(0, Number(e.target.value)) * 60)
              }
              onBlur={() => setEditTime(false)}
              autoFocus
            />
          ) : (
            <span>{fmtHMS(sel.workSeconds)}</span>
          )}
          <button
            className="icon-btn"
            onClick={() => setEditTime((v) => !v)}
            title="作業時間を編集（分）"
          >
            <Icon name="edit" size={18} />
          </button>
        </div>

        <hr className="divider" />
        <button className="todo-group" onClick={() => setShowDone((v) => !v)}>
          完了したタスク
          <Icon name={showDone ? 'chevUp' : 'chevDown'} size={20} />
        </button>
        {showDone && (
          <div className="todo-items">
            {doneTasks.length === 0 && <p className="empty">まだありません</p>}
            {doneTasks.map((t) => (
              <div className="task is-done" key={t.id}>
                <span className="task__check is-static">
                  <Icon name="check" size={14} />
                </span>
                <span className="task__text">{t.text}</span>
              </div>
            ))}
          </div>
        )}

        <hr className="divider" />
        <textarea
          className="cal-diary scroll"
          placeholder="日記を入力…"
          value={sel.diary || ''}
          onChange={(e) => setDiary(selected, e.target.value)}
        />
      </div>
    </div>
  )
}
