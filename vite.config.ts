import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173, // 前端开发服务器端口
    open: true, // 启动时自动打开浏览器
    proxy: {
      // 配置代理规则
      '/api': {
        target: 'http://localhost:8080', // 确认后端地址是否正确
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})