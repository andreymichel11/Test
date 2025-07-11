<script setup>
import { computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});

const correctAnswer = computed(() => {
  if (!props.question.answer?.answer?.[0]) return null;
  return props.question.answer.answer[0];
});

const hasAnswer = computed(() => {
  return correctAnswer.value !== null && correctAnswer.value.trim() !== '';
});

const formatText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
</script>

<template>
  <div class="space-y-4">
    <!-- Correct Answer Section -->
    <div v-if="hasAnswer">
      <div class="flex items-center gap-2 mb-3">
        <i class="fa fa-lightbulb text-yellow-500"></i>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">Пример правильного ответа:</h4>
      </div>

      <div class="inline-flex items-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg font-medium">
        <i class="fa fa-check-circle text-green-600 dark:text-green-400"></i>
        <span class="text-base">
          {{ formatText(correctAnswer) }}
        </span>
      </div>

      <!-- Additional Info -->
      <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-start gap-2">
          <i class="fa fa-info-circle text-blue-500 mt-0.5 flex-shrink-0"></i>
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <p class="font-medium mb-1">Тип вопроса: Текстовый ответ</p>
            <p class="text-blue-600 dark:text-blue-300">
              Участник должен ввести ответ в текстовом формате. Ответ будет проверен на соответствие с образцом.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Answer Message -->
    <div v-else class="text-center py-8">
      <i class="fa fa-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
      <p class="text-gray-500 dark:text-gray-400 mb-2">
        Пример правильного ответа не задан
      </p>
      <div class="text-sm text-gray-400 dark:text-gray-500">
        Для текстового вопроса необходимо указать образец правильного ответа
      </div>
    </div>
  </div>
</template>