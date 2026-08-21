<template>
  <main class="app-container page-container">
    <el-result
      class="empty-state api-error-page"
      icon="error"
      title="실시간 날씨 정보를 가져오지 못했습니다."
      sub-title="잠시 후 다시 시도하거나 API 설정을 확인해 주세요."
    >
      <template #extra>
        <RouterLink class="primary-link" to="/">날씨 대시보드로 돌아가기</RouterLink>
      </template>
    </el-result>
  </main>
</template>
