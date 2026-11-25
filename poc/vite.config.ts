import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@atoms': src('components/atoms'),
      '@molecules': src('components/molecules'),
      '@organisms': src('components/organisms'),
      '@pages': src('pages'),
    },
  },
})
