import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { BACKGROUNDS } from '../data/backgrounds'
import { asset } from '../lib/asset'

const CHARACTER = asset('scene/character.png')

function resolveUrl(id, customUrl) {
  if (customUrl) return customUrl
  return BACKGROUNDS.find((b) => b.id === id)?.src ?? BACKGROUNDS[0].src
}

export default function Scene() {
  const backgroundId = useAppStore((s) => s.settings.backgroundId)
  const backgroundUrl = useAppStore((s) => s.settings.backgroundUrl)
  const crt = useAppStore((s) => s.settings.crt)
  const showChar = useAppStore((s) => s.settings.showCharacter !== false)
  const phase = useAppStore((s) => s.pomodoro.phase)
  const sayRandom = useAppStore((s) => s.sayRandom)

  // Two-layer crossfade: A/B swap
  const [layers, setLayers] = useState(() => {
    const url = resolveUrl(backgroundId, backgroundUrl)
    return { a: url, b: url, top: 'a' }
  })
  const prevUrl = useRef(layers.a)

  useEffect(() => {
    const next = resolveUrl(backgroundId, backgroundUrl)
    if (next === prevUrl.current) return
    prevUrl.current = next
    setLayers((l) => {
      if (l.top === 'a') return { a: l.a, b: next, top: 'b' }
      return { a: next, b: l.b, top: 'a' }
    })
  }, [backgroundId, backgroundUrl])

  return (
    <div className={`scene${phase === 'break' ? ' is-dim' : ''}`}>
      {/* layer A */}
      <div
        className="scene__photo"
        style={{
          backgroundImage: `url(${layers.a})`,
          opacity: layers.top === 'a' ? 1 : 0,
          zIndex: layers.top === 'a' ? 2 : 1,
        }}
      />
      {/* layer B */}
      <div
        className="scene__photo"
        style={{
          backgroundImage: `url(${layers.b})`,
          opacity: layers.top === 'b' ? 1 : 0,
          zIndex: layers.top === 'b' ? 2 : 1,
        }}
      />
      <div className="scene__lamp" style={{ zIndex: 3 }} />
      {showChar && (
        <img
          className="scene__char"
          src={CHARACTER}
          alt="Kikyou"
          draggable="false"
          style={{ zIndex: 4, cursor: 'pointer' }}
          onClick={sayRandom}
          title="Kikyouをクリック"
        />
      )}
      <div className="scene__vignette" style={{ zIndex: 5 }} />
      {crt && (
        <>
          <div className="scene__scan" style={{ zIndex: 6 }} />
          <div className="scene__grain" style={{ zIndex: 6 }} />
        </>
      )}
    </div>
  )
}
