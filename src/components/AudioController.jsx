import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { engine } from '../audio/engine'
import { music } from '../audio/music'
import { TRACKS } from '../data/tracks'

// Headless: plays real mp3 tracks via the shared <audio> element and keeps the
// Web Audio engine (used only for nature ambience) in sync with the store.
export default function AudioController() {
  const playing = useAppStore((s) => s.player.playing)
  const trackIndex = useAppStore((s) => s.player.trackIndex)
  const volume = useAppStore((s) => s.settings.volume)
  const bgmEnabled = useAppStore((s) => s.settings.bgmEnabled)
  const ambient = useAppStore((s) => s.settings.ambient)
  const ambientType = useAppStore((s) => s.settings.ambientType)
  const nextTrack = useAppStore((s) => s.nextTrack)

  // advance when a track finishes
  useEffect(() => {
    const onEnded = () => nextTrack()
    music.addEventListener('ended', onEnded)
    return () => music.removeEventListener('ended', onEnded)
  }, [nextTrack])

  // volume (mp3 element + ambience engine)
  useEffect(() => {
    music.volume = volume
    engine.setVolume(volume)
  }, [volume])

  // load the right track src when the index changes
  useEffect(() => {
    const url = TRACKS[trackIndex]?.src
    if (!url) return
    const absolute = new URL(url, window.location.href).href
    if (music.src !== absolute) {
      music.src = url
    }
  }, [trackIndex])

  // play / pause
  useEffect(() => {
    if (playing && bgmEnabled) {
      const url = TRACKS[trackIndex]?.src
      if (url && !music.src) music.src = url
      music.play().catch(() => {
        /* autoplay blocked until a user gesture — ignored */
      })
    } else {
      music.pause()
    }
  }, [playing, trackIndex, bgmEnabled])

  // nature ambience (procedural)
  useEffect(() => {
    engine.setAmbient(ambient, ambientType)
  }, [ambient, ambientType])

  return null
}
