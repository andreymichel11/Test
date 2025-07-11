<script setup>
import { computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});

const variants = computed(() => {
  if (!props.question.variants?.variants) return [];
  return props.question.variants.variants;
});

const correctAnswers = computed(() => {
  if (!props.question.answer?.answer) return [];
  return props.question.answer.answer;
});

const hasVariants = computed(() => variants.value.length > 0);
const hasAnswers = computed(() => correctAnswers.value.length > 0);

const formatText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
</script>

<template>
  <div class="space-y-4">
    <!-- Variants Section -->
    <div v-if="hasVariants">
      <div class="flex items-center gap-2 mb-3">
        <i class="fa fa-list-ul text-blue-500"></i>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">Варианты ответов:</h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
            v-for="(variant, index) in variants"
            :key="`variant-${index}`"
            class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-all duration-200 hover:shadow-sm"
        >
          <div class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
            {{ String.fromCharCode(65 + index) }}
          </div>
          <span class="text-sm text-gray-900 dark:text-gray-100">
            {{ formatText(variant) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Correct Answers Section -->
    <div v-if="hasAnswers">
      <div class="flex items-center gap-2 mb-3">
        <i class="fa fa-check-circle text-green-500"></i>
        <h4 class="font-medium text-gray-900 dark:text-gray-100">
          Правильный{{ correctAnswers.length > 1 ? 'е' : '' }} ответ{{ correctAnswers.length > 1 ? 'ы' : '' }}:
        </h4>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
            v-for="(answer, index) in correctAnswers"
            :key="`answer-${index}`"
            class="inline-flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg font-medium text-sm"
        >
          <i class="fa fa-check text-xs"></i>
          {{ formatText(answer) }}
        </div>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-if="!hasVariants && !hasAnswers" class="text-center py-8">
      <i class="fa fa-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
      <p class="text-gray-500 dark:text-gray-400">
        Варианты ответов и правильные ответы не заданы
      </p>
    </div>
  </div>
</template>
