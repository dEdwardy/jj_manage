import { defineConfig } from 'vite'
import { SvgBuilder } from './src/plugins/SvgBuilder'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003,
  },
  plugins: [vue(), SvgBuilder('./src/icons/svg/')],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
