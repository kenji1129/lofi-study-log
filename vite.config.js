import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is '/' for local dev & root hosting (Netlify, custom domain).
// On GitHub Pages it must be '/<repo-name>/'; the CI workflow passes that in
// via the VITE_BASE env var.
const base = process.env.VITE_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
