import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { TRACKS } from '../data/tracks'
import { BACKGROUNDS } from '../data/backgrounds'
import { music } from '../audio/music'
import { fmtMS } from '../lib/date'
import Icon from './Icon'

export default function PlayerBar() {
  const player = useAppStore((s) => s.player)
  const volume = useAppStore((s) => s.settings.volume)
  const ambient = useAppStore((s) => s.settings.ambient)
  const setSettings = useAppStore((s) => s.setSettings)
  const togglePlay = useAppStore((s) => s.togglePlay)
  const next = useAppStore((s) => s.nextTrack)
  const prev = useAppStore((s) => s.prevTrack)
  const setPlayer = useAppStore((s) => s.setPlayer)
  const selectTrack = useAppStore((s) => s.selectTrack)

  const [showTracks, setShowTracks] = useState(false)
  const [showBg, setShowBg] = useState(false)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(0)
  const barRef = useRef(null)
  const bgFileRef = useRef(null)
  const track = TRACKS[player.trackIndex]

  const activeBgId = useAppStore((s) => s.settings.backgroundId)
  const activeBgUrl = useAppStore((s) => s.settings.backgroundUrl)

  const selectBg = (bg) => {
    if (bg.id === 'custom') {
      bgFileRef.current?.click()
    } else {
      setSettings({ backgroundId: bg.id, backgroundUrl: '' })
      setShowBg(false)
    }
  }

  const onBgFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSettings({ backgroundUrl: reader.result, backgroundId: 'custom' })
      setShowBg(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  useEffect(() => {
    const onTime = () => setCur(music.currentTime || 0)
    const onMeta = () => setDur(music.duration || 0)
    music.addEventListener('timeupdate', onTime)
    music.addEventListener('loadedmetadata', onMeta)
    music.addEventListener('durationchange', onMeta)
    return () => {
      music.removeEventListener('timeupdate', onTime)
      music.removeEventListener('loadedmetadata', onMeta)
      music.removeEventListener('durationchange', onMeta)
    }
  }, [])

  const pct = dur > 0 ? (cur / dur) * 100 : 0
  const seek = (e) => {
    const rect = barRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    if (dur > 0) music.currentTime = ratio * dur
  }

  return (
    <div className="player">
      <div
        className="player__seek"
        ref={barRef}
        onClick={seek}
        title={`${fmtMS(cur)} / ${fmtMS(dur)}`}
      >
        <span className="player__seek-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* left utility cluster */}
      <div className="player__utils">
        <div className="player__bg-wrap">
          <button
            className={`icon-btn${showBg ? ' is-on' : ''}`}
            title="背景をかえる"
            onClick={() => setShowBg((v) => !v)}
          >
            <Icon name="image" size={20} />
          </button>
          {showBg && (
            <>
              <div className="player__pop-scrim" onClick={() => setShowBg(false)} />
              <div className="bg-pop glass">
                <div className="bg-pop__head">背景をかえる</div>
                <div className="bg-grid">
                  {BACKGROUNDS.map((bg) => {
                    const isActive = activeBgUrl
                      ? bg.id === 'custom'
                      : bg.id === activeBgId
                    return (
                      <button
                        key={bg.id}
                        className={`bg-thumb${isActive ? ' is-active' : ''}`}
                        onClick={() => selectBg(bg)}
                        title={bg.label}
                      >
                        {bg.src ? (
                          <img src={bg.src} alt={bg.label} loading="lazy" />
                        ) : (
                          <div className="bg-thumb__upload">
                            <Icon name="image" size={22} />
                          </div>
                        )}
                        <span className="bg-thumb__label">{bg.label}</span>
                        {isActive && (
                          <span className="bg-thumb__check">
                            <Icon name="check" size={14} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
          <input
            ref={bgFileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onBgFile}
          />
        </div>
        <button
          className={`icon-btn player__music${showTracks ? ' is-on' : ''}`}
          title="プレイリスト"
          onClick={() => setShowTracks((v) => !v)}
        >
          <Icon name="music" size={20} />
          <span className="player__dot" />
        </button>
      </div>

      {/* now playing */}
      <div className="player__now">
        <div className="player__title">{track.title}</div>
        <div className="player__artist">{track.artist}</div>
      </div>

      {/* transport */}
      <div className="player__transport">
        <button
          className="icon-btn"
          title={volume > 0 ? 'ミュート' : 'ミュート解除'}
          onClick={() => setSettings({ volume: volume > 0 ? 0 : 0.7 })}
        >
          <Icon name={volume > 0 ? 'volume' : 'mute'} size={19} />
        </button>
        <input
          className="player__vol"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setSettings({ volume: Number(e.target.value) })}
          title="音量"
        />
        <button
          className={`icon-btn${player.shuffle ? ' is-on' : ''}`}
          title="シャッフル"
          onClick={() => setPlayer({ shuffle: !player.shuffle })}
        >
          <Icon name="shuffle" size={18} />
        </button>
        <button className="icon-btn" title="前の曲" onClick={prev}>
          <Icon name="prev" size={20} />
        </button>
        <button className="player__play" title="再生 / 一時停止" onClick={togglePlay}>
          <Icon name={player.playing ? 'pause' : 'play'} size={22} />
        </button>
        <button className="icon-btn" title="次の曲" onClick={next}>
          <Icon name="next" size={20} />
        </button>
        <button
          className={`icon-btn${ambient ? ' is-on' : ''}`}
          title="自然の音 (雨)"
          onClick={() => setSettings({ ambient: !ambient })}
        >
          <Icon name="repeat" size={18} />
        </button>
      </div>

      {showTracks && (
        <div className="tracklist glass">
          <div className="tracklist__head">プレイリスト</div>
          <div className="tracklist__scroll scroll">
            {TRACKS.map((t, i) => (
              <button
                key={t.title}
                className={`tracklist__item${i === player.trackIndex ? ' is-active' : ''}`}
                onClick={() => {
                  selectTrack(i)
                  setShowTracks(false)
                }}
              >
                <span className="tracklist__dot" style={{ background: t.color }} />
                <span className="tracklist__title">{t.title}</span>
                {i === player.trackIndex && player.playing && (
                  <span className="tracklist__eq">
                    <i></i><i></i><i></i>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
