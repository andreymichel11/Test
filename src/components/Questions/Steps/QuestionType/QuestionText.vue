<script setup>
import {useQuestionStore} from "../../../../store/QuestionStore.js";
import {ref, watch} from "vue";
const props = defineProps({
  isUpdate: Boolean
})
const QuestionStore = useQuestionStore()
const answer = ref('')

watch(answer, () => {
  QuestionStore.newQuestion.answer.answer.splice(0)
  if (answer.value.trim() !== "") {
    QuestionStore.newQuestion.answer.answer.push(answer.value)
  }
})

watch(
    () => props.isUpdate,
    () => {
      if (props.isUpdate) {
        answer.value = QuestionStore.newQuestion.answer.answer[0]
      }
    },
    { immediate: true } // Запускаем watch сразу при создании компонента
);
</script>

<template>
  <div class="mt-6   rounded-lg" >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Пример правильного ответа:</h2>
    </div>
    <div class="mt-4">
      <el-input type="textarea" v-model="answer"/>
    </div>
  </div>
</template>

<style scoped>

</style>