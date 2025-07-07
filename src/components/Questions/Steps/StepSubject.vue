<script setup>

import SubjectTreeComponent from "../../Subject/SubjectTreeComponent.vue";
import {useQuestionStore} from "../../../store/QuestionStore.js";
import {useSubjectStore} from "../../../store/SubjectStore.js";
const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()

const props = defineProps({
  nodeSelected: Function,
  next: Function,
  back: Function,
})
</script>

<template>
  <div class="flex justify-center gap-10 h-[70vh]">
    <div class="  w-[30%]  px-6 py-4 mt-10 overflow-scroll flex flex-col justify-start ">
      <SubjectTreeComponent  :subjects="SubjectStore.newSubjectsStruct"  :select="nodeSelected"/>
    </div>
    <div class="flex w-[30%] h-full justify-between">
      <div class="flex w-full flex-col items-center justify-center">
        <h1  class="-mt-[20%] text-2xl">{{QuestionStore.newQuestion.subject_id===null?'Тематика не выбрана': SubjectStore.selectSubject!==null?SubjectStore.selectSubject.name.split('_').join(' '):`Выбранная тематика: ${QuestionStore.currentQuestion.subject_name.split('_').join(' ')}`}}</h1>
        <p  v-if="QuestionStore.newQuestion.subject_id===null">Выберите тематику из списка слева</p>
        <div class="flex">
          <el-button type="primary" size="large" class="mt-10" v-if="QuestionStore.newQuestion.subject_id!==null" @click="next">Продолжить</el-button>
          <el-button type="warning" size="large" class="mt-10" plain @click="back">Вернуться назад</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>