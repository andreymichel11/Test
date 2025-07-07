<script setup>
import {whatStatus} from '../../../utils/utils.js'
import QuestionInfoItem from "./QuestionInfoItem.vue";
const props = defineProps({
  question: Object
})
</script>

<template>
<div class=" rounded-2xl   h-full w-[40%] border-gray-200 dark:border-neutral-700 border overflow-scroll">
  <div class="border-b rounded-2xl p-2 border-b-gray-200 dark:border-b-neutral-700 font-bold ">
    <p>Общая информация</p>
  </div>
  <ul class="p-5 ">
    <QuestionInfoItem title="Тематика" :value="question.subject_name.split('_').join(' ')"/>
    <QuestionInfoItem title="Тип вопроса">
      <div class="col-start-4 col-end-7 break-all">
        <el-tag :type="whatStatus(question.type.name)">
          <p class="font-bold break-all">{{question.type.name[0].toUpperCase() + question.type.name.slice(1)}}</p>
        </el-tag>
      </div>
    </QuestionInfoItem>
    <QuestionInfoItem title="Статус">
      <div class="col-start-4 col-end-7 break-all">
        <el-tag :type="whatStatus(question.status)" effect="dark" round>
          <p class="font-bold  break-all">{{question.status[0].toUpperCase() + question.status.slice(1)}}</p>
        </el-tag>
      </div>
    </QuestionInfoItem>
    <QuestionInfoItem title="Создал" :value="question.creator.user_name" />
    <QuestionInfoItem title="Дата создания" :value="question.created_at.split('T')[0]"/>
    <QuestionInfoItem title="Модератор" :value="question.moderator.user_name" v-if="question.moderator.user_name!==undefined"/>
    <QuestionInfoItem title="Дата модерации" :value="question.moderated_at.split('T')[0]" v-if="question.moderated_at!==undefined"/>
  </ul>
</div>

</template>

<style scoped>
:deep(.el-divider--horizontal) {
  margin: 10px 0;
}
</style>