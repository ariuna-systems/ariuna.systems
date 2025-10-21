import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5174,
    middlewareMode: false,
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        company: 'company/index.html'
      }
    }
  }
})