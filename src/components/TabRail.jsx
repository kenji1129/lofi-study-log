import { useAppStore } from '../store/useAppStore'
import Icon from './Icon'

const TABS = [
  { key: 'notes', icon: 'note', label: 'ノート' },
  { key: 'todo', icon: 'check', label: 'ToDoリスト' },
  { key: 'habits', icon: 'habit', label: '習慣トラッカー' },
  { key: 'calendar', icon: 'calendar', label: 'カレンダー' },
]

export default function TabRail() {
  const active = useAppStore((s) => s.activePanel)
  const openPanel = useAppStore((s) => s.openPanel)

  return (
    <nav className="tab-rail">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`orb${active === t.key ? ' is-active' : ''}`}
          onClick={() => openPanel(t.key)}
          title={t.label}
          aria-label={t.label}
        >
          <Icon name={t.icon} />
        </button>
      ))}
    </nav>
  )
}
