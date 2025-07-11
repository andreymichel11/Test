<script setup>
import { computed } from 'vue'
import SubjectTreeComponent from '../../Subject/SubjectTreeComponent.vue'
import { useQuestionStore } from '../../../store/QuestionStore.js'
import { useSubjectStore } from '../../../store/SubjectStore.js'

const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()

const props = defineProps({
  nodeSelected: {
    type: Function,
    required: true
  },
  next: {
    type: Function,
    required: true
  },
  back: {
    type: Function,
    required: true
  },
  canContinue: {
    type: Boolean,
    default: false
  }
})

const selectedSubjectName = computed(() => {
  if (QuestionStore.newQuestion.subject_id === null) {
    return 'Тематика не выбрана'
  }

  if (SubjectStore.selectSubject !== null) {
    return SubjectStore.selectSubject.name.split('_').join(' ')
  }

  return `Выбранная тематика: ${QuestionStore.currentQuestion.subject_name.split('_').join(' ')}`
})

const hasSelectedSubject = computed(() => {
  return QuestionStore.newQuestion.subject_id !== null
})

const subjectIcon = computed(() => {
  return hasSelectedSubject.value ? 'fa-check-circle' : 'fa-folder-open'
})

const subjectIconColor = computed(() => {
  return hasSelectedSubject.value ? 'text-green-500' : 'text-blue-500'
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-neutral-900">
    <!-- Compact Header -->
    <div class="flex-shrink-0 px-6 py-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        Выберите тематику
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Определите категорию, к которой будет относиться ваш вопрос
      </p>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-6">
      <div class="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Subject Tree -->
        <div class="lg:col-span-3 h-full">
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
            <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i class="fa fa-list text-blue-500 text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Дерево тематик
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Выберите категорию из списка
                  </p>
                </div>
              </div>
            </div>

            <!-- Tree Container with proper scrolling -->
            <div class="flex-1 overflow-hidden">
              <div class="h-full overflow-y-auto p-4">
                <Suspense>
                  <template #default>
                    <SubjectTreeComponent
                        :subjects="SubjectStore.newSubjectsStruct"
                        :select="nodeSelected"
                    />
                  </template>
                  <template #fallback>
                    <div class="flex items-center justify-center h-40">
                      <div class="text-center">
                        <div class="loading-spinner mx-auto mb-4"></div>
                        <p class="text-gray-500 dark:text-gray-400">Загрузка тематик...</p>
                      </div>
                    </div>
                  </template>
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <!-- Selection Info -->
        <div class="lg:col-span-1 h-full">
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
            <!-- Selection Status -->
            <div class="flex-1 flex flex-col justify-center p-6 text-center">
              <div class="mb-6">
                <div class="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                     :class="hasSelectedSubject ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-neutral-700'">
                  <i class="fa text-3xl" :class="[subjectIcon, subjectIconColor]" style="font-size: 30px"></i>
                </div>

                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {{ selectedSubjectName }}
                </h3>

                <p v-if="!hasSelectedSubject" class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Выберите тематику из дерева слева для продолжения
                </p>

              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex-shrink-0 p-4 space-y-2">
              <el-button
                  v-if="hasSelectedSubject"
                  type="primary"
                  size="large"
                  @click="next"
                  class="w-full h-10 font-semibold primary-action"
              >
                <i class="fa fa-arrow-right mr-2"></i>
                Продолжить
              </el-button>
              <div></div>
              <el-button
                  type="default"
                  size="large"
                  @click="back"
                  class="w-full h-10 font-semibold secondary-action"
              >
                <i class="fa fa-arrow-left mr-2"></i>
                Назад
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.primary-action {
  background: #10b981;
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary-action:hover {
  background: #059669;
  transform: translateY(-1px);
}

.secondary-action {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.secondary-action:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark theme */
:deep(.dark .secondary-action) {
  background: #262626;
  border-color: #404040;
  color: #d1d5db;
}

:deep(.dark .secondary-action:hover) {
  background: #404040;
  border-color: #525252;
}

/* Scrollbar styling for tree */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark theme scrollbar */
:deep(.dark) .overflow-y-auto::-webkit-scrollbar-track {
  background: #262626;
}

:deep(.dark) .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #525252;
}

:deep(.dark) .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #737373;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  .lg\:col-span-3,
  .lg\:col-span-1 {
    grid-column: span 1;
  }

  .grid {
    grid-template-rows: 1fr auto;
    gap: 4px;
  }
}
</style>