import { useState } from 'react'
import { asset } from '../lib/asset'

// Circular app logo. Uses /logo.png if present, otherwise a penguin fallback
// so the boot/shutdown screens still look intentional before the user adds art.
export default function BootLogo({ size = 132 }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="boot-logo" style={{ width: size, height: size }}>
      {!failed ? (
        <img
          src={asset('logo.png')}
          alt="Lo-Fi Study Log"
          draggable="false"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="boot-logo__fallback" aria-hidden="true">
          🐧
        </span>
      )}
    </div>
  )
}
