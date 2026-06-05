import { useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import Modal from '../Modal'
import Icon from '../Icon'
import Stepper from '../Stepper'

function Toggle({ label, on, onChange, hint }) {
  return (
    <div className="set-row">
      <span className="set-row__label">
        {label}
        {hint && <small className="set-row__hint">{hint}</small>}
      </span>
      <button
        className={`switch${on ? ' is-on' : ''}`}
        onClick={() => onChange(!on)}
        role="switch"
        aria-checked={on}
      >
        <span className="switch__knob" />
      </button>
    </div>
  )
}

export default function SettingsPanel() {
  const pomo = useAppStore((s) => s.pomodoro)
  const setPomo = useAppStore((s) => s.setPomodoroConfig)
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)
  const fileRef = useRef(null)

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSettings({ backgroundUrl: reader.result })
    reader.readAsDataURL(file)
  }

  const resetAll = () => {
    if (confirm('すべてのデータ（ノート・ToDo・習慣・記録）を消去します。よろしいですか？')) {
      localStorage.removeItem('lofi-study-log')
      location.reload()
    }
  }

  return (
    <Modal title="設定">
      <section className="set-group">
        <h3 className="set-group__title">ポモドーロ</h3>
        <Stepper
          label="作業時間"
          value={pomo.workMin}
          min={5}
          max={90}
          step={5}
          suffix="分"
          onChange={(v) => setPomo({ workMin: v })}
        />
        <Stepper
          label="休憩時間"
          value={pomo.breakMin}
          min={1}
          max={30}
          suffix="分"
          onChange={(v) => setPomo({ breakMin: v })}
        />
        <Stepper
          label="セット数"
          value={pomo.rounds}
          min={1}
          max={12}
          suffix="回"
          onChange={(v) => setPomo({ rounds: v })}
        />
      </section>

      <section className="set-group">
        <h3 className="set-group__title">サウンド</h3>
        <Toggle
          label="Lo-Fi BGM"
          on={settings.bgmEnabled}
          onChange={(v) => setSettings({ bgmEnabled: v })}
        />
        <div className="set-row">
          <span className="set-row__label">音量</span>
          <input
            className="set-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.volume}
            onChange={(e) => setSettings({ volume: Number(e.target.value) })}
          />
        </div>
        <Toggle
          label="自然の音"
          hint="BGMに環境音を重ねる"
          on={settings.ambient}
          onChange={(v) => setSettings({ ambient: v })}
        />
        <div className="set-row">
          <span className="set-row__label">環境音の種類</span>
          <div className="seg">
            {[
              ['rain', '雨'],
              ['wind', '風'],
              ['waves', '波'],
            ].map(([val, lbl]) => (
              <button
                key={val}
                className={`seg__btn${settings.ambientType === val ? ' is-on' : ''}`}
                onClick={() => setSettings({ ambientType: val })}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="set-group">
        <h3 className="set-group__title">背景</h3>
        <div className="set-row">
          <span className="set-row__label">画像を設定</span>
          <div className="set-row__actions">
            <button className="pill" onClick={() => fileRef.current?.click()}>
              <Icon name="image" size={16} /> 画像を選ぶ
            </button>
            {settings.backgroundUrl && (
              <button
                className="pill is-danger"
                onClick={() => setSettings({ backgroundUrl: '' })}
              >
                解除
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFile}
          />
        </div>
      </section>

      <section className="set-group">
        <h3 className="set-group__title">表示</h3>
        <Toggle
          label="キャラクターを表示"
          on={settings.showCharacter !== false}
          onChange={(v) => setSettings({ showCharacter: v })}
        />
        <Toggle
          label="字幕（Kikyouのことば）"
          on={settings.subtitlesOn}
          onChange={(v) => setSettings({ subtitlesOn: v })}
        />
        <Toggle
          label="CRTフィルター"
          hint="走査線とノイズ"
          on={settings.crt}
          onChange={(v) => setSettings({ crt: v })}
        />
      </section>

      <section className="set-group">
        <button className="pill is-danger set-reset" onClick={resetAll}>
          <Icon name="trash" size={16} /> データを初期化
        </button>
      </section>
    </Modal>
  )
}
