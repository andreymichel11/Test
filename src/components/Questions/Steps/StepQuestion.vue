<script setup>
import {computed, ref, watch} from "vue";
import hljs from "highlight.js";
import {useQuestionStore} from "../../../store/QuestionStore.js";
import {useSubjectStore} from "../../../store/SubjectStore.js";
import QuestionCompare from "./QuestionType/QuestionCompare.vue";
import QuestionText from "./QuestionType/QuestionText.vue";
import QuestionTest from "./QuestionType/QuestionTest.vue";

const SubjectStore = useSubjectStore()
const props = defineProps({
  back: Function,
  save: Function,
  isUpdate: Boolean,
})

const getName = computed(() => {
  if (SubjectStore.selectSubject!==null) {
    return SubjectStore.selectSubject.name.split('_').join(' ')
  }
  return QuestionStore.currentQuestion.subject_name.split('_').join(' ')
})

const getType = computed(() => {
  const type = QuestionStore.types.find(item => {

    return item.id === QuestionStore.newQuestion.type_id
  })
  return type.name[0].toUpperCase() + type.name.slice(1)
})

const inputHighlight =  () => {
  const codeElement = document.querySelector("code");
  codeElement.removeAttribute('data-highlighted');
  hljs.highlightAll
}
const QuestionStore = useQuestionStore()

const isCode = ref(false)


const checkType = computed(() => {
  return getType.value.toLowerCase() === "сопоставление"
})

const whatComponentIs = computed(() => {
  switch (getType.value.toLowerCase()) {
    case "сопоставление":
      return QuestionCompare
    case "текст":
      return QuestionText
    case "тест":
      return QuestionTest
  }
})

watch(
    () => props.isUpdate,
    () => {
      isCode.value = QuestionStore.newQuestion.code !== undefined && QuestionStore.newQuestion.code.length > 0;

    },
    { immediate: true } // Запускаем watch сразу при создании компонента
);

watch(
    isCode,
    (newIsCode) => {
      if (!newIsCode) {
        QuestionStore.newQuestion.code=''
      }
    },
    {deep:true}// Запускаем watch сразу при создании компонента
);


</script>

<template>
  <div class=" flex flex-col justify-center w-[80%] m-auto">
    <div class="flex justify-between gap-4 mt-5 ">
      <el-form-item class="w-full" label-position="top" label="Тип вопроса">
        <el-input  readonly size="large" v-model="getType"></el-input>
      </el-form-item>
      <el-form-item class="w-full" label-position="top" label="Тематика вопроса">
        <el-input readonly size="large" v-model="getName"></el-input>
      </el-form-item>

    </div>

    <el-form-item class="w-full" label-position="top" label="Текст вопроса">
      <el-input  size="large" v-model="QuestionStore.newQuestion.text"/>
    </el-form-item>
    <el-checkbox size="large" v-model="isCode" v-if="!checkType">Добавить программный код в вопрос</el-checkbox>
    <div class="flex gap-4 mt-5 ">
      <code-editor class="!w-[40%] " height="500px" font-size="12px" v-if="isCode" :value="QuestionStore.newQuestion.code" v-model="QuestionStore.newQuestion.code" @input="inputHighlight" :languages="[['cpp', 'C++'],['python', 'Python'],['php', 'PHP'], ['go', 'GO'], ['c', 'C'], ['javascript','JavaScript'], ['sql','SQL']]"/>
      <div class="w-[50%] flex-1">
        <component :is="whatComponentIs" :is-update="isUpdate" :is-code="isCode"/>
      </div>
    </div>
    <div class="flex">
      <el-button type="primary" size="large" class="mt-10" v-if="Object.keys(QuestionStore.newQuestion.answer.answer).length > 0 && QuestionStore.newQuestion.text.trim()!==''" @click="save">Сохранить вопрос</el-button>
      <el-button type="warning" size="large" class="mt-10" plain @click="back">Вернуться назад</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>