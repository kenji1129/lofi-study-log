import { useEffect, useState } from 'react'
import BootLogo from './BootLogo'
import Icon from './Icon'

const DURATION = 4000 // ~4s before the call fully ends

// Shutdown "call ended" screen with a halftone burst. Tries to close the tab;
// if the browser blocks that (tabs the user opened can't be closed by script),
// it shows a quiet farewell instead of returning to the app.
export default function ShutdownScreen() {
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      // attempt to close the tab/window
      window.open('', '_self')
      window.close()
      // fallback: if still here a moment later, show the farewell screen
      setTimeout(() => setClosed(true), 500)
    }, DURATION)
    return () => clearTimeout(t)
  }, [])

  if (closed) {
    return (
      <div className="boot boot--end boot--bye">
        <div className="boot__center">
          <div className="boot__logo-wrap">
            <BootLogo size={108} />
          </div>
          <div className="boot__status">通話を終了しました</div>
          <p className="boot__bye-msg">
            また机をならべようね。<br />
            このタブは閉じて大丈夫です。
          </p>
          <button className="pill" onClick={() => location.reload()}>
            もう一度はじめる
          </button>
        </div>
        <div className="boot__brand">Lo-Fi Study Log</div>
      </div>
    )
  }

  return (
    <div className="boot boot--end">
      <div className="boot__halftone" />
      <div className="boot__center">
        <div className="boot__logo-wrap">
          <BootLogo />
          <span className="boot__call boot__call--hangup">
            <Icon name="phone" size={22} />
          </span>
        </div>
        <div className="boot__status">通話を終了しました</div>
      </div>
      <div className="boot__brand">Lo-Fi Study Log</div>
    </div>
  )
}
