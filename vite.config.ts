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
        target: 'http://10.100.164.38', // 修改为正确的后端地址
        changeOrigin: true, // 修改请求头中的 Host 为目标地址
      }
    }
  }
})