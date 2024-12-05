/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",       // 如果是 Vite 项目
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 匹配 Vue 和其他文件
  ],
  theme: {
    extend: {}, // 可以扩展自定义的样式
  },
  plugins: [], // 如果需要插件（如 forms、typography），可在此引入
}

