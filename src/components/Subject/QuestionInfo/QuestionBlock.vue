<script setup>

import Question from "./Question.vue";
import QuestionInfo from "./QuestionInfo.vue";
import {useQuestionStore} from "../../../store/QuestionStore.js";
const QuestionStore = useQuestionStore()
</script>

<template>
  <div class="flex grow justify-between gap-2" v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0">
    <QuestionInfo :question="QuestionStore.currentQuestion"/>
    <Question :question="QuestionStore.currentQuestion"/>
  </div>
</template>

<style scoped>

</style>