import { useAppStore } from '../store/useAppStore'
import Icon from './Icon'

export default function SystemControls() {
  const toggleUI = useAppStore((s) => s.toggleUI)
  const openPanel = useAppStore((s) => s.openPanel)

  return (
    <div className="sys-controls">
      <button
        className="orb"
        onClick={toggleUI}
        title="UIを隠す (H)"
        aria-label="UIを隠す"
      >
        <Icon name="eye" />
      </button>
      <button
        className="orb"
        onClick={() => openPanel('settings')}
        title="設定"
        aria-label="設定"
      >
        <Icon name="gear" />
      </button>
      <button
        className="orb orb--hangup"
        onClick={() => openPanel('hangup')}
        title="通話終了"
        aria-label="通話終了"
      >
        <Icon name="phone" />
      </button>
    </div>
  )
}
