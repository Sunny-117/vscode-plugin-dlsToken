import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: { // 注入变量
          // additionalData: '@import "./src/style.less;',
          // javascriptEnabled: true
      }
    }
  }
})
