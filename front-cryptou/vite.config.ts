import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  devServer: {
    proxy: {
      '^/crypto': {
        target: 'http://localhost:3000/',
        ws: true,
        changeOrigin: true
      },
    }
  },
  optimizeDeps: {
    include: ["@amcharts/amcharts4/core", "@amcharts/amcharts4/charts"]
  }
})
