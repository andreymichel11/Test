<script setup>
import CodeEditor from "simple-code-editor";
import QuestionTest from "./QuestionTypes/QuestionTest.vue";
import QuestionText from "./QuestionTypes/QuestionText.vue";
import QuestionCompare from "./QuestionTypes/QuestionCompare.vue";
const props = defineProps({
  question: Object
})

const whatComponentIs = () => {
  switch (props.question.type.name.toLowerCase()) {
    case "тест":
      return QuestionTest
    case  "текст":
      return QuestionText
    case  "сопоставление":
      return QuestionCompare

  }
}
</script>

<template>
  <div class=" rounded-2xl  h-full w-full border-gray-200 dark:border-neutral-700 border  ">
    <div class="border-b rounded-2xl p-2 border-b-gray-200 dark:border-b-neutral-700  font-bold">
      <p>Вопрос</p>
    </div>
    <div class="p-4">
      <p class="bg-gray-100 dark:bg-neutral-700 p-2 rounded-2xl mb-4" v-if="question.text!==null &&question.text!==undefined" ><span class="fa fa-question-circle-o mr-4"></span>{{question.text}}</p>
      <CodeEditor v-if="question.code!==undefined" width="100%"  font-size="12px" :read-only="true" :display-language="false" :value="question.code" class="mb-4"/>
      <component :is='whatComponentIs()' :question="question"  />
    </div>
  </div>
</template>

<style scoped>

</style>