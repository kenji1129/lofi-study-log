import { useAppStore } from '../../store/useAppStore'
import { fmtHMS, dayKey } from '../../lib/date'
import Modal from '../Modal'
import Icon from '../Icon'

export default function HangupModal() {
  const closePanel = useAppStore((s) => s.closePanel)
  const endCall = useAppStore((s) => s.endCall)
  const days = useAppStore((s) => s.days)
  const today = days[dayKey()] || { workSeconds: 0 }

  return (
    <Modal title="通話終了" onClose={closePanel}>
      <div className="hangup">
        <div className="hangup__art">
          <Icon name="phone" size={40} />
        </div>
        <p className="hangup__msg">
          今日もおつかれさま。<br />
          いっしょに <strong>{fmtHMS(today.workSeconds)}</strong> 集中できたね。
        </p>
        <p className="hangup__sub">また机をならべようね。</p>
        <div className="hangup__actions">
          <button className="pill" onClick={closePanel}>
            まだ続ける
          </button>
          <button className="pill is-danger" onClick={endCall}>
            <Icon name="phone" size={16} /> 通話を終える
          </button>
        </div>
      </div>
    </Modal>
  )
}
