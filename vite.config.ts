import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173, // 前端开发服务器端口
    open: true, // 启动时自动打开浏览器
    proxy: {
      // 配置代理规则
      '/api': {
        target: 'http://localhost:8080', // 后端服务器地址
        changeOrigin: true, // 修改请求头中的 Host 为目标地址
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉请求路径中的 /api 前缀
      }
    }
  }
})