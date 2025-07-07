<script setup>
import SmallCard from "../components/Main/SmallCard.vue";
import BigCard from "../components/Main/BigCard.vue";
import {useSubjectStore} from "../store/SubjectStore.js";
import CreateQuestion from "../components/Questions/CreateQuestion.vue";
import {useQuestionStore} from "../store/QuestionStore.js";
import {useRouter} from "vue-router";
import {useAuthStore} from "../store/AuthStore.js";
import {useUsersStore} from "../store/UsersStore.js";
const SubjectStore = useSubjectStore()
const QuestionStore = useQuestionStore()
const AuthStore = useAuthStore()
const UsersStore = useUsersStore()
const router = useRouter()
</script>

<template>
  <div class="h-(--main-height)">
    <div class="absolute inset-0  lg:bg-(image:--main-bg-image)  bg-right-bottom  lg:bg-auto lg:bg-no-repeat  z-[-1] "></div>
    <div class="flex mt-[40px] mb-[40px] max-sm:flex-col max-sm:gap-2">
      <el-button type="primary" size="large" @click="router.push({name:'NewTest'})">Сгенерировать тест</el-button>
      <el-button type="primary" size="large" class="max-sm:!ml-0" @click="router.push({name:'NewQuestion'})"> Добавить новый вопрос</el-button>
    </div>
    <div class=" grid auto-cols-[minmax(0,2fr)] grid-rows-[250px_250px]  gap-y-[40px] gap-x-[40px] max-lg:mb-10">
      <SmallCard class="row-start-1 row-span-1 col-start-1 col-span-1 max-sm:row-start-1 max-sm:col-start-1" title="Всего тематик:" :count="SubjectStore.statistic.subject_count"  :is-go="AuthStore.access_token!== null && UsersStore.getRole==='admin'" go="Subjects"/>
      <SmallCard class="row-start-2 row-span-1 col-start-1 col-span-1 max-sm:row-start-2 max-sm:col-start-1" title="Моих вопросов:" :count="SubjectStore.statistic.question_count_created_by_current_user" :is-go="true" go="MyQuestions"/>
      <SmallCard class="row-start-1 row-span-1 col-start-2 col-span-1 max-sm:row-start-3 max-sm:col-start-1" title="Всего вопросов:" :count="SubjectStore.statistic.question_count" />
      <SmallCard class="row-start-2 row-span-1 col-start-2 col-span-1 max-sm:row-start-4 max-sm:col-start-1" title="Сгенерированных тестов:" :count="SubjectStore.statistic.test_count_created_by_current_user" :is-go="true" go="Tests"/>
      <BigCard
          title="Топ тематик:"
          :label="SubjectStore.chartLabelArray"
          :count="SubjectStore.chartCountArray"
          class="lg:row-start-1 lg:row-span-2 lg:col-start-3  sm:row-start-3 sm:row-end-5 sm:col-start-1 sm:col-span-2 col-start-1 col-span-1"
      />
    </div>
  </div>
  <CreateQuestion v-if="QuestionStore.isCreateQuestionOpened" />
</template>
