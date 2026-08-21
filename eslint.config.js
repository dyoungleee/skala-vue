import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  // Vue와 JavaScript 파일만 정적 코드 검사 대상으로 지정한다.
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  // 빌드 결과와 테스트 결과 폴더는 직접 작성한 소스가 아니므로 검사에서 제외한다.
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // JavaScript, Vue, Oxlint의 권장 규칙을 차례로 적용한다.
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // 코드 모양은 Prettier가 담당하므로 ESLint의 포맷 관련 규칙은 비활성화한다.
  skipFormatting,
])
