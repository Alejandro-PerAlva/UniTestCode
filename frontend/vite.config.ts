import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom', 
    globals: true,        
    setupFiles: './test/setupTests.ts', 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
})