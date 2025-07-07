<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useQuestionStore} from "../store/QuestionStore.js";
import {useSubjectStore} from "../store/SubjectStore.js";

import StepType from "../components/Questions/Steps/StepType.vue";
import StepSubject from "../components/Questions/Steps/StepSubject.vue";
import StepQuestion from "../components/Questions/Steps/StepQuestion.vue";
import {useRouter} from "vue-router";

const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()
const router = useRouter()


const active = ref(0)

onMounted(() => {
  QuestionStore.getQuestionsTypes()
  SubjectStore.getSubjects(false)
})

onUnmounted(() => {

  QuestionStore.newQuestion.type_id = null
  QuestionStore.newQuestion.code = ''
  QuestionStore.newQuestion.text = ''
  QuestionStore.newQuestion.variants.variants = []
  QuestionStore.newQuestion.answer.answer = []
  QuestionStore.newQuestion.subject_id = null
})
const next = () => {
  active.value += 1
}
const back = () => {
  active.value -= 1
  if (active.value === 1) {
    QuestionStore.newQuestion.code = ''
    QuestionStore.newQuestion.text = ''
    QuestionStore.newQuestion.variants.variants = []
    QuestionStore.newQuestion.answer.answer = []
  } else if (active.value === 0) {
    QuestionStore.newQuestion.subject_id = null
  }
}

const goHome = () => {
  if (QuestionStore.isCreateQuestionOpened) {
    QuestionStore.setIsCreateQuestionOpened()
  } else {
    router.push({name: 'Main'})
  }
}

const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    SubjectStore.setIsSelect(SubjectStore.subjects.find(sub => sub.name === nodes[0].title));
    QuestionStore.newQuestion.subject_id = SubjectStore.selectSubject.id

  }
}

function saveQuestion() {
  QuestionStore.addNewQuestion(QuestionStore.newQuestion)
  if (QuestionStore.isCreateQuestionOpened) {
    const {id, name} = useSubjectStore().selectSubject
    QuestionStore.getSubjectQuestions(name, id)
    QuestionStore.setIsCreateQuestionOpened()
  } else {
    router.push({name: 'Main'})
  }
}

</script>

<template>
  <el-steps  :active="active" finish-status="success" align-center class="mt-10">
    <el-step title="Выбрать тип вопроса" />
    <el-step title="Выбрать тематику" />
    <el-step title="Создать вопрос" />
  </el-steps>
  <div class="  p-10 mt-10 max-h-[80vh] ">
    <StepType   v-if="active===0" :next="next" :home="goHome"/>
    <StepSubject v-if="active===1" :next="next" :back="back" :node-selected="nodeSelected"/>
    <StepQuestion v-if="active===2" :back="back"  :save="saveQuestion"/>
  </div>



</template>

<style scoped>

</style>