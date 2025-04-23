// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mubarak-product/', // ✅ MUST end with a slash
  plugins: [react()],
})
