// Leveling math. XP is stored as a single cumulative total; level + progress
// are derived so they can never drift out of sync.

// XP required to advance FROM `level` to `level + 1`.
export function xpForLevel(level) {
  return 100 + (level - 1) * 50 // 100, 150, 200, 250, ...
}

// Derive level info from cumulative XP.
export function getLevelInfo(totalXp) {
  let level = 1
  let remaining = Math.max(0, Math.floor(totalXp || 0))
  let need = xpForLevel(level)
  while (remaining >= need) {
    remaining -= need
    level += 1
    need = xpForLevel(level)
  }
  return {
    level,
    xpInLevel: remaining,
    need,
    progress: need > 0 ? remaining / need : 0,
  }
}

// XP reward constants
export const XP = {
  focusBlock: 40, // completing one 25-min focus block
  restBlock: 10, // completing one break (a full cycle)
  allRoundsBonus: 30, // finishing every set
  taskDone: 12, // checking off a ToDo task
}
