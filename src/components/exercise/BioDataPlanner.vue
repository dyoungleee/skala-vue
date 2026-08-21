<script setup>
const props = defineProps({
  plannerCityQuery: {
    type: String,
    default: '',
  },
  selectedPlan: {
    type: String,
    default: '',
  },
  showAnalysis: {
    type: Boolean,
    default: false,
  },
  analysisLevel: {
    type: String,
    default: '',
  },
  analysisMessage: {
    type: String,
    default: '',
  },
  validationMessage: {
    type: String,
    default: '',
  },
  analysisMode: {
    type: String,
    default: 'normal',
  },
  modeLabel: {
    type: String,
    default: '일반 분석',
  },
  humidityThreshold: {
    type: Number,
    default: 75,
  },
  selectedPlannerCity: {
    type: Object,
    default: null,
  },
  plannerDisplayTemp: {
    type: [Number, String],
    default: '데이터 없음',
  },
  unitSymbol: {
    type: String,
    default: '℃',
  },
})

const emit = defineEmits([
  'update-planner-city',
  'update-selected-plan',
  'update-analysis-mode',
  'analyze-research',
])

const updatePlannerCity = (newValue) => {
  emit('update-planner-city', newValue)
}

const updateSelectedPlan = (newValue) => {
  emit('update-selected-plan', newValue)
}

const requestAnalysis = () => {
  emit('analyze-research')
}

// 현재 선택된 분석 모드와 다른 값이 들어온 경우에만 부모 View로 변경 이벤트를 전달함
const updateAnalysisMode = (newMode) => {
  if (newMode !== props.analysisMode) {
    emit('update-analysis-mode', newMode)
  }
}

// Open-Meteo 값이 없는 경우 단위 대신 '데이터 없음'을 표시함
const formatAirQualityValue = (value) => {
  return value === null || value === undefined ? '데이터 없음' : `${value} μg/m³`
}
</script>

<template>
  <el-card class="plan-box" shadow="never">
    <div class="plan-heading">
      <h2>연구 환경 분석</h2>
      <p>어떤 연구를 진행할 계획인가요?</p>
    </div>

    <!-- 일반 분석과 보수적 분석의 습도 기준을 비교해 선택할 수 있도록 구성함 -->
    <div class="analysis-settings">
      <p class="settings-label">분석 설정</p>

      <el-radio-group
        class="analysis-mode-options"
        :model-value="analysisMode"
        @change="updateAnalysisMode"
      >
        <el-radio class="analysis-mode-option" value="normal">
          <span class="mode-option-copy">
            <strong>일반 분석</strong>
            <small>습도 75% 이상을 높은 습도로 판단합니다.</small>
          </span>
        </el-radio>
        <el-radio class="analysis-mode-option" value="strict">
          <span class="mode-option-copy">
            <strong>보수적 분석</strong>
            <small>습도 65% 이상부터 주의가 필요한 환경으로 판단합니다.</small>
          </span>
        </el-radio>
      </el-radio-group>
      <p class="settings-summary">
        현재 선택: <strong>{{ modeLabel }}</strong>
        <span>· 습도 판단 기준 {{ humidityThreshold }}% 이상</span>
      </p>
    </div>

    <div class="plan-controls">
      <label class="plan-control">
        <span class="control-label">도시 이름</span>
        <span class="search-field">
          <el-input
            :model-value="plannerCityQuery"
            placeholder="검색할 도시 이름 입력"
            @input="updatePlannerCity"
          >
            <template #prefix>
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </template>
          </el-input>
        </span>
      </label>

      <label class="plan-control">
        <span class="control-label">연구 유형</span>
        <span class="select-field">
          <el-select
            :model-value="selectedPlan"
            placeholder="연구 유형 선택"
            @change="updateSelectedPlan"
          >
            <el-option label="환경 시료 수집" value="sample" />
            <el-option label="생체 데이터 측정" value="biosignal" />
            <el-option label="일반 데이터 수집" value="general" />
          </el-select>
        </span>
      </label>

      <div class="plan-action">
        <el-button type="primary" class="btn-analyze" native-type="button" @click="requestAnalysis">
          연구 환경 분석
          <svg viewBox="0 0 20 20">
            <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
          </svg>
        </el-button>
      </div>

      <!-- 입력값이 누락되었거나 등록되지 않은 도시인 경우 검증 메시지를 표시함 -->
      <el-alert
        v-if="validationMessage"
        class="validation-message"
        :title="validationMessage"
        type="error"
        :closable="false"
        show-icon
      />

      <!-- 실제 분석에 사용된 기상 및 대기질 데이터를 분석 결과와 함께 표시함 -->
      <section v-if="showAnalysis && selectedPlannerCity" class="planner-environment-summary">
        <div class="planner-current-environment">
          <h3>현재 환경 정보</h3>
          <p>
            기온 <strong>{{ plannerDisplayTemp }}{{ unitSymbol }}</strong> · 습도
            <strong>{{ selectedPlannerCity.humidity }}%</strong>
          </p>
        </div>

        <div class="planner-air-quality">
          <h3>대기 환경</h3>
          <p class="air-quality-status">
            현재 대기 환경 상태:
            <strong>{{ selectedPlannerCity.airQuality?.status ?? '데이터 없음' }}</strong>
          </p>

          <dl class="air-quality-list">
            <div>
              <dt>PM2.5</dt>
              <dd>{{ formatAirQualityValue(selectedPlannerCity.airQuality?.pm2_5) }}</dd>
            </div>
            <div>
              <dt>PM10</dt>
              <dd>{{ formatAirQualityValue(selectedPlannerCity.airQuality?.pm10) }}</dd>
            </div>
            <div>
              <dt>NO₂</dt>
              <dd>{{ formatAirQualityValue(selectedPlannerCity.airQuality?.no2) }}</dd>
            </div>
            <div>
              <dt>O₃</dt>
              <dd>{{ formatAirQualityValue(selectedPlannerCity.airQuality?.ozone) }}</dd>
            </div>
            <div>
              <dt>SO₂</dt>
              <dd>{{ formatAirQualityValue(selectedPlannerCity.airQuality?.so2) }}</dd>
            </div>
            <div>
              <dt>CO</dt>
              <dd>{{ formatAirQualityValue(selectedPlannerCity.airQuality?.co) }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- 분석 등급에 따라 Element Plus Result의 상태와 색상을 다르게 표시함 -->
      <el-result
        v-if="showAnalysis"
        class="analysis-result"
        :class="{
          'result-danger': analysisLevel === '비권장' || analysisLevel === '주의 필요',
          'result-warning': analysisLevel === '주의',
          'result-success': analysisLevel === '적합' || analysisLevel === '진행 가능',
        }"
        :icon="
          analysisLevel === '적합' || analysisLevel === '진행 가능'
            ? 'success'
            : analysisLevel === '주의'
              ? 'warning'
              : 'error'
        "
        :title="analysisLevel"
        :sub-title="analysisMessage"
      />
    </div>
  </el-card>
</template>
