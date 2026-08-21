import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchLiveWeather, searchCities } from '../api/weatherApi.js'
import { weatherData } from '../data/weather.js'

export const usePlannerStore = defineStore('planner', () => {
  const plannerCityQuery = ref('')
  const selectedPlan = ref('')
  const analysisLevel = ref('')
  const analysisMessage = ref('')
  const validationMessage = ref('')
  const showAnalysis = ref(false)
  const analysisMode = ref('normal')

  const plannerWeatherList = ref([])
  // 마지막으로 실제 분석에 사용한 도시를 결과 화면에 직접 연결함
  const analyzedCity = ref(null)

  const selectedPlannerCity = computed(() => {
    // Geocoding API가 '부산'을 '부산광역시'처럼 바꿔도 분석에 사용한 최신 도시를 표시한다.
    return plannerWeatherList.value[0] || null
  })

  const availableCityNames = computed(() => weatherData.map((item) => item.name).join(' · '))

  // 분석 모드에 따라 습도 판단 기준을 일반 75%, 보수적 65%로 변경함
  const humidityThreshold = computed(() => (analysisMode.value === 'normal' ? 75 : 65))
  const modeLabel = computed(() => (analysisMode.value === 'normal' ? '일반 분석' : '보수적 분석'))

  // 입력값은 유지하면서 이전 검증 및 분석 결과만 초기화함
  function resetAnalysis() {
    analysisLevel.value = ''
    analysisMessage.value = ''
    validationMessage.value = ''
    showAnalysis.value = false
    analyzedCity.value = null
  }

  // 일반 분석과 보수적 분석 모드를 전환하고 이전 결과를 초기화함
  function toggleAnalysisMode() {
    analysisMode.value = analysisMode.value === 'normal' ? 'strict' : 'normal'
    resetAnalysis()
  }

  function updatePlannerCityQuery(newValue) {
    plannerCityQuery.value = newValue
    resetAnalysis()
  }

  function updateSelectedPlan(newValue) {
    selectedPlan.value = newValue
    resetAnalysis()
  }

  async function analyzeResearch() {
    resetAnalysis()

    if (plannerCityQuery.value.trim() === '' || selectedPlan.value === '') {
      validationMessage.value = '도시와 연구 유형을 모두 입력해 주세요.'
      return
    }

    const cityCandidates = await searchCities(plannerCityQuery.value.trim())
    const cityConfig = cityCandidates[0]

    if (!cityConfig) {
      validationMessage.value = '검색 결과가 있는 도시를 입력해 주세요.'
      return
    }

    // API 실패 시 예외를 View까지 전달해 공통 API 오류 페이지로 이동하도록 함
    const city = await fetchLiveWeather(cityConfig)
    plannerWeatherList.value = [city]
    analyzedCity.value = city

    // OpenWeather의 weatherMain과 한글 날씨 상태를 함께 확인해 비 여부를 판단함
    const isRainy = city.weatherMain === 'Rain' || city.status.includes('비')

    // European AQI가 60을 초과하면 생체 데이터 측정 시 주의가 필요한 환경으로 판단함
    const airQualityNeedsAttention = city.airQuality?.index > 60

    // 환경 시료 수집은 강수 여부를 우선 확인하고 다음으로 모드별 습도 기준을 적용함
    if (selectedPlan.value === 'sample') {
      if (isRainy) {
        analysisLevel.value = '비권장'
        analysisMessage.value = '비가 오고 있어 강수에 의해 시료 상태가 영향을 받을 수 있습니다.'
      } else if (city.humidity >= humidityThreshold.value) {
        analysisLevel.value = '주의'
        analysisMessage.value = '습도가 높아 시료 수집 및 보관 환경에 주의가 필요합니다.'
      } else {
        analysisLevel.value = '적합'
        analysisMessage.value = '현재 환경에서는 야외 시료 수집을 진행하기에 비교적 적합합니다.'
      }
      // 생체 데이터 측정은 공기질 영향을 우선 확인하고 다음으로 습도 기준을 적용함
    } else if (selectedPlan.value === 'biosignal') {
      if (city.dust === '나쁨' || airQualityNeedsAttention) {
        analysisLevel.value = '주의 필요'
        analysisMessage.value =
          '대기 환경 상태가 좋지 않아 생체 데이터 측정 시 환경 영향을 고려해야 합니다.'
      } else if (city.humidity >= humidityThreshold.value) {
        analysisLevel.value = '주의'
        analysisMessage.value =
          '습도가 높아 생체신호 측정 시 환경 조건을 함께 기록하는 것을 권장합니다.'
      } else {
        analysisLevel.value = '적합'
        analysisMessage.value = '현재 환경에서는 생체 데이터 측정을 진행하기에 비교적 안정적입니다.'
      }
      // 일반 데이터 수집은 비와 높은 습도가 함께 나타날 때 주의를 표시함
    } else if (isRainy && city.humidity >= humidityThreshold.value) {
      analysisLevel.value = '주의'
      analysisMessage.value =
        '비와 높은 습도가 함께 나타나고 있으므로 환경 정보를 함께 기록하는 것을 권장합니다.'
    } else {
      analysisLevel.value = '진행 가능'
      analysisMessage.value = '현재 환경에서는 일반적인 데이터 수집을 진행할 수 있습니다.'
    }

    showAnalysis.value = true
  }

  return {
    plannerCityQuery,
    selectedPlan,
    analysisLevel,
    analysisMessage,
    validationMessage,
    showAnalysis,
    analysisMode,
    plannerWeatherList,
    selectedPlannerCity,
    analyzedCity,
    availableCityNames,
    humidityThreshold,
    modeLabel,
    updatePlannerCityQuery,
    updateSelectedPlan,
    toggleAnalysisMode,
    analyzeResearch,
  }
})
