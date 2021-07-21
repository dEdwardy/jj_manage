import { defineConfig } from 'vite'
import { SvgBuilder } from './src/plugins/SvgBuilder'
import styleImport from 'vite-plugin-style-import'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/jj-manage/',
  esbuild:{
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  server: {
    port: 8888,
  },
  plugins: [
    vue(),
    vueJsx(),
    SvgBuilder('./src/icons/svg/'),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/css`
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
