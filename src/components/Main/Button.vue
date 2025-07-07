<script setup>
const props = defineProps({
  title: String,
})
</script>

<template>
  <el-button type="primary">{{props.title}}</el-button>
</template>

<style scoped>

</style>