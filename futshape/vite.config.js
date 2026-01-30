import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Permite servir arquivos de um nível acima da raiz do projeto
      allow: ['..']
    }
  }
})