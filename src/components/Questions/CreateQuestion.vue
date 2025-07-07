<script setup>
import {useQuestionStore} from "../../store/QuestionStore.js";
import NewQuestion from "../../views/NewQuestion.vue";

const QuestionStore = useQuestionStore()

</script>

<template>
  <el-dialog title="Добавить новый вопрос" center width="90%" class="h-[90%]" top="50px" v-model="QuestionStore.isCreateQuestionOpened">
    <NewQuestion/>
  </el-dialog>
</template>

<style scoped>

</style>