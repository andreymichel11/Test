<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const leftVariants = computed(() => {
  if (!props.question.variants?.variants?.[0]?.left) return []
  return props.question.variants.variants[0].left
})

const rightVariants = computed(() => {
  if (!props.question.variants?.variants?.[0]?.right) return []
  return props.question.variants.variants[0].right
})

const correctAnswers = computed(() => {
  if (!props.question.answer?.answer?.[0]) return []
  const answerObj = props.question.answer.answer
  const resultAnswer = []

  answerObj.map(ans => {
    resultAnswer.push({key:Object.keys(ans)[0], value: Object.values(ans)[0]})
  })

  return resultAnswer
})

const hasVariants = computed(() => leftVariants.value.length > 0 || rightVariants.value.length > 0)
const hasAnswers = computed(() => correctAnswers.value.length > 0)

const formatText = (text) => {
  if (!text || typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Comparison Tables Section -->
    <div v-if="hasVariants">
      <div class="flex items-center gap-2 mb-4">
        <i class="fa fa-columns text-blue-500"></i>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">Варианты для сопоставления:</h4>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column -->
        <div class="comparison-table-container">
          <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Левая колонка</h5>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <div
                v-for="(item, index) in leftVariants"
                :key="`left-${index}`"
                class="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {{ index + 1 }}
              </div>
              <span class="text-sm text-gray-900 dark:text-gray-100 break-words">{{ formatText(item) }}</span>
            </div>
            <div v-if="leftVariants.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="fa fa-inbox text-2xl mb-2"></i>
              <span class="text-sm">Нет данных</span>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="comparison-table-container">
          <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Правая колонка</h5>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <div
                v-for="(item, index) in rightVariants"
                :key="`right-${index}`"
                class="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {{ String.fromCharCode(65 + index) }}
              </div>
              <span class="text-sm text-gray-900 dark:text-gray-100 break-words">{{ formatText(item) }}</span>
            </div>
            <div v-if="rightVariants.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-400">
              <i class="fa fa-inbox text-2xl mb-2"></i>
              <span class="text-sm">Нет данных</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Correct Answers Section -->
    <div v-if="hasAnswers">
      <div class="flex items-center gap-2 mb-4">
        <i class="fa fa-check-circle text-green-500"></i>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">
          Правильны{{ correctAnswers.length > 1 ? 'е' : 'й' }} ответ{{ correctAnswers.length > 1 ? 'ы' : '' }}:
        </h4>
      </div>

      <div class="flex flex-wrap gap-3">
        <div
            v-for="(answer, index) in correctAnswers"
            :key="`answer-${index}`"
            class="inline-flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg font-medium text-sm hover:shadow-md transition-all"
        >
          <i class="fa fa-link text-xs"></i>
          <span class="font-semibold">{{ answer.key }}</span>
          <i class="fa fa-arrow-right text-xs mx-1"></i>
          <span>{{ formatText(answer.value) }}</span>
        </div>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-if="!hasVariants && !hasAnswers" class="text-center py-12">
      <i class="fa fa-exclamation-triangle text-yellow-500 text-3xl mb-3"></i>
      <h5 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Данные не заданы
      </h5>
      <p class="text-gray-500 dark:text-gray-400">
        Варианты для сопоставления и правильные ответы не указаны
      </p>
    </div>
  </div>
</template>

<style scoped>
.comparison-table-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.dark .comparison-table-container {
  background: #1f2937;
  border-color: #374151;
}

/* Custom scrollbar */
.comparison-table-container div::-webkit-scrollbar {
  width: 6px;
}

.comparison-table-container div::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.comparison-table-container div::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .comparison-table-container div::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark .comparison-table-container div::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
