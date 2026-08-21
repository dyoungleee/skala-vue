import axios from 'axios'

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

// Open-Meteo Air Quality API에서 상세 오염물질과 자외선 지수를 추가로 조회함
const airQualityApi = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com/v1',
  timeout: 10000,
})

const hasOpenWeatherApiKey = Boolean(OPENWEATHER_API_KEY)

// OpenWeather의 영문 기상 그룹을 화면에 표시할 날씨 아이콘과 연결함
const weatherEmoji = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '☔️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Haze: '🌫️',
  Fog: '🌫️',
}

// API의 풍향 각도를 화면에서 읽기 쉬운 8방위 한글 이름으로 변환함
const getWindDirection = (degree = 0) => {
  const directions = ['북풍', '북동풍', '동풍', '남동풍', '남풍', '남서풍', '서풍', '북서풍']
  return directions[Math.round(degree / 45) % directions.length]
}

// OpenWeather AQI를 좋음·보통·나쁨 상태로 변환함
const getDustStatus = (airQualityIndex) => {
  if (airQualityIndex === 1) return '좋음'
  if (airQualityIndex <= 3) return '보통'
  return '나쁨'
}

// UV Index를 외출 가이드와 상태 표시에 사용할 3단계 문구로 변환함
const getUvStatus = (uvIndex) => {
  if (!Number.isFinite(uvIndex)) return '정보 없음'
  if (uvIndex < 3) return '낮음'
  if (uvIndex < 6) return '보통'
  return '높음'
}

// European AQI를 대기 환경 상태로 변환함
const getEuropeanAirQualityStatus = (aqi) => {
  if (!Number.isFinite(aqi)) return '데이터 없음'
  if (aqi <= 20) return '🟢 안정적'
  if (aqi <= 60) return '🟡 주의'
  return '🔴 좋지 않음'
}

// 상세 대기질 값은 소수 첫째 자리까지 통일하고 누락된 값은 null로 유지함
const roundAirQualityValue = (value) => {
  if (!Number.isFinite(value)) return null
  return Math.round(value * 10) / 10
}

const ensureApiKey = () => {
  if (!hasOpenWeatherApiKey) {
    throw new Error('OpenWeather API 키가 설정되지 않았습니다.')
  }
}

// 현재 날씨, OpenWeather 공기질, Open-Meteo 대기 환경 데이터를 함께 요청함
export const fetchLiveWeather = async (cityConfig) => {
  ensureApiKey()

  const [weatherResponse, airPollutionResponse, openMeteoAirResponse] = await axios.all([
    openWeatherApi.get('/weather', {
      params: {
        lat: cityConfig.lat,
        lon: cityConfig.lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    }),
    openWeatherApi.get('/air_pollution', {
      params: {
        lat: cityConfig.lat,
        lon: cityConfig.lon,
        appid: OPENWEATHER_API_KEY,
      },
    }),
    airQualityApi.get('/air-quality', {
      params: {
        latitude: cityConfig.lat,
        longitude: cityConfig.lon,
        current:
          'european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide,uv_index',
        timezone: 'Asia/Seoul',
      },
    }),
  ])

  const weather = weatherResponse.data
  const openWeatherAirQuality = airPollutionResponse.data.list[0]
  const openMeteoAirQuality = openMeteoAirResponse.data.current || {}
  const europeanAqi = roundAirQualityValue(openMeteoAirQuality.european_aqi)
  const uvIndex = roundAirQualityValue(openMeteoAirQuality.uv_index)
  const currentCondition = weather.weather[0]

  return {
    ...cityConfig,
    temp: Math.round(weather.main.temp),
    status: `${currentCondition.description}${weatherEmoji[currentCondition.main] || '🌤️'}`,
    weatherMain: currentCondition.main,
    humidity: weather.main.humidity,
    dust: getDustStatus(openWeatherAirQuality.main.aqi),
    wind: `${getWindDirection(weather.wind.deg)} ${weather.wind.speed}m/s`,
    airQuality: {
      index: europeanAqi,
      status: getEuropeanAirQualityStatus(europeanAqi),
      pm10: roundAirQualityValue(openMeteoAirQuality.pm10),
      pm2_5: roundAirQualityValue(openMeteoAirQuality.pm2_5),
      no2: roundAirQualityValue(openMeteoAirQuality.nitrogen_dioxide),
      ozone: roundAirQualityValue(openMeteoAirQuality.ozone),
      so2: roundAirQualityValue(openMeteoAirQuality.sulphur_dioxide),
      co: roundAirQualityValue(openMeteoAirQuality.carbon_monoxide),
    },
    uv: {
      index: uvIndex,
      status: getUvStatus(uvIndex),
    },
  }
}
