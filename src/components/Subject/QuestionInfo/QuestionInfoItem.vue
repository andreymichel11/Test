<script setup>
const props = defineProps({
  title: String,
  value: String,
})
</script>

<template>
  <li>
    <div class="grid grid-cols-6 self-end">
      <p class="col-span-3 self-center">{{title}}</p>
      <p v-if="value!== undefined || value!== undefined" class="font-semibold text-sm col-start-4 col-end-7 break-word">{{value}}</p>
      <slot v-else></slot>
    </div>
    <el-divider/>
  </li>
</template>

<style scoped>

</style>