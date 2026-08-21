<script setup>
import axios from 'axios'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { fetchLiveWeather, searchCities } from '../api/weatherApi.js'
import { weatherData } from '../data/weather'

const router = useRouter()

// API 응답이 도착한 데이터만 화면에 표시하고 Mock Data는 대체 화면으로 사용하지 않음
const weatherList = ref([])
const searchQuery = ref('')
const selectedCityId = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const isLoading = ref(false)
let searchTimer = null
let searchRequestId = 0

const loadLiveWeather = async () => {
  isLoading.value = true

  try {
    weatherList.value = await axios.all(weatherData.map((city) => fetchLiveWeather(city)))
  } catch (error) {
    console.error('날씨 API 요청 실패:', error.response?.status || error.message)
    router.push('/api-error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadLiveWeather)

watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch 감지] 상태바 변경: ${oldValue} -> ${newValue}`)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: ${searchQuery.value}`)
})

const filteredWeatherList = computed(() => {
  if (searchQuery.value === '') {
    return weatherList.value
  }

  // Geocoding API가 '전주'를 '전주시' 또는 영문명으로 반환해도 검색 결과를 그대로 표시한다.
  return weatherList.value
})

// 선택된 도시의 최신 날씨 객체를 ID 기준으로 찾아 상태바에 연결함
const selectedCity = computed(() =>
  weatherList.value.find((item) => item.id === selectedCityId.value),
)

// 미세먼지가 나쁘거나 UV Index가 6 이상이면 외출 주의 상태로 판단함
const needsOutdoorCaution = computed(() => {
  if (!selectedCity.value) return false

  return selectedCity.value.dust === '나쁨' || selectedCity.value.uv?.index >= 6
})

// [개인 커스텀] 검색어를 Geocoding API로 보내 등록 목록 밖의 도시도 실시간 목록으로 만든다.
const updateSearchQuery = (newValue) => {
  searchQuery.value = newValue
  selectedCityId.value = null
  weatherList.value = []
  searchRequestId += 1
  clearTimeout(searchTimer)

  const query = newValue.trim()

  if (!query) {
    loadLiveWeather()
    return
  }

  if (query.length < 2) return

  const currentRequestId = searchRequestId
  searchTimer = setTimeout(async () => {
    isLoading.value = true

    try {
      const cityConfigs = await searchCities(query)

      if (currentRequestId !== searchRequestId) return
      if (cityConfigs.length === 0) return

      weatherList.value = await axios.all(cityConfigs.map((city) => fetchLiveWeather(city)))
    } catch (error) {
      if (currentRequestId === searchRequestId) {
        console.error('도시 검색 API 요청 실패:', error.response?.status || error.message)
        router.push('/api-error')
      }
    } finally {
      if (currentRequestId === searchRequestId) isLoading.value = false
    }
  }, 500)
}

// 카드 선택 시 선택된 도시 ID와 상태바에 표시할 도시 이름을 함께 변경함
const selectCity = (item) => {
  selectedCityId.value = item.id
  selectedCityInfo.value = `${item.name}`
}

const showDetail = (city) => {
  router.push({
    path: `/weather/${city.id}`,
    query: {
      name: city.name,
      state: city.state || '',
      country: city.country || '',
      lat: city.lat,
      lon: city.lon,
    },
  })
}
</script>

<template>
  <main class="app-container">
    <!-- [개인 커스텀 디자인] 교수님 기본 제목을 서비스형 Hero 문구로 재구성했다. -->
    <section class="hero">
      <h1>오늘의 날씨를,<br /><span>한눈에.</span></h1>
      <p class="hero-copy">
        도시별 기온과 습도, 미세먼지 정보를<br class="mobile-break" />
        가장 간결한 방식으로 확인하세요.
      </p>
    </section>

    <div class="dashboard-wrapper">
      <BaseDashboardCard id="city-search" variant="search-box">
        <SearchBar :search-query="searchQuery" @update-search="updateSearchQuery" />
      </BaseDashboardCard>

      <BaseDashboardCard variant="list-box">
        <div class="list-heading">
          <div>
            <h2>지역별 날씨 현황</h2>
          </div>
          <a class="city-count city-count-link" href="#city-search">
            {{ filteredWeatherList.length }}개 도시 · 더 검색하기
          </a>
        </div>

        <div class="weather-grid">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :weather="item"
            :selected-city-id="selectedCityId"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>

        <p v-if="isLoading" class="weather-loading">실시간 도시 정보를 불러오는 중입니다.</p>

        <el-empty
          v-if="!isLoading && searchQuery && filteredWeatherList.length === 0"
          class="no-result"
          description="검색 결과와 일치하는 도시가 없습니다."
          :image-size="72"
        />

        <p class="data-attribution">
          날씨·미세먼지 데이터: OpenWeather · 자외선 데이터:
          <el-link type="primary" href="https://open-meteo.com/" target="_blank" underline="always">
            Open-Meteo
          </el-link>
          / CAMS ENSEMBLE
        </p>
      </BaseDashboardCard>

      <el-alert class="status-bar" type="info" :closable="false" show-icon>
        <template #title>
          <!-- [개인 커스텀] 기본 선택 문구를 도시·미세먼지·UV·외출 주의 요약으로 확장했다. -->
          <span v-if="selectedCity">
            {{ selectedCityInfo }} · 미세먼지 {{ selectedCity.dust }} · 자외선 지수
            {{ selectedCity.uv?.index ?? '정보 없음'
            }}<template v-if="needsOutdoorCaution"> · ⚠ 외출 주의</template>
          </span>
          <span v-else>{{ selectedCityInfo }}</span>
        </template>
      </el-alert>
    </div>
  </main>
</template>
