import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Если запущен dev-сервер — используем '/', если билд под GitHub Pages — '/LitCollab_demo/'
  base: command === 'serve' ? '/' : '/LitCollab_demo/',
  server: {
    port: 3000,
  },
  // Ensure environment variables are loaded
  envPrefix: 'VITE_'
}))