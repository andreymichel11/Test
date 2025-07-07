<script setup>
import Chart from "./Chart.vue";

const props = defineProps({
  label: Array,
  count: Array,
  title:String
})
</script>

<template>
<div class="big-card  w-full h-full rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4">
  <h2 class="text-left text-sm font-normal text-(--color-main-text)">{{props.title}}</h2>
  <Chart :count="props.count" :label="props.label"  v-if="props.count.length > 0" class="text-center w-[100%] h-[95%]" />
  <el-empty v-else/>
</div>
</template>

<style scoped>

</style>