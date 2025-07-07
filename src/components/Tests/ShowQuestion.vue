<script setup>
import {useTestStore} from "../../store/TestStore.js";
import {useQuestionStore} from "../../store/QuestionStore.js";
import QuestionInfo from "../Subject/QuestionInfo/QuestionInfo.vue";
import Question from "../Subject/QuestionInfo/Question.vue";
import {onUnmounted} from "vue";

const TestStore = useTestStore()
const QuestionStore = useQuestionStore()
onUnmounted(() => {
  QuestionStore.currentQuestion = {}
})
const close = () => {
  QuestionStore.currentQuestion={}
  TestStore.setShowIsOpened()
}
</script>

<template>
  <el-dialog title="Просмотр вопроса" center width="90%" class="min-h-[90%]" top="50px" v-model="TestStore.showIsOpened" :before-close="close">
    <div class="flex grow justify-between gap-2" v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0">
      <QuestionInfo :question="QuestionStore.currentQuestion"/>
      <Question :question="QuestionStore.currentQuestion"/>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>