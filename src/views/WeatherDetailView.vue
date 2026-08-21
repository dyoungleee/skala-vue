<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { fetchLiveWeather } from '../api/weatherApi.js'
import { weatherData } from '../data/weather'
import { useConfigStore } from '../stores/configStore.js'

const route = useRoute()
const router = useRouter()

const configStore = useConfigStore()
const city = ref(null)
const isLoading = ref(false)

onMounted(async () => {
  const targetCity = weatherData.find((item) => item.id === route.params.cityId)

  if (!targetCity) return

  isLoading.value = true

  try {
    city.value = await fetchLiveWeather(targetCity)
  } catch (error) {
    console.error('날씨 상세 API 요청 실패:', error.response?.status || error.message)
    router.push('/api-error')
  } finally {
    isLoading.value = false
  }
})

// [개인 커스텀] 미세먼지, 강수, 자외선, 습도 조건을 순서대로 확인해 외출 가이드를 생성한다.
const activityGuide = computed(() => {
  if (!city.value) return ''
  if (city.value.dust === '나쁨') return '미세먼지가 많으니 실내 활동을 추천합니다.'
  if (city.value.weatherMain === 'Rain' || city.value.status.includes('비')) {
    return '비가 오니 외출 시 우산을 챙기세요.'
  }
  if (city.value.uv?.index >= 6) {
    return '자외선 지수가 높으니 장시간 야외 활동을 줄이고 자외선 차단제를 준비하세요.'
  }
  if (city.value.humidity >= 75) return '습도가 높으니 가벼운 실내 활동을 추천합니다.'
  if (city.value.uv?.index >= 3) {
    return '야외 활동이 가능하지만 자외선 차단제를 준비하는 것이 좋습니다.'
  }
  return '날씨가 안정적이므로 가벼운 산책을 추천합니다.'
})

// [개인 커스텀 디자인] 같은 판단 기준을 아이콘으로도 보여줘 안내 내용을 빠르게 구분한다.
const activityGuideIcon = computed(() => {
  if (!city.value) return '🏠'
  if (city.value.dust === '나쁨') return '😷'
  if (city.value.weatherMain === 'Rain' || city.value.status.includes('비')) return '☔'
  if (city.value.uv?.index >= 6) return '☀️'
  if (city.value.humidity >= 75) return '🏠'
  return '🚶'
})

const convertTemperature = (rawTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}

const displayTemp = computed(() => (city.value ? convertTemperature(city.value.temp) : ''))

