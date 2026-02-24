import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /**
   * REGLA DE LA ULL:
   * Los archivos estáticos se sirven desde /tfgapaST/
   * Al poner esta 'base', Vite generará los enlaces a CSS y JS 
   * apuntando correctamente a esa carpeta en el servidor.
   */
  base: '/tfgapaST/',
  
  build: {
    // Esto asegura que la carpeta de salida se llame 'dist'
    outDir: 'dist',
  }
})