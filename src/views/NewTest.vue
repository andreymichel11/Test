<script setup>
import {useSubjectStore} from "../store/SubjectStore.js";

import {onBeforeMount, onUnmounted, ref} from "vue";

import ChooseSubjectQuestion from "../components/Tests/ChooseSubjectQuestion.vue";
import CreateNameDescription from "../components/Tests/CreateNameDescription.vue";
import {useTestStore} from "../store/TestStore.js";
import TestQuestionsTable from "../components/Tests/TestQuestionsTable.vue";
import {useRouter} from "vue-router";
import {useQuestionStore} from "../store/QuestionStore.js";

const router = useRouter()
const SubjectStore = useSubjectStore()
const TestStore = useTestStore()
const QuestionStore = useQuestionStore()

const active = ref(0)
const next = () => {
  active.value += 1
}
const back = () => {
  active.value -= 1
}
const goHome = () => {
  router.push({name: 'Main'})
}

onBeforeMount(() => {
  SubjectStore.getSubjects(false)
})

const saveTest = () => {
  TestStore.addTest().then(() => {
    goHome()
  })
}

onUnmounted(() => {
  TestStore.testQuestions.name = ''
  TestStore.testQuestions.question_ids = []
  TestStore.testQuestions.description = ''
  QuestionStore.currentQuestion = {}
  TestStore.preparedQuestions = []
  QuestionStore.subjectQuestions = []
})
</script>

<template>
  <div class="flex flex-col h-(--main-height)">
    <div class="flex w-full justify-center items-center mt-10">
      <el-button v-if="active!==0" @click="back" type="warning" size="large">Назад</el-button>
      <el-steps  :active="active" finish-status="success" align-center class="w-[50%]">
        <el-step title="Название теста" />
        <el-step title="Выбрать вопросы" />
        <el-step title="Создание теста" />
      </el-steps>
      <el-button v-if="active!==0?active===1 && TestStore.testQuestions.question_ids.length>0:false" @click="next" type="primary" size="large">Продолжить</el-button>
      <el-button v-if="active===2 && TestStore.testQuestions.question_ids.length>0" @click="saveTest" type="primary" size="large" >Сохранить тест</el-button>
    </div>
    <CreateNameDescription v-if="active===0" :next="next" :home="goHome"/>
    <ChooseSubjectQuestion  v-if="active===1"/>
    <TestQuestionsTable  v-if="active===2"/>

  </div>
</template>

<style scoped>

</style>