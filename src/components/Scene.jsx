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
  const parallaxOn = useAppStore((s) => s.settings.parallax !== false)
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

  /* ---------- 2.5D parallax ---------- */
  const bgRef = useRef(null)
  const lampRef = useRef(null)
  const charRef = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!parallaxOn || reduce) {
      // reset any residual transform
      ;[bgRef, lampRef, charRef].forEach((r) => {
        if (r.current) r.current.style.transform = ''
      })
      return
    }

    const onMove = (e) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('pointermove', onMove)

    let raf
    const loop = () => {
      // ease toward the pointer
      cur.current.x += (target.current.x - cur.current.x) * 0.06
      cur.current.y += (target.current.y - cur.current.y) * 0.06
      // gentle idle drift so the scene breathes without input
      const t = performance.now() / 1000
      const x = cur.current.x + Math.sin(t * 0.3) * 0.12
      const y = cur.current.y + Math.cos(t * 0.24) * 0.08

      if (bgRef.current)
        bgRef.current.style.transform = `scale(1.08) translate3d(${x * -8}px, ${y * -8}px, 0)`
      if (lampRef.current)
        lampRef.current.style.transform = `translate3d(${x * -16}px, ${y * -16}px, 0)`
      if (charRef.current)
        charRef.current.style.transform = `translate3d(${x * 24}px, ${y * 14}px, 0) rotateY(${x * 3.5}deg) rotateX(${y * -2.5}deg)`

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [parallaxOn])

  return (
    <div className={`scene${phase === 'break' ? ' is-dim' : ''}`}>
      <div className="scene__bg" ref={bgRef}>
        <div
          className="scene__photo"
          style={{
            backgroundImage: `url(${layers.a})`,
            opacity: layers.top === 'a' ? 1 : 0,
            zIndex: layers.top === 'a' ? 2 : 1,
          }}
        />
        <div
          className="scene__photo"
          style={{
            backgroundImage: `url(${layers.b})`,
            opacity: layers.top === 'b' ? 1 : 0,
            zIndex: layers.top === 'b' ? 2 : 1,
          }}
        />
      </div>

      <div className="scene__lamp" ref={lampRef} style={{ zIndex: 3 }} />

      {showChar && (
        <div className="scene__char-wrap" ref={charRef} style={{ zIndex: 4 }}>
          <img
            className="scene__char"
            src={CHARACTER}
            alt="Kikyou"
            draggable="false"
            onClick={sayRandom}
            title="Kikyouをクリック"
          />
        </div>
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
