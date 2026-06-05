import { useEffect, useRef, useState } from 'react'
import BootLogo from './BootLogo'
import Icon from './Icon'

const DURATION = 5000 // ~5s
const FADE = 850 // must match the bootOut animation duration in boot.css

// Startup "calling…" splash. Auto-dismisses after DURATION; tap to skip.
export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)

  const dismiss = () => {
    if (done.current) return
    done.current = true
    setLeaving(true)
    setTimeout(onDone, FADE)
  }

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`boot${leaving ? ' is-leaving' : ''}`}
      onClick={dismiss}
      role="button"
      title="タップでスキップ"
    >
      <div className="boot__center">
        <div className="boot__logo-wrap boot__logo-wrap--calling">
          <span className="boot__pulse" />
          <span className="boot__pulse boot__pulse--2" />
          <BootLogo />
          <span className="boot__call boot__call--ringing">
            <Icon name="phone" size={22} />
          </span>
        </div>
        <div className="boot__status">通話を呼び出し中…</div>
      </div>
      <div className="boot__brand">Lo-Fi Study Log</div>
      <div className="boot__skip">タップでスキップ</div>
    </div>
  )
}
