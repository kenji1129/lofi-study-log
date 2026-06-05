import { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import Scene from './components/Scene'
import Clock from './components/Clock'
import PomodoroWidget from './components/PomodoroWidget'
import LevelBadge from './components/LevelBadge'
import TabRail from './components/TabRail'
import SystemControls from './components/SystemControls'
import PlayerBar from './components/PlayerBar'
import Subtitle from './components/Subtitle'
import Drawer from './components/Drawer'
import AudioController from './components/AudioController'
import AutoSpeak from './components/AutoSpeak'
import SplashScreen from './components/SplashScreen'
import ShutdownScreen from './components/ShutdownScreen'
import SettingsPanel from './components/panels/SettingsPanel'
import HangupModal from './components/panels/HangupModal'

export default function App() {
  const uiHidden = useAppStore((s) => s.uiHidden)
  const activePanel = useAppStore((s) => s.activePanel)
  const ending = useAppStore((s) => s.ending)
  const toggleUI = useAppStore((s) => s.toggleUI)
  const sayGreeting = useAppStore((s) => s.sayGreeting)
  const [booting, setBooting] = useState(true)

  // when the splash finishes, drop into the room and let Kikyou greet us
  const finishBoot = () => {
    setBooting(false)
    setTimeout(() => sayGreeting(), 500)
  }

  // keyboard: H toggles UI
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'h' || e.key === 'H') toggleUI()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleUI])

  return (
    <div className="app">
      <Scene />
      <AudioController />
      <AutoSpeak />

      <div className={`hud${uiHidden ? ' is-hidden' : ''}`}>
        <Clock />
        <LevelBadge />
        <PomodoroWidget />
        <TabRail />
        <SystemControls />
        <PlayerBar />
        <Subtitle />
      </div>

      {/* when UI is hidden, a faint hint to bring it back */}
      {uiHidden && (
        <button className="show-ui-hint" onClick={toggleUI} title="UIを表示 (H)">
          画面をタップしてUIを表示
        </button>
      )}

      <Drawer />
      {activePanel === 'settings' && <SettingsPanel />}
      {activePanel === 'hangup' && <HangupModal />}

      {booting && <SplashScreen onDone={finishBoot} />}
      {ending && <ShutdownScreen />}
    </div>
  )
}
