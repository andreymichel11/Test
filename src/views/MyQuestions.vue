<script setup>
import {onMounted, onUnmounted} from "vue";
import {useQuestionStore} from "../store/QuestionStore.js";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import QuestionBlock from "../components/Subject/QuestionInfo/QuestionBlock.vue";
import UpdateQuestion from "../components/Questions/UpdateQuestion.vue";
import {useSubjectStore} from "../store/SubjectStore.js";
import {useUsersStore} from "../store/UsersStore.js";
import {useRoute} from "vue-router";
const route = useRoute()

const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()
const UsersStore = useUsersStore()
const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question
}

onMounted(  () => {
  const id = UsersStore.getUserId
  QuestionStore.getQuestions(`?creator_user_id=${id}`)
})

onUnmounted(() => {
  QuestionStore.questions = []
  QuestionStore.currentQuestion = {}
})

const updateQuestion = async () => {
  await SubjectStore.getSubjects().then(() => {
    QuestionStore.newQuestion.subject_id = QuestionStore.currentQuestion.subject_id;
    QuestionStore.newQuestion.text = QuestionStore.currentQuestion.text;
    QuestionStore.newQuestion.code = QuestionStore.currentQuestion.code;
    QuestionStore.newQuestion.variants = JSON.parse(JSON.stringify(QuestionStore.currentQuestion.variants));
    QuestionStore.newQuestion.answer = JSON.parse(JSON.stringify(QuestionStore.currentQuestion.answer));
    QuestionStore.newQuestion.type_id = QuestionStore.currentQuestion.type.id;
    QuestionStore.setIsUpdateQuestionOpened()
    QuestionStore.getQuestionsTypes()
  })

}

</script>

<template>
  <div class="h-full flex flex-col items-center justify-center ">
    <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start h-[35vh] min-h-[200px] overflow-scroll w-full relative">
      <SubjectQuestions  v-if="QuestionStore.questions.length>0" :questions="QuestionStore.questions" :set-questions="handleCurrentChange"/>
      <el-empty
          v-else
          class="!p-0"
          description="Вы не создали ни одного вопроса" />
    </div>
    <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start  min-h-[500px] overflow-scroll w-full relative">
      <div class="flex items-center justify-between mb-5" v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0">
        <div>
          <el-button @click="updateQuestion">Изменить вопрос</el-button>
        </div>
        <el-button  @click="QuestionStore.delQuestion(route.toLowerCase())"><span class="fa fa-trash "></span></el-button>
      </div>
      <QuestionBlock v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0"/>
      <el-empty v-else description="Для просмотра выберите вопрос из списка"/>
    </div>
  </div>

  <UpdateQuestion v-if="QuestionStore.isUpdateQuestionOpened"/>
</template>

<style scoped>

</style>