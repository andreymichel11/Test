<script setup>

import SubjectTreeComponent from "../Subject/SubjectTreeComponent.vue";
import Question from "../Subject/QuestionInfo/Question.vue";
import SubjectQuestions from "../Subject/SubjectQuestions.vue";
import QuestionInfo from "../Subject/QuestionInfo/QuestionInfo.vue";
import {useSubjectStore} from "../../store/SubjectStore.js";
import {useQuestionStore} from "../../store/QuestionStore.js";
import {useModerateStore} from "../../store/ModerateStore.js";
import {useUsersStore} from "../../store/UsersStore.js";
import {useTestStore} from "../../store/TestStore.js";
import {onMounted} from "vue";

const SubjectStore = useSubjectStore()
const QuestionStore = useQuestionStore()
const TestStore = useTestStore()


const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    TestStore.setCurrentSubject(SubjectStore.subjects.find(sub => sub.name === nodes[0].title));

    if (QuestionStore.subjectQuestions[TestStore.currentSubject.title] ===undefined) {
      QuestionStore.getSubjectQuestionsApprove(TestStore.currentSubject.title,TestStore.currentSubject.id);
      QuestionStore.currentQuestion = {}
    }
  }
}
const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question
}
onMounted(  () => {
   QuestionStore.getQuestionsStatuses()
})
</script>

<template>
  <div class="flex gap-10 h-[95%] pb-5 ">
    <div class=" rounded-xl shadow-2xl bg-white w-[30%] dark:bg-neutral-800 px-6 py-4 mt-10 overflow-auto flex flex-col justify-start ">
      <SubjectTreeComponent :subjects="SubjectStore.newSubjectsStruct"  :select="nodeSelected" v-if="SubjectStore.newSubjectsStruct !== null"/>
      <SubjectTreeComponent :subjects="SubjectStore.newSubjectsStruct"  :select="nodeSelected" v-if="SubjectStore.newSubjectsStruct !== null"/>
    </div>
    <div class="flex flex-col w-[70%]">
      <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start h-[30%] min-h-[200px] overflow-scroll w-full relative">

        <SubjectQuestions
            v-if="TestStore.currentSubject!==null && QuestionStore.subjectQuestions[TestStore.currentSubject.title]?.length>0"
            :questions="QuestionStore.subjectQuestions[TestStore.currentSubject.title]"
            :set-questions="handleCurrentChange"
            class="w-full"
        />
        <el-empty
            class="!p-0"
            v-else
            :description="SubjectStore.selectSubject===null?'Выберите тематику':QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length===0 ?`В тематике '${ SubjectStore.selectSubject.name.split('_').join(' ')}' вопросов нет`:''" />
      </div>
      <div class=" rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col h-[70%] w-full overflow-scroll" :class="QuestionStore.currentQuestion!==null ?'':'justify-center'">
        <div class="flex grow justify-between gap-2" v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0">
          <QuestionInfo :question="QuestionStore.currentQuestion"/>
          <Question :question="QuestionStore.currentQuestion"/>
        </div>
        <el-empty  v-else :description="SubjectStore.selectSubject===null?'Выберите тематику, а затем вопрос':'Выберите доступный вопрос из тематики'"/>
        {{TestStore.testQuestions}}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>