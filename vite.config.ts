import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: '/lol_kek/', 
  plugins: [react(), tailwindcss()],
})