<template>
  <main class="app-container page-container">
    <el-result
      class="empty-state"
      icon="error"
      title="페이지를 찾을 수 없습니다."
      sub-title="요청하신 주소가 존재하지 않거나 이동되었을 수 있습니다."
    >
      <template #extra>
        <RouterLink class="primary-link" to="/">날씨 대시보드로 이동</RouterLink>
      </template>
    </el-result>
  </main>
</template>
