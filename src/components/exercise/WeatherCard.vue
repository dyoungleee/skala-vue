<script setup>
import { computed } from 'vue'

import { useConfigStore } from '../../stores/configStore.js'

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
  // 선택된 카드에만 습도 상태 배지를 표시하기 위해 도시 ID를 전달받음
  selectedCityId: {
    type: String,
    default: null,
  },
})

const configStore = useConfigStore()

const emit = defineEmits(['select-card', 'click-detail'])

const displayTemp = computed(() => {
  const rawTemp = props.weather.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const selectCard = () => {
  emit('select-card', props.weather)
}

const clickDetail = () => {
  emit('click-detail', props.weather)
}
</script>

<template>
  <el-card
    class="weather-card"
    :class="{ selected: selectedCityId === weather.id }"
    shadow="hover"
    @click="selectCard"
  >
    <div class="card-topline">
      <div>
        <h3 class="city-name">{{ weather.name }}</h3>
      </div>
      <span class="weather-status">{{ weather.status }}</span>
    </div>

    <p class="temperature">
      {{ displayTemp }}<span>{{ configStore.unitSymbol }}</span>
    </p>

    <!-- 기본 기온 정보에 습도와 미세먼지 정보를 추가함 -->
    <div class="weather-details">
      <p>
        <span>습도</span>
        <strong>{{ weather.humidity }}%</strong>
      </p>
      <p>
        <span>미세먼지</span>
        <strong :class="{ 'dust-bad': weather.dust === '나쁨' }">{{ weather.dust }}</strong>
      </p>
    </div>

    <div class="card-actions">
      <el-button
        type="primary"
        link
        class="btn-detail"
        native-type="button"
        @click.stop="clickDetail"
      >
        상세보기
        <svg viewBox="0 0 20 20">
          <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
        </svg>
      </el-button>

      <!-- 선택된 카드에만 습도 기준에 따른 3단계 상태 배지를 표시함 -->
      <div v-if="selectedCityId === weather.id" class="temp-status">
        <el-tag v-if="weather.humidity >= 75" class="badge humid" effect="light" round>
          💧 습함
        </el-tag>

        <el-tag
          v-else-if="weather.humidity >= 60"
          type="warning"
          class="badge slightly-humid"
          effect="light"
          round
        >
          🙂 약간 습함
        </el-tag>

        <el-tag v-else type="success" class="badge pleasant" effect="light" round> 🌿 쾌적 </el-tag>
      </div>
    </div>
  </el-card>
</template>
