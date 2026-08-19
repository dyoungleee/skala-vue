<script setup>
import { ref } from 'vue'

const name = ref('')
const submittedName = ref('')
const age = ref('')
const submittedAge = ref('')

function submitForm() {
  submittedName.value = name.value
  submittedAge.value = age.value
}
</script>

<template>
  <h2>Form 예제</h2>
  <form @submit.prevent="submitForm">
    <input v-model="name" type="text" placeholder="이름 입력" />
    <input v-model="age" type="number" placeholder="나이 입력" />

    <button type="submit">제출</button>
  </form>

  <p v-if="submittedName">입력한 이름: {{ submittedName }}</p>
  <p v-if="submittedAge">입력한 나이: {{ submittedAge }}</p>
</template>
