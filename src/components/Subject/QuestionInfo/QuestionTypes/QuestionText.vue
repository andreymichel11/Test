<script setup>
const props = defineProps({
  question: Object
})
</script>

<template>
  <p class="mb-2"  v-if="question.answer!== null">Пример правильного ответа:</p>
  <div class="flex gap-2 flex-wrap  items-center">
    <el-tag type="success" effect="plain" size="large" v-if="question.answer!== null && question.answer.answer!== undefined"  class="!text-base">
      {{question.answer.answer[0].charAt(0).toUpperCase() + question.answer.answer[0].slice(1)}}
    </el-tag>
  </div>
</template>

<style scoped>

</style>