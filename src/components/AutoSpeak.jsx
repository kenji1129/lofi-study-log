import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

const MIN_MS = 2 * 60 * 1000   // 2 minutes
const MAX_MS = 6 * 60 * 1000   // 6 minutes

function nextDelay() {
  return MIN_MS + Math.random() * (MAX_MS - MIN_MS)
}

// Headless: fires sayRandom on a random 2–6 min interval while the page is visible.
export default function AutoSpeak() {
  const sayRandom = useAppStore((s) => s.sayRandom)
  const timer = useRef(null)

  const schedule = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!document.hidden) sayRandom()
      schedule()
    }, nextDelay())
  }

  useEffect(() => {
    schedule()
    return () => clearTimeout(timer.current)
  }, [])

  return null
}
