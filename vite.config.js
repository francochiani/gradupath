import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Permite desplegar en subrutas relativas (ej. GitHub Pages) sin problemas de paths
})
