<script setup>
import {useTestStore} from "../store/TestStore.js";
import {onMounted, onUnmounted} from "vue";
import {useUsersStore} from "../store/UsersStore.js";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import TestsTable from "../components/Tests/TestsTable.vue";
import {useQuestionStore} from "../store/QuestionStore.js";
import ShowQuestion from "../components/Tests/ShowQuestion.vue";

const TestStore = useTestStore()
const UsersStore = useUsersStore()
const QuestionStore = useQuestionStore()
onMounted(() => {
  TestStore.getTestsFunc(`?creator_user_id=${UsersStore.getUserId}`)
})

const setCurrentTest = (test) => {
  TestStore.setCurrentTest(test)
}


const handleOpenModal = (question) => {
  QuestionStore.currentQuestion = question
  if (Object.keys(QuestionStore.currentQuestion).length !== 0) {
    TestStore.setShowIsOpened()
  }
}
onUnmounted(() => {
  TestStore.questions = []
  QuestionStore.currentQuestion = {}
  TestStore.currentTest = {}
})
</script>

<template>

  <div class="h-full flex flex-col items-center justify-center ">
    <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start h-[35vh] min-h-[200px] overflow-scroll w-full relative">
      <TestsTable  v-if="TestStore.tests.length>0" :tests="TestStore.tests" :set-current-test="setCurrentTest"/>
      <el-empty
          v-else
          class="!p-0"
          description="Вы не создали ли одного теста" />
    </div>

    <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start  h-[45vh] overflow-scroll w-full relative">
      <SubjectQuestions  v-if="TestStore.questions.length>0" :questions="TestStore.questions"  :open-modal="handleOpenModal"/>
      <el-empty v-else description="Для просмотра вопросов выберите тест из списка"/>
    </div>
  </div>
  <ShowQuestion v-model="TestStore.showIsOpened"/>
</template>

<style scoped>

</style>