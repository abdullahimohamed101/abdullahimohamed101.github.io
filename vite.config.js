import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages has no SPA fallback, so the case study is its own HTML entry (/agent-black-box/).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        agentBlackBox: resolve(import.meta.dirname, 'agent-black-box/index.html'),
      },
    },
  },
})
