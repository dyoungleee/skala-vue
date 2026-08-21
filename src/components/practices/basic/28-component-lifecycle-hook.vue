<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null // 실시간 타이머 메모리 주소를 담을 변수

// Creation 단계 = <script setup> 본문 그 자체
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')

// Mounting 단계
onMounted(() => {
  console.log('2. [onMounted] 화면에 완전히 부착되었습니다! (API 호출/DOM 조작 적기)')
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// Updating 단계 - count 변수가 바뀌어서 화면이 리렌더링(새로고침)될 때마다 매번 실행
onUpdated(() => {
  console.log(
    `3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`,
  )
})

// Unmounting 단계 - v-if="false" 등으로 이 컴포넌트가 화면에서 완전히 파괴되어 사라질 때 실행
onUnmounted(() => {
  // 주의 : 여기서 타이머를 안 꺼주면 컴포넌트가 사라져로 백그라운드에서 영원히 타이머가 돎 (메모리 누수)
  clearInterval(timerId)
  console.log('4. [onMounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>
