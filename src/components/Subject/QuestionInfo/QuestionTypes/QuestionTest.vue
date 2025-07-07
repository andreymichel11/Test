<script setup>
const props = defineProps({
  question: Object
})
</script>

<template>
  <p class="mb-2">Варианты ответов:</p>
  <div class="flex gap-2 flex-wrap  items-center mb-4">
    <el-tag size="large" type="primary" effect="light" v-if="question.variants!== null && question.variants.variants!== undefined" v-for="variant in question.variants.variants" :key="variant"  class="p-2 bg-gray-100 dark:bg-neutral-700 inline-block rounded-md !text-base">
      {{variant[0].toUpperCase() + variant.slice(1)}}
    </el-tag>
  </div>
  <p class="mb-2" v-if="question.answer!== null">Правильный ответ:</p>

  <div class="flex gap-2 flex-wrap  items-center">
    <el-tag type="success" effect="plain" size="large" v-if="question.answer!== null && question.answer.answer!== undefined" v-for="variant in question.answer.answer" :key="variant"  class="!p-2 bg-gray-100 dark:bg-neutral-700 inline-block rounded-md !text-base">
      {{variant}}
    </el-tag>
  </div>
</template>

<style scoped>

</style>