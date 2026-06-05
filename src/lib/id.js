let counter = 0

/** short unique-enough id for local entities */
export function uid(prefix = 'id') {
  counter = (counter + 1) % 100000
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`
}
