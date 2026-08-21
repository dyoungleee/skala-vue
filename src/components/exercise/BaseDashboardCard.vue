<script setup>
defineProps({
  variant: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <el-card class="dashboard-card" :class="variant" shadow="never">
    <slot></slot>
  </el-card>
</template>
