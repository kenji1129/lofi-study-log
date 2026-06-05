// Procedural lo-fi audio engine (Web Audio API).
// Generates warm chord pads + a sparse pentatonic melody + soft drums + vinyl
// crackle, plus a separate rain-ambience generator. No audio files required.

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12)

class LofiEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.musicGain = null
    this.ambientGain = null
    this.vinylGain = null

    this.track = null
    this.playing = false
    this.ambientOn = false
    this.ambientType = 'rain'

    this._timer = null
    this._nextNoteTime = 0
    this._step = 0 // 16th-note step counter
    this._noiseBuffer = null
    this._ambientNodes = null
  }

  _ensure() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    this.ctx = new Ctx()

    this.master = this.ctx.createGain()
    this.master.gain.value = 0.7
    this.master.connect(this.ctx.destination)

    this.musicGain = this.ctx.createGain()
    this.musicGain.gain.value = 0.9
    this.musicGain.connect(this.master)

    this.vinylGain = this.ctx.createGain()
    this.vinylGain.gain.value = 0.0
    this.vinylGain.connect(this.master)

    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.value = 0.0
    this.ambientGain.connect(this.master)

    this._noiseBuffer = this._makeNoise(2)
    this._startVinyl()
  }

  _makeNoise(seconds) {
    const len = this.ctx.sampleRate * seconds
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  setVolume(v) {
    this._ensure()
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(v, t, 0.05)
  }

  /* ---------------- music ---------------- */
  async playTrack(track) {
    this._ensure()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    this.track = track
    this.playing = true
    // fade vinyl crackle in with the music
    this.vinylGain.gain.setTargetAtTime(0.04, this.ctx.currentTime, 0.3)
    this.musicGain.gain.setTargetAtTime(0.9, this.ctx.currentTime, 0.3)
    if (!this._timer) {
      this._nextNoteTime = this.ctx.currentTime + 0.1
      this._step = 0
      this._scheduler()
    }
  }

  stop() {
    this.playing = false
    if (this.ctx) {
      this.vinylGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.3)
      this.musicGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.2)
    }
    clearTimeout(this._timer)
    this._timer = null
  }

  _scheduler() {
    if (!this.playing) return
    const spb = 60 / (this.track?.tempo || 70) // sec per beat
    const stepDur = spb / 4 // 16th notes
    while (this._nextNoteTime < this.ctx.currentTime + 0.15) {
      this._scheduleStep(this._step, this._nextNoteTime, stepDur)
      const swing =
        this._step % 2 === 1 ? (this.track?.swing || 0) * stepDur : 0
      this._nextNoteTime += stepDur + swing
      this._step = (this._step + 1) % 64 // 4 bars of 16 steps
    }
    this._timer = setTimeout(() => this._scheduler(), 25)
  }

  _scheduleStep(step, time, stepDur) {
    const t = this.track
    if (!t) return
    const bar = Math.floor(step / 16)
    const inBar = step % 16

    // chord pad on the downbeat of each bar
    if (inBar === 0) {
      this._playPad(t.progression[bar % t.progression.length], time, stepDur * 16)
    }
    // bass note on beats 1 and 3
    if (inBar === 0 || inBar === 8) {
      const chord = t.progression[bar % t.progression.length]
      this._playBass(chord[0] - 12, time, stepDur * 7)
    }
    // soft kick on beats 1 & 3, hat on offbeats
    if (inBar === 0 || inBar === 8) this._kick(time)
    if (inBar === 4 || inBar === 12) this._snare(time)
    if (inBar % 2 === 0) this._hat(time, inBar % 4 === 0 ? 0.05 : 0.03)

    // sparse melody: pentatonic, ~30% of 8th notes
    if (inBar % 2 === 0 && Math.random() < 0.32) {
      const scale = t.scale
      const deg = scale[Math.floor(Math.random() * scale.length)]
      const oct = Math.random() < 0.4 ? 12 : 0
      this._playLead(t.root + 12 + deg + oct, time, stepDur * 2)
    }
  }

  _playPad(notes, time, dur) {
    const g = this.ctx.createGain()
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1400
    lp.Q.value = 0.4
    g.gain.setValueAtTime(0, time)
    g.gain.linearRampToValueAtTime(0.16, time + 0.5)
    g.gain.setValueAtTime(0.16, time + dur - 0.6)
    g.gain.linearRampToValueAtTime(0, time + dur)
    g.connect(lp)
    lp.connect(this.musicGain)
    notes.forEach((n) => {
      ;[0, 0.5].forEach((det, i) => {
        const o = this.ctx.createOscillator()
        o.type = i === 0 ? 'triangle' : 'sine'
        o.frequency.value = midiToFreq(n)
        o.detune.value = det * 6 - 1.5
        o.connect(g)
        o.start(time)
        o.stop(time + dur)
      })
    })
  }

  _playBass(note, time, dur) {
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = 'sine'
    o.frequency.value = midiToFreq(note)
    g.gain.setValueAtTime(0, time)
    g.gain.linearRampToValueAtTime(0.22, time + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, time + dur)
    o.connect(g)
    g.connect(this.musicGain)
    o.start(time)
    o.stop(time + dur + 0.05)
  }

  _playLead(note, time, dur) {
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 2200
    o.type = 'triangle'
    o.frequency.value = midiToFreq(note)
    g.gain.setValueAtTime(0, time)
    g.gain.linearRampToValueAtTime(0.10, time + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, time + dur)
    o.connect(lp)
    lp.connect(g)
    g.connect(this.musicGain)
    o.start(time)
    o.stop(time + dur + 0.05)
  }

  _kick(time) {
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(140, time)
    o.frequency.exponentialRampToValueAtTime(45, time + 0.12)
    g.gain.setValueAtTime(0.5, time)
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.18)
    o.connect(g)
    g.connect(this.musicGain)
    o.start(time)
    o.stop(time + 0.2)
  }

  _snare(time) {
    const src = this.ctx.createBufferSource()
    src.buffer = this._noiseBuffer
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1800
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.14, time)
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.16)
    src.connect(bp)
    bp.connect(g)
    g.connect(this.musicGain)
    src.start(time)
    src.stop(time + 0.18)
  }

  _hat(time, level) {
    const src = this.ctx.createBufferSource()
    src.buffer = this._noiseBuffer
    const hp = this.ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 7000
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(level, time)
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
    src.connect(hp)
    hp.connect(g)
    g.connect(this.musicGain)
    src.start(time)
    src.stop(time + 0.06)
  }

  _startVinyl() {
    // continuous warm crackle loop
    const src = this.ctx.createBufferSource()
    src.buffer = this._makeNoise(3)
    src.loop = true
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 5000
    const hp = this.ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 1500
    src.connect(hp)
    hp.connect(lp)
    lp.connect(this.vinylGain)
    src.start()
  }

  /* ---------------- ambience (rain etc.) ---------------- */
  setAmbient(on, type = 'rain') {
    this._ensure()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    this.ambientType = type
    this.ambientOn = on
    if (on) {
      this._buildAmbient(type)
      this.ambientGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.6)
    } else {
      this.ambientGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.6)
    }
  }

  _buildAmbient(type) {
    if (this._ambientNodes) {
      this._ambientNodes.forEach((n) => {
        try {
          n.stop && n.stop()
        } catch (e) {
          /* already stopped */
        }
      })
    }
    const src = this.ctx.createBufferSource()
    src.buffer = this._makeNoise(3)
    src.loop = true
    const filter = this.ctx.createBiquadFilter()
    if (type === 'rain') {
      filter.type = 'lowpass'
      filter.frequency.value = 3200
    } else if (type === 'wind') {
      filter.type = 'lowpass'
      filter.frequency.value = 700
    } else {
      // 'waves'
      filter.type = 'bandpass'
      filter.frequency.value = 500
    }
    // slow LFO on the filter for movement
    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()
    lfo.frequency.value = type === 'waves' ? 0.12 : 0.5
    lfoGain.gain.value = type === 'wind' ? 300 : 600
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    src.connect(filter)
    filter.connect(this.ambientGain)
    src.start()
    lfo.start()
    this._ambientNodes = [src, lfo]
  }
}

export const engine = new LofiEngine()
