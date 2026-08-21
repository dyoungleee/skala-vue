<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BioDataPlanner from '../components/exercise/BioDataPlanner.vue'
import { useConfigStore } from '../stores/configStore.js'
import { usePlannerStore } from '../stores/plannerStore.js'

const plannerStore = usePlannerStore()
const configStore = useConfigStore()
const router = useRouter()

const {
  plannerCityQuery,
  selectedPlan,
  analysisLevel,
  analysisMessage,
  validationMessage,
  showAnalysis,
  availableCityNames,
  analysisMode,
  modeLabel,
  humidityThreshold,
  selectedPlannerCity,
} = storeToRefs(plannerStore)

// Planner의 기온도 기존 온도 단위 설정에 맞춰 함께 변환함
const plannerDisplayTemp = computed(() => {
  const rawTemp = selectedPlannerCity.value?.temp

  if (rawTemp === null || rawTemp === undefined) return '데이터 없음'
  if (configStore.unit === 'fahrenheit') return Math.round((rawTemp * 9) / 5 + 32)
  return rawTemp
})

const { updatePlannerCityQuery, updateSelectedPlan, analyzeResearch } = plannerStore

// 라디오에서 선택한 분석 모드를 Planner Store의 Action으로 전달함
const updateAnalysisMode = (newMode) => {
  if (newMode !== analysisMode.value) {
    plannerStore.toggleAnalysisMode()
  }
}

// API 호출 실패 시 공통 오류 화면으로 이동하고 입력 검증 메시지는 현재 화면에 유지함
const requestResearchAnalysis = async () => {
  try {
    await analyzeResearch()
  } catch (error) {
    console.error('Bio Planner 날씨 API 요청 실패:', error.response?.status || error.message)
    router.push('/api-error')
  }
}
</script>

<template>
  <main class="app-container page-container">
    <!-- 날씨 데이터를 연구 환경 분석에 활용하는 Bio Data Planner 페이지임 -->
    <section class="page-heading">
      <h1>Bio Data Planner</h1>
      <p>도시의 기상 조건을 바탕으로 연구 계획에 적합한 환경인지 확인해 보세요.</p>
    </section>

    <!-- View에서 Store의 상태와 컴포넌트의 입력 이벤트를 연결함 -->
    <div class="planner-page-content">
      <BioDataPlanner
        :planner-city-query="plannerCityQuery"
        :selected-plan="selectedPlan"
        :show-analysis="showAnalysis"
        :analysis-level="analysisLevel"
        :analysis-message="analysisMessage"
        :validation-message="validationMessage"
        :analysis-mode="analysisMode"
        :mode-label="modeLabel"
        :humidity-threshold="humidityThreshold"
        :selected-planner-city="selectedPlannerCity"
        :planner-display-temp="plannerDisplayTemp"
        :unit-symbol="configStore.unitSymbol"
        @update-planner-city="updatePlannerCityQuery"
        @update-selected-plan="updateSelectedPlan"
        @analyze-research="requestResearchAnalysis"
        @update-analysis-mode="updateAnalysisMode"
      />
      <p class="available-cities">분석 가능 도시: {{ availableCityNames }}</p>
    </div>
  </main>
</template>
