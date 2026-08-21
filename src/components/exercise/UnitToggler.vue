<script setup>
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-current">
      날씨 단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}
      <strong>{{ configStore.unitSymbol }}</strong>
    </span>
    <el-button
      type="primary"
      class="unit-toggle-button"
      native-type="button"
      @click="configStore.toggleUnit"
    >
      단위변경
    </el-button>
  </div>
</template>
