<script setup>
import { ref } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음☀️', humidity: 59, dust: '나쁨' },
  { id: 'city_02', name: '수원', temp: 24, status: '비☔️', humidity: 80, dust: '좋음' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름☁️', humidity: 72, dust: '보통' },
  { id: 'city_04', name: '광주', temp: 23, status: '구름☁️', humidity: 90, dust: '보통' },
])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityId = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const selectCity = (item) => {
  selectedCityId.value = item.id
  selectedCityInfo.value = `선택한 도시: ${item.name}`
}

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status, humidity, dust) => {
  let activity

  if (dust === '나쁨') {
    activity = '미세먼지가 많으니 실내 활동을 추천합니다.'
  } else if (status === '비☔️') {
    activity = '비가 오니 외출 시엔 우산을 챙기세요.'
  } else if (humidity >= 75) {
    activity = '습도가 높으니 가벼운 실내 활동을 추천합니다.'
  } else {
    activity = '날씨가 괜찮으니 산책을 추천합니다.'
  }

  window.alert(
    `${cityName}의 현재 날씨는 [${status}], [습도 ${humidity}%], [미세먼지 ${dust}] 상태입니다.
→ 추천 활동: ${activity}`,
  )
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectCity(item)"
      >
        <h4>
          <span class="city-name">{{ item.name }}</span>
          ({{ item.status }})
        </h4>
        <p>기온: {{ item.temp }}°C</p>
        <p>습도: {{ item.humidity }}%</p>
        <p>미세먼지: {{ item.dust }}</p>

        <button
          class="btn-detail"
          @click.stop="showDetail(item.name, item.status, item.humidity, item.dust)"
        >
          외출 가이드
        </button>

        <div v-if="selectedCityId === item.id" class="temp-status">
          <span v-if="item.humidity >= 75" class="badge humid"> 💧 습함 </span>

          <span v-else-if="item.humidity >= 60" class="badge slightly-humid"> 🙂 약간 습함 </span>

          <span v-else class="badge pleasant"> 🌿 쾌적 </span>
        </div>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style>
.temp-status {
  position: absolute;
  right: 12px;
  bottom: 12px;
}

.city-name {
  font-size: 20px;
  font-weight: bold;
}
</style>
