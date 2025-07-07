<script setup>
import {onMounted, onUnmounted} from "vue";
import {useQuestionStore} from "../store/QuestionStore.js";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import Question from "../components/Subject/QuestionInfo/Question.vue";
import QuestionInfo from "../components/Subject/QuestionInfo/QuestionInfo.vue";
import ModerateComponent from "../components/Moderate/ModerateComponent.vue";

const QuestionStore = useQuestionStore()

const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question
}

onMounted( async () => {
  await QuestionStore.getQuestionsStatuses().then(() => {
    const status = QuestionStore.statuses.find(item => item.name.toLowerCase() === 'создан')
    QuestionStore.getQuestions(`?status_id=${status.id}`)
  })
})

onUnmounted(() => {
  QuestionStore.questions = []
  QuestionStore.currentQuestion = {}
})
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center ">
    <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start h-[30vh] min-h-[200px] overflow-scroll w-full relative">
      <SubjectQuestions  v-if="QuestionStore.questions.length>0" :questions="QuestionStore.questions" :set-questions="handleCurrentChange"/>
      <el-empty
          v-else
          class="!p-0"
          description="Вопросов на модерацию нет" />
    </div>
    <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start  min-h-[500px] overflow-scroll w-full relative">
      <ModerateComponent  v-if="QuestionStore.currentQuestion!== null && Object.keys(QuestionStore.currentQuestion).length>0"/>
      <el-empty v-else description="Для просмотра выберите вопрос из списка"/>
    </div>
  </div>
</template>

<style scoped>

</style>