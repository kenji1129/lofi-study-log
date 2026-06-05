import { useEffect, useMemo, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { engine } from '../audio/engine'
import { music } from '../audio/music'
import { TRACKS } from '../data/tracks'
import { getAudio } from '../lib/audioDB'

// Headless: plays real mp3 tracks (built-in + user uploads) via the shared
// <audio> element and keeps the ambience engine in sync with the store.
export default function AudioController() {
  const playing = useAppStore((s) => s.player.playing)
  const trackIndex = useAppStore((s) => s.player.trackIndex)
  const volume = useAppStore((s) => s.settings.volume)
  const bgmEnabled = useAppStore((s) => s.settings.bgmEnabled)
  const ambient = useAppStore((s) => s.settings.ambient)
  const ambientType = useAppStore((s) => s.settings.ambientType)
  const nextTrack = useAppStore((s) => s.nextTrack)
  const customTracks = useAppStore((s) => s.customTracks)
  const setCustomTrackSrc = useAppStore((s) => s.setCustomTrackSrc)

  const playlist = useMemo(() => [...TRACKS, ...customTracks], [customTracks])
  const loadedRef = useRef(new Set())

  // rehydrate objectURLs for persisted custom tracks from IndexedDB
  useEffect(() => {
    customTracks.forEach((t) => {
      if (t.src || loadedRef.current.has(t.id)) return
      loadedRef.current.add(t.id)
      getAudio(t.id).then((blob) => {
        if (blob) setCustomTrackSrc(t.id, URL.createObjectURL(blob))
      })
    })
  }, [customTracks, setCustomTrackSrc])

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

  // load the right track src when the index (or its resolved url) changes
  const url = playlist[trackIndex]?.src
  useEffect(() => {
    if (!url) return
    const absolute = new URL(url, window.location.href).href
    if (music.src !== absolute) music.src = url
  }, [url])

  // play / pause
  useEffect(() => {
    if (playing && bgmEnabled) {
      if (url && !music.src) music.src = url
      music.play().catch(() => {
        /* autoplay blocked until a user gesture — ignored */
      })
    } else {
      music.pause()
    }
  }, [playing, url, bgmEnabled])

  // nature ambience (procedural)
  useEffect(() => {
    engine.setAmbient(ambient, ambientType)
  }, [ambient, ambientType])

  return null
}
