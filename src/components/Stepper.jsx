// Shared +/- stepper used in Settings and the Pomodoro config popover.
export default function Stepper({ label, value, min, max, step = 1, suffix, onChange }) {
  return (
    <div className="set-row">
      <span className="set-row__label">{label}</span>
      <div className="stepper">
        <button onClick={() => onChange(Math.max(min, value - step))}>−</button>
        <span className="stepper__val">
          {value}
          {suffix}
        </span>
        <button onClick={() => onChange(Math.min(max, value + step))}>＋</button>
      </div>
    </div>
  )
}
