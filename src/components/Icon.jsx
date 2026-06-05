// Minimal stroke-based icon set (24x24, currentColor). One component, name prop.
const P = {
  note: (
    <>
      <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M9.5 8h5M9.5 12h5M9.5 16h3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2 4.8-5" />
    </>
  ),
  habit: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M9 14.5l2 2 4-4" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 3.8M6.3 6.3A18.5 18.5 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 4-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 12a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.3 7.3 0 0 0-2.2-1.3L14.3 2h-4.6l-.4 2.4a7.3 7.3 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.3 7.3 0 0 0 2.2 1.3l.4 2.4h4.6l.4-2.4a7.3 7.3 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.07-.43.1-.86.1-1.3Z" />
    </>
  ),
  phone: (
    <>
      <path d="M3.8 9.5c5-3.3 11.4-3.3 16.4 0 .9.6 1.1 1.8.5 2.7l-1.1 1.5c-.5.7-1.4.9-2.1.5l-2.1-1.1a1.7 1.7 0 0 1-.9-1.7l.2-1.3c-2-.6-4.2-.6-6.2 0l.2 1.3c.1.7-.2 1.4-.9 1.7l-2.1 1.1c-.7.4-1.6.2-2.1-.5L3.3 12.2c-.6-.9-.4-2.1.5-2.7Z" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  stop: <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />,
  next: (
    <>
      <path d="M6 5.5v13l9-6.5-9-6.5Z" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="2.6" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  prev: (
    <>
      <path d="M18 5.5v13l-9-6.5 9-6.5Z" fill="currentColor" stroke="none" />
      <rect x="5.4" y="5" width="2.6" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  skip: (
    <>
      <path d="M6 5.5v13l9-6.5-9-6.5Z" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="2.6" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  shuffle: (
    <>
      <path d="M16 4h4v4M16 20h4v-4" />
      <path d="M20 4l-7 7M4 4l16 16" opacity="0.0" />
      <path d="M4 5h3l10 14h3M4 19h3l3-4M14 8l3-3" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 2l3 3-3 3" />
      <path d="M3 11V9a4 4 0 0 1 4-4h13" />
      <path d="M7 22l-3-3 3-3" />
      <path d="M21 13v2a4 4 0 0 1-4 4H4" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M17 9l4 6M21 9l-4 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  drag: (
    <>
      <circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevDown: <path d="M6 9l6 6 6-6" />,
  chevUp: <path d="M6 15l6-6 6 6" />,
  chevLeft: <path d="M15 6l-6 6 6 6" />,
  chevRight: <path d="M9 6l6 6-6 6" />,
  edit: (
    <>
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" fill="currentColor" stroke="none" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 15h18M8 4v16M16 4v16" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 8h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 2v2M11 2v2" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5L5 21" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
}

export default function Icon({ name, size = 24, stroke = 2, className = '', style }) {
  const path = P[name]
  if (!path) return null
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
