// Resolve a public-folder asset path against Vite's base URL so the app works
// whether it's served from the domain root (/) or a sub-path (e.g. GitHub
// Pages: /repo-name/). import.meta.env.BASE_URL always ends with a slash.
export function asset(path) {
  return import.meta.env.BASE_URL + String(path).replace(/^\/+/, '')
}
