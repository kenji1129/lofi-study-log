const WEEK_JP = ['日', '月', '火', '水', '木', '金', '土']

export function pad(n) {
  return String(n).padStart(2, '0')
}

/** local YYYY-MM-DD key */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** { date: '2026/04/16(木)', time: '12:08', ampm: 'AM' } */
export function clockParts(date = new Date()) {
  const wd = WEEK_JP[date.getDay()]
  const dateStr = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
    date.getDate(),
  )}(${wd})`
  let h = date.getHours()
  const ampm = h < 12 ? 'AM' : 'PM'
  h = h % 12
  if (h === 0) h = 12
  return { date: dateStr, time: `${pad(h)}:${pad(date.getMinutes())}`, ampm }
}

export function weekdayJP(date) {
  return WEEK_JP[date.getDay()]
}

/** seconds -> HH:MM:SS */
export function fmtHMS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(
    s % 60,
  )}`
}

/** seconds -> MM:SS */
export function fmtMS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
}

/** array of Date for a week centered/anchored around `date` (7 days, today-ish in middle) */
export function weekStrip(center = new Date()) {
  const days = []
  for (let i = -2; i <= 4; i++) {
    const d = new Date(center)
    d.setDate(center.getDate() + i)
    days.push(d)
  }
  return days
}

/** matrix of weeks for a given year/month (each cell Date or null) */
export function monthMatrix(year, month) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
