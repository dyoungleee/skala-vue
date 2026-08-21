## Day 1 - Weather Mockup Customization

기본 Weather Mockup을 기반으로 날씨 데이터를 확장하고, 사용자 선택에 따른 상태 표시 및 외출 가이드 기능을 추가하였다.
추가로 개인 관심 분야인 바이오 데이터 분석과 연결하여, 날씨 데이터를 기반으로 연구 환경을 간단히 판단하는 Bio Data Planner Mockup을 구현하였다.

### 1. 날씨 데이터 확장

기존 날씨 데이터에 다음 정보를 추가하였다.

- 습도(`humidity`)
- 미세먼지 상태(`dust`)
- 기존 서울, 수원, 부산 데이터 외에 광주 지역 데이터 추가

각 기능의 조건 분기를 확인할 수 있도록 도시별 날씨 조건도 다르게 구성하였다.

- 서울 → 미세먼지 나쁨
- 수원 → 비 + 높은 습도
- 부산 → 높은 습도
- 광주 → 비교적 안정적인 날씨 조건

이를 통해 외출 가이드와 연구 환경 분석에서 다양한 결과를 확인할 수 있도록 하였다.

### 2. 카드 선택 시 습도 상태 표시

기존 기온 기준의 상태 배지를 습도 상태를 나타내는 배지로 변경하였다.

지역 카드를 클릭하면 해당 도시를 선택 상태로 저장하고,
선택된 카드의 오른쪽 아래에 습도에 따른 상태가 표시되도록 수정하였다.

- 습도 75% 이상 → `💧 습함`
- 습도 60% 이상 75% 미만 → `🙂 약간 습함`
- 습도 60% 미만 → `🌿 쾌적`

`v-if`, `v-else-if`, `v-else`를 사용하여 습도 값에 따라 다른 상태가 출력되도록 구현하였다.

또한 모든 카드에 배지가 항상 표시되는 방식이 아니라, 카드를 선택했을 때 해당 카드에만 습도 상태 배지가 나타나도록 변경하였다.

### 3. 외출 가이드 기능 추가

기존 상세보기 기능을 `외출 가이드`로 변경하고, 현재 날씨 상태에 따라 추천 활동을 안내하도록 확장하였다.

추천 기준은 다음과 같다.

- 미세먼지가 나쁜 경우 → 실내 활동 추천
- 비가 오는 경우 → 외출 시 우산 준비 안내
- 습도가 높은 경우 → 가벼운 실내 활동 추천
- 그 외 → 산책 추천

`@click.stop`을 사용하여 외출 가이드 버튼을 클릭했을 때 카드의 클릭 이벤트가 함께 실행되지 않도록 처리하였다.

### 4. Bio Data Planner Mockup 추가

날씨 데이터를 활용하여 연구 환경을 간단히 확인할 수 있는 Bio Data Planner 영역을 추가하였다.

사용자는 분석할 도시를 입력하고 다음 연구 유형 중 하나를 선택할 수 있다.

- 환경 시료 수집
- 생체 데이터 측정
- 일반 데이터 수집

일반 도시 검색과 연구 환경 분석용 도시 입력값은 서로 분리하여,
동일한 `weatherList` 데이터를 사용하면서도 각각 독립적으로 동작하도록 구성하였다.

### 5. 연구 유형별 환경 분석

`연구 환경 분석` 버튼을 클릭하면 입력한 도시의 날씨 데이터를 찾아 선택한 연구 유형에 따라 서로 다른 기준으로 환경 상태를 판단하도록 구현하였다.

- 환경 시료 수집 → 비, 습도 중심으로 판단
- 생체 데이터 측정 → 미세먼지, 습도 중심으로 판단
- 일반 데이터 수집 → 전체적인 환경 상태를 기준으로 판단

같은 도시라도 선택한 연구 유형에 따라 `적합`, `주의`, `비권장` 등 서로 다른 결과가 나타나도록 구성하였다.

또한 분석 실행 전에 도시와 연구 유형의 입력 여부를 확인하고, 등록되지 않은 도시를 입력한 경우에는 카드 내부 검증 메시지로 안내하도록 처리하였다.

### 6. UI 개선

기본 Mockup 구조를 유지하면서 화면을 일부 수정하였다.

- 도시 카드를 Grid 형태로 구성
- 선택된 도시 카드의 상태를 시각적으로 구분
- 외출 가이드 버튼 디자인 수정
- Bio Data Planner 영역 및 분석 결과 영역 추가

## Weather Router

Vue Router 실습 요구사항에 맞춰 기존 단일 화면을 URL별 View로 분리하였다.

- `/` → `WeatherHomeView`: 도시 검색 및 날씨 카드 목록
- `/weather/:cityId` → `WeatherDetailView`: 도시 ID로 Mock Data를 선택하는 상세 관측 페이지
- `/about` → `WeatherAboutView`: 서비스 소개 및 메인 화면 복귀
- `/bio-planner` → `BioDataPlannerView`: 개인 실습인 연구 환경 분석 페이지
- 정의되지 않은 주소 → `NotFoundView`: Catch-all Route 안내

모든 View에는 동적 import를 사용해 지연 로딩을 적용하였다. `App.vue`의 내비게이션은
`RouterLink`로 구성하고, 현재 경로에 맞는 페이지는 `RouterView`에 표시한다. 날씨 카드의
`상세보기` 버튼은 `useRouter()`의 `router.push()`로 도시별 동적 경로에 이동하며,
상세 페이지는 `useRoute()`로 `cityId`를 읽어 마운트 시점에 해당 도시 정보를 선택한다.

## Weather Store

Pinia 기본 과제 요구사항에 따라 날씨 단위 설정을 전역 Store로 관리한다.

- `configStore` state `unit`: 초기값 `celsius`
- `configStore` getter `unitSymbol`: 현재 단위에 맞는 `℃` 또는 `℉`
- `configStore` action `toggleUnit`: 섭씨와 화씨 전환
- `UnitToggler`: Navigation Bar 옆에서 현재 단위 표시 및 변경
- `WeatherCard`, `WeatherDetailView`: 섭씨 원본 데이터를 화씨로 계산하여 표시

개인 Pinia 실습으로 `plannerStore`를 추가하였다. Bio Data Planner의 도시·연구 유형 입력과
분석 결과는 state, 선택 도시와 분석 가능 도시 목록은 getters, 입력 변경과 연구 환경 분석은
actions로 관리한다. View에서 state와 getters를 구조 분해할 때는 `storeToRefs()`를 사용해
반응성을 유지한다.

## Weather Axios

Axios를 사용해 기존 기본 데이터를 실제 API 데이터로 교체하고, 요청 실패 시에는 기본 데이터가
계속 표시되도록 구성하였다.

- OpenWeather Current Weather API: 네 도시의 현재 기온, 날씨, 습도, 바람 적용
- OpenWeather Air Pollution API: AQI, PM10, PM2.5를 조회해 미세먼지 상태 적용
- Open-Meteo Air Quality API: 현재 자외선 지수와 위험 단계 제공
- `async/await`, `try/catch/finally`, `axios.get()`, `axios.create()`, `axios.all()` 활용

OpenWeather API 키는 소스 코드에 직접 작성하지 않고 `.env.local`의
`VITE_OPENWEATHER_API_KEY`로 관리한다. 저장소에는 실제 키 대신 `.env.example`만 포함한다.
