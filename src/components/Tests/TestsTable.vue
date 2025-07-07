<script setup>

const props = defineProps({
  tests: Array,
  setCurrentTest: Function
})
</script>

<template>
  <el-table :data="tests" size="large" @current-change="setCurrentTest">
    <el-table-column prop="name" label="Название"  />
    <el-table-column prop="description" label="Описание"/>
    <el-table-column prop="question_ids.length" label="Количество вопросов"  />
    <el-table-column prop="creator.user_name" label="Создал" />
    <el-table-column prop="created_at" label="Дата создания" sortable/>
  </el-table>
</template>

<style scoped>

</style>