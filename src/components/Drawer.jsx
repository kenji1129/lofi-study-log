import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { clockParts } from '../lib/date'
import Icon from './Icon'
import NotesPanel from './panels/NotesPanel'
import TodoPanel from './panels/TodoPanel'
import HabitsPanel from './panels/HabitsPanel'
import CalendarPanel from './panels/CalendarPanel'

const TABS = [
  { key: 'notes', icon: 'note' },
  { key: 'todo', icon: 'check' },
  { key: 'habits', icon: 'habit' },
  { key: 'calendar', icon: 'calendar' },
]

const PANELS = {
  notes: NotesPanel,
  todo: TodoPanel,
  habits: HabitsPanel,
  calendar: CalendarPanel,
}

export default function Drawer() {
  const active = useAppStore((s) => s.activePanel)
  const openPanel = useAppStore((s) => s.openPanel)
  const closePanel = useAppStore((s) => s.closePanel)
  const [now, setNow] = useState(() => new Date())
  const prevIndexRef = useRef(-1)

  const isTabbed = active && PANELS[active]
  const index = TABS.findIndex((t) => t.key === active)

  // direction of the tab change: +1 → slide in from the right, -1 → from left
  const dir =
    prevIndexRef.current === -1 || index === -1
      ? 0
      : Math.sign(index - prevIndexRef.current)

  useEffect(() => {
    if (index !== -1) prevIndexRef.current = index
  }, [index])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closePanel])

  if (!isTabbed) return null
  const Panel = PANELS[active]
  const { date, time, ampm } = clockParts(now)

  return (
    <>
      <div className="drawer__scrim" onClick={closePanel} />
      <aside className="drawer" role="dialog" aria-modal="true">
        <header className="drawer__top">
          <div className="drawer__clock">
            {date} <strong>{time}</strong>
            <span className="drawer__ampm">{ampm}</span>
          </div>
          <button className="orb drawer__close" onClick={closePanel} aria-label="閉じる">
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="drawer__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`drawer__tab${active === t.key ? ' is-active' : ''}`}
              onClick={() => openPanel(t.key)}
            >
              <Icon name={t.icon} size={22} />
            </button>
          ))}
        </div>

        <div className="drawer__body scroll">
          <div
            className="panel-anim"
            key={active}
            style={{ '--enter-x': dir > 0 ? '22px' : dir < 0 ? '-22px' : '0px' }}
          >
            <Panel />
          </div>
        </div>
      </aside>
    </>
  )
}
