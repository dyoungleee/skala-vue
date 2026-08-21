<template>
  <main class="app-container page-container">
    <el-card class="content-page" shadow="never">
      <div class="content-heading">
        <h1>필요한 날씨만<br />가볍고 빠르게.</h1>
        <p>
          Weather Router는 도시별 기온, 습도, 미세먼지를 한 화면에서 확인하고 상세 관측 페이지로
          자연스럽게 이동할 수 있는 Vue 실습 서비스입니다.
        </p>
      </div>

      <div class="feature-list">
        <el-card shadow="never">
          <span>01</span>
          <h2>도시 검색</h2>
          <p>도시 이름으로 원하는 날씨 카드를 빠르게 찾습니다.</p>
        </el-card>
        <el-card shadow="never">
          <span>02</span>
          <h2>상세 관측</h2>
          <p>동적 경로를 통해 각 도시의 상세 기상 정보를 확인합니다.</p>
        </el-card>
        <!-- [개인 커스텀] 교수님 소개 화면에 Bio Data Planner 기능 설명을 추가했다. -->
        <el-card shadow="never">
          <span>03</span>
          <h2>연구 환경 분석</h2>
          <p>Bio Data Planner에서 날씨와 연구 유형을 함께 분석합니다.</p>
        </el-card>
      </div>

      <RouterLink class="primary-link" to="/">메인 대시보드로 돌아가기</RouterLink>
    </el-card>
  </main>
</template>
