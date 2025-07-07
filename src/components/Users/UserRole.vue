<script setup>
  import {computed} from "vue";

  const props = defineProps({
    type: String
  })
  const color = computed(() => {
    switch (props.type.toLowerCase()) {
      case "admin":
        return 'primary'
      case "moderator":
        return 'warning'
      default:
        return 'danger'
    }
  })
</script>

<template>
  <el-tag  effect="dark" :type=color>
  {{props.type[0].toUpperCase() + props.type.slice(1)}}
  </el-tag>
</template>

<style scoped>

</style>