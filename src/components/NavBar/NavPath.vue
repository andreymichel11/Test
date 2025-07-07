<script setup>

import {ArrowRight} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";
const route = useRoute()
</script>

<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="mt-10">
    <el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
    <el-breadcrumb-item>{{route.meta.alias}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>

</style>