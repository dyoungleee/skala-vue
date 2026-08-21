<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-search'])

const updateSearch = (newValue) => {
  emit('update-search', newValue)
}
</script>

<template>
  <div class="search-bar-content">
    <div class="section-heading">
      <h2>도시 검색</h2>
      <p>궁금한 도시를 입력해 보세요.</p>
    </div>

    <div class="search-field">
      <el-input
        :model-value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        @input="updateSearch"
      >
        <template #prefix>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
        </template>
      </el-input>
    </div>

    <p class="search-status">
      <span class="status-dot"></span>
      검색 중인 도시:
      <strong>{{ searchQuery || '아직 입력하지 않았어요' }}</strong>
    </p>
  </div>
</template>

<style scoped>
/* [개인 커스텀 디자인] 검색 내용을 공통 카드 Grid에 직접 배치해 교수님 기본 세로형 검색창을 재구성했다. */
.search-bar-content {
  display: contents;
}
</style>
