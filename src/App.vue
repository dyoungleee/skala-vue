<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <header class="global-nav">
      <RouterLink class="brand" to="/">
        <svg viewBox="0 0 28 28">
          <path
            d="M9.2 21.25h10.05a5.25 5.25 0 0 0 .72-10.45A7.4 7.4 0 0 0 6.1 9.34a6 6 0 0 0 3.1 11.91Z"
          />
          <path d="M5.65 21.25h3.8" />
        </svg>
        <span>Weather</span>
      </RouterLink>

      <div class="nav-actions">
        <nav class="nav-links">
          <RouterLink to="/">날씨</RouterLink>
          <!-- 기본 내비게이션에 Bio Data Planner 페이지 이동 경로를 추가함 -->
          <RouterLink to="/bio-planner">Bio Planner</RouterLink>
          <RouterLink to="/about">서비스 소개</RouterLink>
        </nav>
        <UnitToggler />
      </div>
    </header>

    <RouterView />

    <footer class="app-footer">
      <p>Weather Router</p>
      <p>Vue Router로 만든 지역별 날씨 대시보드</p>
    </footer>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>
