<script setup>
const props = defineProps({
  question: Object
})
</script>

<template>
  <div class="flex justify-between  items-center gap-4 mb-4" v-if="question.variants!==null">
    <el-table :data="question.variants.variants[0].left" style="width: 44%" :scrollbar-always-on="false">
      <el-table-column  label="Левая колонка" >
        <template #default="scope">{{scope.row}}</template>
      </el-table-column>
    </el-table>
    <el-table :data="question.variants.variants[0].right" style="width: 44%" :scrollbar-always-on="false">
      <el-table-column  label="Правая колонка"  >
        <template #default="scope">{{scope.row}}</template>
      </el-table-column>
    </el-table>
  </div>
  <p class="mb-2">Правильный ответ:</p>
  <div class="flex gap-2 flex-wrap  items-center">
    <el-tag type="success" effect="plain" size="large" v-if="question.answer!== null && question.answer.answer!== undefined" v-for="variant in Object.keys(question.answer.answer[0])" :key="variant"  class="!p-2 bg-gray-100 dark:bg-neutral-700 inline-block rounded-md !text-base">
      {{`${variant} - ${question.answer.answer[0][variant]}`}}
    </el-tag>
  </div>
</template>

<style scoped>

</style>