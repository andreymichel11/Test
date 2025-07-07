<template>

  <div class="test-answer-variants">
    <div class="flex items-center space-x-2 mb-4">
      <el-input
          v-model="newVariant"
          placeholder="Введите вариант ответа"
          clearable
          size="large"
          class="flex-grow"
      />
      <el-button
          type="primary"
          @click="addVariant"
          :disabled="!newVariant.trim()"
      >
        Добавить
      </el-button>
    </div>
    <div class="flex flex-col" v-if="variants.length > 0">
      <p class="mb-2">Варианты ответов:</p>
      <div class="flex gap-2 flex-wrap  items-center mb-4" >
        <el-tag size="large" effect="light" v-for="(variant, index) in variants"
                :key="index"
                :type="getTagType(variant)"
                closable
                @close="removeVariant(index)"
                @click="toggleCorrectVariant(variant)"  class="p-2 bg-gray-100 dark:bg-neutral-700 inline-block rounded-md !text-base">
          {{variant.text}}
        </el-tag>
      </div>
      <p v-if="variants.length>0" class="mb-4 text-md dark:text-gray-400 text-gray-500 ">Для того что бы пометить ответ правильным нажмите на него. Для снятия выделения "правильности" нажмите еще раз</p>
    </div>
    <div v-if="correctVariants.length > 0">
      <p class="mb-2">Правильный ответ:</p>
      <div class="flex gap-2 flex-wrap  items-center">
        <el-tag type="success" effect="plain" size="large" v-for="(variant, index) in correctVariants" :key="index" class="!p-2 bg-gray-100 dark:bg-neutral-700 inline-block rounded-md !text-base">
          {{variant}}
        </el-tag>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch} from 'vue'
import {useQuestionStore} from "../../../../store/QuestionStore.js";
const QuestionStore = useQuestionStore()

const props = defineProps({
  isUpdate: Boolean,
})
// Реактивные переменные
const newVariant = ref('')
const variants = ref([])
const correctVariants = ref([])

watch(
    () => props.isUpdate,
    () => {
      if (props.isUpdate) {
        QuestionStore.newQuestion.variants.variants.forEach(variant => {
          const isCorrect = QuestionStore.newQuestion.answer.answer.includes(variant)
          variants.value.push( {text: variant,  isCorrect: isCorrect })
          if (isCorrect) {
            correctVariants.value.push(variant )
          }
        })
      }
    },
    { immediate: true } // Запускаем watch сразу при создании компонента
);


// Добавление варианта ответа
const addVariant = () => {
  if (newVariant.value.trim()) {
    const variant = {
      text: newVariant.value.trim(),
      isCorrect: false
    }
    variants.value.push(variant)
    newVariant.value = ''
  }
}

// Удаление варианта
const removeVariant = (index) => {
  variants.value.splice(index, 1)
  updateCorrectVariants()
}

// Переключение статуса правильного ответа
const toggleCorrectVariant = (variant) => {
  variant.isCorrect = !variant.isCorrect
  updateCorrectVariants()
}

// Обновление массива правильных вариантов
const updateCorrectVariants = () => {
   return correctVariants.value = variants.value
      .filter(variant => variant.isCorrect)
      .map(variant => variant.text)

}

// Определение типа тега в зависимости от статуса
const getTagType = (variant) => {
  return variant.isCorrect ? 'success' : 'primary'
}

watch(variants,() => {
  QuestionStore.newQuestion.variants.variants.splice(0)
  QuestionStore.newQuestion.variants.variants = (variants.value.map(variant => variant.text))
}, {deep: true})

watch(correctVariants,() => {
  QuestionStore.newQuestion.answer.answer.splice(0)
  QuestionStore.newQuestion.answer.answer = correctVariants.value
}, {deep: true})
</script>

<style scoped>
.test-answer-variants {
  @apply w-full;
}

.variants-container {
  @apply flex flex-wrap;
}
</style>
