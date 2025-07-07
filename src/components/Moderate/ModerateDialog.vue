<script setup>
import {useModerateStore} from "../../store/ModerateStore.js";
import ModerateComponent from "./ModerateComponent.vue";

const ModerateStore = useModerateStore()
</script>

<template>
  <el-dialog title="Добавить новый вопрос" center width="90%" class="h-[90%] !p-10" top="50px" v-model="ModerateStore.isModerateOpened">
    <ModerateComponent/>
  </el-dialog>
</template>

<style scoped>

</style>