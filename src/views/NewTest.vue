<script setup>
import { useSubjectStore } from "../store/SubjectStore.js";
import { onBeforeMount, onUnmounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTestStore } from "../store/TestStore.js";
import { useQuestionStore } from "../store/QuestionStore.js";

import ChooseSubjectQuestion from "../components/Tests/ChooseSubjectQuestion.vue";
import CreateNameDescription from "../components/Tests/CreateNameDescription.vue";
import TestQuestionsTable from "../components/Tests/TestQuestionsTable.vue";

const router = useRouter()
const SubjectStore = useSubjectStore()
const TestStore = useTestStore()
const QuestionStore = useQuestionStore()

const active = ref(0)

const stepTitles = computed(() => [
  'Название',
  'Вопросы',
  'Завершение'
])

const stepIcons = computed(() => [
  'fa-edit',
  'fa-list',
  'fa-check'
])

const progressPercentage = computed(() => {
  return Math.round(((active.value + 1) / 3) * 100)
})

const canGoNext = computed(() => {
  switch (active.value) {
    case 0:
      return TestStore.testQuestions.name.trim().length > 0
    case 1:
      return TestStore.testQuestions.question_ids.length > 0
    default:
      return false
  }
})

const next = () => {
  if (canGoNext.value && active.value < 2) {
    active.value += 1
  }
}

const back = () => {
  if (active.value > 0) {
    active.value -= 1
  }
}

const goHome = () => {
  router.push({ name: 'Main' })
}

const saveTest = async () => {
  try {
    await TestStore.addTest()
    goHome()
  } catch (error) {
    console.error('Ошибка при сохранении теста:', error)
  }
}

onBeforeMount(() => {
  SubjectStore.getSubjects(false)
})

onUnmounted(() => {
  TestStore.testQuestions.name = ''
  TestStore.testQuestions.question_ids = []
  TestStore.testQuestions.description = ''
  QuestionStore.currentQuestion = {}
  TestStore.preparedQuestions = []
  QuestionStore.subjectQuestions = []
})
</script>

<template>
  <div class=" bg-gray-50 dark:bg-neutral-900 flex flex-col">
    <!-- Header -->
    <div class="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-4">
        <!-- Title and Steps in one row -->
        <div class="flex items-center justify-between">
          <!-- Left: Title and current step -->
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <i class="fa fa-clipboard text-white"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                  Создание теста
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ stepTitles[active] }}
                </p>
              </div>
            </div>

            <!-- Steps Navigation -->
            <div class="hidden lg:flex items-center gap-4">
              <div
                  v-for="(title, index) in stepTitles"
                  :key="index"
                  class="flex items-center"
              >
                <!-- Step Circle -->
                <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300"
                     :class="{
                       'bg-purple-500 border-purple-500 text-white': index <= active,
                       'bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-400': index > active
                     }">
                  <i class="fa text-xs" :class="stepIcons[index]"></i>
                </div>

                <!-- Step Title -->
                <span class="ml-2 text-sm font-medium transition-colors duration-300"
                      :class="{
                        'text-purple-600 dark:text-purple-400': index <= active,
                        'text-gray-500 dark:text-gray-400': index > active
                      }">
                  {{ title }}
                </span>

                <!-- Connection Line -->
                <div v-if="index < stepTitles.length - 1"
                     class="w-8 h-0.5 mx-3 transition-colors duration-300"
                     :class="{
                       'bg-purple-500': index < active,
                       'bg-gray-300 dark:bg-neutral-600': index >= active
                     }">
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Progress Circle -->
          <div class="hidden sm:flex items-center">
            <div class="relative w-12 h-12">
              <svg class="transform -rotate-90 w-12 h-12">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    stroke-width="3"
                    fill="transparent"
                    class="text-gray-200 dark:text-neutral-700"
                />
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    stroke-width="3"
                    fill="transparent"
                    stroke-dasharray="125.66"
                    :stroke-dashoffset="125.66 - (125.66 * progressPercentage) / 100"
                    class="text-purple-500 transition-all duration-300"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ progressPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="flex-1 min-h-0">
      <CreateNameDescription
          v-if="active === 0"
          :next="next"
          :home="goHome"
          class="h-full"
      />

      <ChooseSubjectQuestion
          v-if="active === 1"
          :back="back"
          :next="next"
          class="h-full overflow-y-auto"
      />

      <TestQuestionsTable
          v-if="active === 2"
          :back="back"
          :save="saveTest"
          class="h-full overflow-y-auto"
      />
    </div>

    <!-- Footer Help -->
    <div class="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex-shrink-0">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <i class="fa fa-lightbulb text-yellow-500"></i>
            <span>
              <span v-if="active === 0">Укажите название и описание для вашего теста</span>
              <span v-else-if="active === 1">Выберите вопросы из доступных тематик</span>
              <span v-else>Проверьте выбранные вопросы перед сохранением</span>
            </span>
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <i class="fa fa-info-circle mr-1"></i>
            <span>Всего вопросов: {{ TestStore.testQuestions.question_ids.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile Steps - show simplified version */
@media (max-width: 1024px) {
  .lg\:flex {
    display: none !important;
  }
}
</style>