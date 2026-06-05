import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import Icon from './Icon'

export default function Modal({ title, children, onClose, wide }) {
  const closePanel = useAppStore((s) => s.closePanel)
  const close = onClose || closePanel

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <div className="modal__scrim" onClick={close}>
      <div
        className={`modal glass${wide ? ' modal--wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="modal__head">
          <h2 className="section-title">{title}</h2>
          <button className="orb modal__close" onClick={close} aria-label="閉じる">
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="modal__body scroll">{children}</div>
      </div>
    </div>
  )
}
