<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useQuestionStore } from '../store/QuestionStore.js'
import { useSubjectStore } from '../store/SubjectStore.js'
import { useRouter } from 'vue-router'

import StepType from '../components/Questions/Steps/StepType.vue'
import StepSubject from '../components/Questions/Steps/StepSubject.vue'
import StepQuestion from '../components/Questions/Steps/StepQuestion.vue'

const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()
const router = useRouter()

const active = ref(0)
const isLoading = ref(false)

const stepTitles = computed(() => [
  'Тип',
  'Тематика',
  'Создание'
])

const stepIcons = computed(() => [
  'fa-list-alt',
  'fa-sitemap',
  'fa-edit'
])

const canGoNext = computed(() => {
  switch (active.value) {
    case 0:
      return QuestionStore.newQuestion.type_id !== null
    case 1:
      return QuestionStore.newQuestion.subject_id !== null
    default:
      return false
  }
})

const progressPercentage = computed(() => {
  return Math.round(((active.value + 1) / 3) * 100)
})

onMounted(async () => {
  try {
    await Promise.all([
      QuestionStore.getQuestionsTypes(),
      SubjectStore.getSubjects(false)
    ])
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
})

onUnmounted(() => {
  resetQuestionData()
})

const resetQuestionData = () => {
  QuestionStore.newQuestion.type_id = null
  QuestionStore.newQuestion.code = ''
  QuestionStore.newQuestion.text = ''
  QuestionStore.newQuestion.variants.variants = []
  QuestionStore.newQuestion.answer.answer = []
  QuestionStore.newQuestion.subject_id = null
}

const next = () => {
  if (canGoNext.value && active.value < 2) {
    active.value += 1
  }
}

const back = () => {
  if (active.value > 0) {
    active.value -= 1

    if (active.value === 1) {
      QuestionStore.newQuestion.code = ''
      QuestionStore.newQuestion.text = ''
      QuestionStore.newQuestion.variants.variants = []
      QuestionStore.newQuestion.answer.answer = []
    } else if (active.value === 0) {
      QuestionStore.newQuestion.subject_id = null
    }
  }
}

const goHome = () => {
  if (QuestionStore.isCreateQuestionOpened) {
    QuestionStore.setIsCreateQuestionOpened()
  } else {
    router.push({ name: 'Main' })
  }
}

const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    const selectedSubject = SubjectStore.subjects.find(sub => sub.name === nodes[0].title)
    if (selectedSubject) {
      SubjectStore.setIsSelect(selectedSubject)
      QuestionStore.newQuestion.subject_id = selectedSubject.id
    }
  }
}

const saveQuestion = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    await QuestionStore.addNewQuestion(QuestionStore.newQuestion)

    if (QuestionStore.isCreateQuestionOpened) {
      const { id, name } = SubjectStore.selectSubject
      await QuestionStore.getSubjectQuestions(name, id)
      QuestionStore.setIsCreateQuestionOpened()
    } else {
      router.push({ name: 'Main' })
    }
  } catch (error) {
    console.error('Ошибка при сохранении вопроса:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class=" bg-gray-50 dark:bg-neutral-900 flex flex-col">
    <!-- Compact Header -->
    <div class="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-4">
        <!-- Title and Steps in one row -->
        <div class="flex items-center justify-between">
          <!-- Left: Title and current step -->
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <i class="fa fa-plus text-white"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                  Создание вопроса
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
                       'bg-blue-500 border-blue-500 text-white': index <= active,
                       'bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-400': index > active
                     }">
                  <i class="fa text-xs" :class="stepIcons[index]"></i>
                </div>

                <!-- Step Title -->
                <span class="ml-2 text-sm font-medium transition-colors duration-300"
                      :class="{
                        'text-blue-600 dark:text-blue-400': index <= active,
                        'text-gray-500 dark:text-gray-400': index > active
                      }">
                  {{ title }}
                </span>

                <!-- Connection Line -->
                <div v-if="index < stepTitles.length - 1"
                     class="w-8 h-0.5 mx-3 transition-colors duration-300"
                     :class="{
                       'bg-blue-500': index < active,
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
                    class="text-blue-500 transition-all duration-300"
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

    <!-- Main Content Container - Takes remaining space -->
    <div class="flex-1 overflow-hidden">
      <StepType
          v-if="active === 0"
          :next="next"
          :home="goHome"
          class="h-full"
      />

      <StepSubject
          v-if="active === 1"
          :next="next"
          :back="back"
          :node-selected="nodeSelected"
          :can-continue="canGoNext"
          class="h-full"
      />

      <StepQuestion
          v-if="active === 2"
          :back="back"
          :save="saveQuestion"
          :is-loading="isLoading"
          class="h-full"
      />
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