// [개인 커스텀] 대기질 값이 없는 경우 화면에 '데이터 없음'을 표시한다.
const formatAirQualityValue = (value) => {
  return value === null || value === undefined ? '데이터 없음' : `${value} μg/m³`
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <main class="app-container page-container">
    <section v-if="city" class="detail-layout">
      <div class="detail-heading">
        <RouterLink class="back-link" to="/">← 날씨 대시보드</RouterLink>
        <p class="section-kicker">OBSERVATION DETAIL</p>
        <h1>{{ city.name }}의 날씨</h1>
      </div>

      <el-card class="detail-card" shadow="never">
        <el-alert
          v-if="isLoading"
          class="api-status api-loading"
          title="실시간 날씨와 환경 정보를 불러오는 중입니다."
          type="info"
          :closable="false"
          show-icon
        />
        <div class="detail-summary">
          <div>
            <p class="detail-status">{{ city.status }}</p>
            <p class="detail-temperature">
              {{ displayTemp }}<span>{{ configStore.unitSymbol }}</span>
            </p>
          </div>
          <!-- 메인 날씨 카드와 동일한 3단계 습도 상태를 상세 화면에도 표시함 -->
          <div class="detail-humidity-badge">
            <el-tag v-if="city.humidity >= 75" class="badge humid" effect="light" round>
              💧 습함
            </el-tag>
            <el-tag
              v-else-if="city.humidity >= 60"
              type="warning"
              class="badge slightly-humid"
              effect="light"
              round
            >
              🙂 약간 습함
            </el-tag>
            <el-tag v-else type="success" class="badge pleasant" effect="light" round>
              🌿 쾌적
            </el-tag>
          </div>
        </div>

        <!-- 기본 날씨 정보에 미세먼지와 자외선 정보를 함께 표시함 -->
        <dl class="detail-metrics">
          <div>
            <dt>습도</dt>
            <dd>{{ city.humidity }}%</dd>
          </div>
          <div>
            <dt>미세먼지</dt>
            <dd>
              <strong :class="{ 'dust-bad': city.dust === '나쁨' }">{{ city.dust }}</strong>
              <small v-if="city.airQuality">
                European AQI {{ city.airQuality.index ?? '데이터 없음' }}
              </small>
            </dd>
          </div>
          <div>
            <dt>바람</dt>
            <dd>{{ city.wind }}</dd>
          </div>
          <div>
            <dt>자외선</dt>
            <dd>
              {{ city.uv ? city.uv.status : '정보 없음' }}
              <small v-if="city.uv">UV Index {{ city.uv.index }}</small>
            </dd>
          </div>
        </dl>

        <!-- European AQI와 각 오염물질 수치를 상세 대기 환경 정보로 표시함 -->
        <section class="air-quality-panel">
          <div class="air-quality-heading">
            <div>
              <h2>대기 환경</h2>
            </div>
            <strong>{{ city.airQuality?.status ?? '데이터 없음' }}</strong>
          </div>

          <dl class="air-quality-list">
            <div>
              <dt>European AQI</dt>
              <dd>{{ city.airQuality?.index ?? '데이터 없음' }}</dd>
            </div>
            <div>
              <dt>PM2.5</dt>
              <dd>{{ formatAirQualityValue(city.airQuality?.pm2_5) }}</dd>
            </div>
            <div>
              <dt>PM10</dt>
              <dd>{{ formatAirQualityValue(city.airQuality?.pm10) }}</dd>
            </div>
            <div>
              <dt>NO₂</dt>
              <dd>{{ formatAirQualityValue(city.airQuality?.no2) }}</dd>
            </div>
            <div>
              <dt>O₃</dt>
              <dd>{{ formatAirQualityValue(city.airQuality?.ozone) }}</dd>
            </div>
            <div>
              <dt>SO₂</dt>
              <dd>{{ formatAirQualityValue(city.airQuality?.so2) }}</dd>
            </div>
            <div>
              <dt>CO</dt>
              <dd>{{ formatAirQualityValue(city.airQuality?.co) }}</dd>
            </div>
          </dl>
        </section>

        <!-- [개인 커스텀] 현재 환경 조건에 따라 아이콘과 외출 안내를 함께 표시한다. -->
        <section class="guide-panel">
          <span class="guide-icon">{{ activityGuideIcon }}</span>
          <div class="guide-copy">
            <p class="guide-label">외출 안내</p>
            <h2>오늘의 외출 가이드</h2>
            <p class="guide-description">{{ activityGuide }}</p>
          </div>
        </section>

        <p class="data-attribution detail-attribution">
          날씨·기본 미세먼지 데이터: OpenWeather · 대기 환경·자외선 데이터:
          <el-link type="primary" href="https://open-meteo.com/" target="_blank" underline="always">
            Open-Meteo
          </el-link>
          / CAMS ENSEMBLE
        </p>
      </el-card>
    </section>

    <el-result
      v-else
      class="empty-state"
      icon="warning"
      title="도시 정보를 찾을 수 없습니다."
      sub-title="요청한 도시 코드가 기상 관측 목록에 없습니다."
    >
      <template #extra>
        <div class="empty-actions">
          <el-button class="secondary-button" native-type="button" @click="goBack">
            이전 페이지
          </el-button>
          <RouterLink class="primary-link" to="/">날씨 대시보드로 이동</RouterLink>
        </div>
      </template>
    </el-result>
  </main>
</template>
