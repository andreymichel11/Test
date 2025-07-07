<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useQuestionStore} from "../../store/QuestionStore.js";
import {useSubjectStore} from "../../store/SubjectStore.js";

import StepSubject from "../../components/Questions/Steps/StepSubject.vue";
import StepQuestion from "../../components/Questions/Steps/StepQuestion.vue";
import {useRoute} from "vue-router";


const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()



const active = ref(0)

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
}

const goHome = () => {
  QuestionStore.setIsUpdateQuestionOpened()
}

const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    SubjectStore.setIsSelect(SubjectStore.subjects.find(sub => sub.name === nodes[0].title));
    QuestionStore.newQuestion.subject_id = SubjectStore.selectSubject.id

  }
}
const route = useRoute()
function updateQuestionFunc() {
  QuestionStore.updateQuestion(QuestionStore.newQuestion, route.name.toLowerCase()).then(() => {
    SubjectStore.getStatistic()
  })
}
</script>

<template>
  <el-dialog title="Изменить вопрос" center width="90%" class="min-h-[90%]" top="50px" v-model="QuestionStore.isUpdateQuestionOpened">

    <el-steps  :active="active" finish-status="success" align-center class="mt-10">
      <el-step title="Выбрать тематику" />
      <el-step title="Создать вопрос" />
    </el-steps>
    <div class="  p-10 mt-10  ">
      <StepSubject v-if="active===0" :next="next" :back="goHome" :node-selected="nodeSelected"/>
      <keep-alive>
        <StepQuestion v-if="active===1" :back="back"  :save="updateQuestionFunc" :is-update="true"/>
      </keep-alive>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>