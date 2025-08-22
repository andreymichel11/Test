<script setup>
import CodeEditor from "simple-code-editor";
import QuestionTest from "./QuestionTypes/QuestionTest.vue";
import QuestionText from "./QuestionTypes/QuestionText.vue";
import QuestionCompare from "./QuestionTypes/QuestionCompare.vue";
import { computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});

const questionComponent = computed(() => {
  const questionType = props.question.type?.name?.toLowerCase();

  switch (questionType) {
    case "тест":
      return QuestionTest;
    case "текст":
      return QuestionText;
    case "сопоставление":
      return QuestionCompare;
    default:
      return null;
  }
});

const hasQuestionText = computed(() => {
  return props.question.text !== null &&
      props.question.text !== undefined &&
      props.question.text.trim() !== '';
});

const hasCode = computed(() => {
  return props.question.code !== null &&
      props.question.code !== undefined &&
      props.question.code.trim() !== '';
});
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 flex flex-1 flex-col">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/50 rounded-t-xl">
      <h3 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <i class="fa fa-question-circle text-green-500"></i>
        Вопрос
      </h3>
    </div>

    <!-- Content -->
    <div class="flex-1 p-4 space-y-4">
      <!-- Question Text -->
      <div
          v-if="hasQuestionText"
          class="bg-gray-50 dark:bg-neutral-700 p-4 rounded-xl border border-gray-200 dark:border-neutral-600"
      >
        <div class="flex items-start gap-3">
          <i class="fa fa-quote-left text-blue-500 mt-1 flex-shrink-0"></i>
          <p class="text-gray-900 dark:text-gray-100 leading-relaxed">
            {{ question.text }}
          </p>
        </div>
      </div>

      <!-- Code Block -->
      <div
          v-if="hasCode"
          class="border border-gray-200 dark:border-neutral-600 rounded-xl overflow-hidden"
      >
        <div class="bg-gray-100 dark:bg-neutral-700 px-3 py-2 border-b border-gray-200 dark:border-neutral-600">
          <div class="flex items-center gap-2">
            <i class="fa fa-code text-purple-500"></i>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Код</span>
          </div>
        </div>
        <div class="bg-white dark:bg-neutral-800">
          <CodeEditor
              width="100%"
              font-size="14px"
              :read-only="true"
              :display-language="false"
              :value="question.code"
              class="rounded-b-xl"
          />
        </div>
      </div>

      <!-- Question Type Component -->
      <div v-if="questionComponent" class="space-y-3">
        <component :is="questionComponent" :question="question" />
      </div>

      <!-- No content message -->
      <div
          v-if="!hasQuestionText && !hasCode && !questionComponent"
          class="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400"
      >
        <div class="text-center">
          <i class="fa fa-exclamation-circle text-2xl mb-2"></i>
          <p>Содержимое вопроса отсутствует</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Clean styling without scrollbars */
</style>