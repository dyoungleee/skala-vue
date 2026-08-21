import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      // 연구 환경 분석을 별도 View로 구성해 Bio Data Planner 경로에 연결함
      path: '/bio-planner',
      name: 'BioDataPlanner',
      component: () => import('../views/BioDataPlannerView.vue'),
    },
    {
      // 실시간 API 호출 실패 시 공통 오류 화면으로 이동하도록 별도 경로를 구성함
      path: '/api-error',
      name: 'ApiError',
      component: () => import('../views/ApiErrorView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
