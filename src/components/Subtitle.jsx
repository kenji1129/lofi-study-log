import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

const DISPLAY_MS = 5000   // how long the subtitle stays visible
const FADEOUT_MS = 600    // must match CSS animation duration

export default function Subtitle() {
  const subtitle = useAppStore((s) => s.subtitle)
  const subtitleTs = useAppStore((s) => s.subtitleTs)
  const on = useAppStore((s) => s.settings.subtitlesOn)
  const clearSubtitle = useAppStore((s) => s.clearSubtitle)
  const hideTimer = useRef(null)

  // every time a new line arrives, (re-)start the hide timer
  useEffect(() => {
    if (!subtitle) return
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      clearSubtitle()
    }, DISPLAY_MS)
    return () => clearTimeout(hideTimer.current)
  }, [subtitleTs, subtitle, clearSubtitle])

  if (!on || !subtitle) return null

  return (
    <div className="subtitle" key={subtitleTs}>
      <span className="subtitle__bubble">{subtitle}</span>
    </div>
  )
}
