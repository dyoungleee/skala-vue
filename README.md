# skala-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Day 1 - Weather Mockup Customization

기본 Weather Mockup 실습에서 제공된 도시명, 기온, 날씨 상태 외에 개인 데이터를 추가하고 화면 및 이벤트 동작을 일부 확장하였다.

### 1. 날씨 데이터 확장

기존 날씨 데이터에 다음 정보를 추가하였다.

- 습도(`humidity`)
- 미세먼지 상태(`dust`)
- 기존 서울, 수원, 부산 데이터 외에 광주 지역 데이터 추가

### 2. 카드 선택 시 습도 상태 표시

지역 카드를 클릭하면 해당 도시를 선택 상태로 저장하고,
선택된 카드 오른쪽 아래에 습도에 따른 상태가 표시되도록 수정하였다.

- 습도 75% 이상 → `💧 습함`
- 습도 60% 이상 75% 미만 → `🙂 약간 습함`
- 습도 60% 미만 → `🌿 쾌적`

`v-if`, `v-else-if`, `v-else`를 사용하여 습도 값에 따라 다른 상태가 출력되도록 구현하였다.

### 3. 외출 가이드 기능 추가

기존 상세보기 기능을 `외출 가이드`로 변경하고, 현재 날씨 상태에 따라 추천 활동을 안내하도록 확장하였다.

추천 기준은 다음과 같다.

- 미세먼지가 나쁜 경우 → 실내 활동 추천
- 비가 오는 경우 → 우산 준비 및 실내 활동 추천
- 습도가 높은 경우 → 가벼운 실내 활동 추천
- 그 외 → 산책 추천

`@click.stop`을 사용하여 외출 가이드 버튼을 클릭했을 때 카드의 클릭 이벤트가 함께 실행되지 않도록 처리하였다.

### 4. 화면 UI 일부 수정

날씨 정보를 조금 더 쉽게 확인할 수 있도록 화면 스타일을 일부 변경하였다.

- 도시명 글자 크기 및 굵기 증가
- 기존 배지 부분을 습도 상태로 표시
- 카드 선택 시, 선택된 카드의 습도 상태를 카드 오른쪽 아래에 배치
- 카드 선택 후, 상태바 문구 변경 (`'도시'를 선택하였습니다.` → `선택한 도시: '도시'`)

## Day 2
