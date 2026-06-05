import { useEffect, useState } from 'react'
import { clockParts } from '../lib/date'

export default function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const { date, time, ampm } = clockParts(now)

  return (
    <div className="clock">
      <div className="clock__date">{date}</div>
      <div className="clock__time">
        {time}
        <span className="clock__ampm">{ampm}</span>
      </div>
    </div>
  )
}
