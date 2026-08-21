import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Vite가 Vue 단일 파일 컴포넌트(.vue)를 해석하고 개발자 도구를 연결하도록 설정한다.
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // '@/...'가 항상 src 폴더를 가리키도록 경로 별칭을 등록한다.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
