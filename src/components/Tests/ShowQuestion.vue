<script setup>
import { useTestStore } from "../../store/TestStore.js";
import { useQuestionStore } from "../../store/QuestionStore.js";
import { computed, onUnmounted } from "vue";
import QuestionInfo from "../Subject/QuestionInfo/QuestionInfo.vue";
import Question from "../Subject/QuestionInfo/Question.vue";

const TestStore = useTestStore()
const QuestionStore = useQuestionStore()

const hasQuestion = computed(() => {
  return QuestionStore.currentQuestion !== null &&
      Object.keys(QuestionStore.currentQuestion).length > 0
})

const questionType = computed(() => {
  if (!hasQuestion.value) return null
  return QuestionStore.currentQuestion.type || 'Неизвестно'
})

const questionSubject = computed(() => {
  if (!hasQuestion.value) return null
  return QuestionStore.currentQuestion.subject_name?.split('_').join(' ') || 'Не указана'
})

onUnmounted(() => {
  QuestionStore.currentQuestion = {}
})

const close = () => {
  QuestionStore.currentQuestion = {}
  TestStore.setShowIsOpened()
}
</script>

<template>
  <el-dialog
      v-model="TestStore.showIsOpened"
      :before-close="close"
      width="95%"
      top="2vh"
      class="question-dialog"
      :show-close="false"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <i class="fa fa-eye text-blue-500 text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Просмотр вопроса
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ hasQuestion ? 'Детальная информация о выбранном вопросе' : 'Загрузка...' }}
            </p>
          </div>
        </div>

        <!-- Question Meta Info -->
        <div v-if="hasQuestion" class="hidden md:flex items-center gap-3">
          <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <i class="fa fa-tag text-white text-xs"></i>
              </div>
              <div>
                <p class="text-xs text-purple-600 dark:text-purple-400">Тип</p>
                <p class="text-sm font-medium text-purple-900 dark:text-purple-100">
                  {{ questionType.name }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <i class="fa fa-folder text-white text-xs"></i>
              </div>
              <div>
                <p class="text-xs text-green-600 dark:text-green-400">Тематика</p>
                <p class="text-sm font-medium text-green-900 dark:text-green-100 truncate max-w-32" :title="questionSubject">
                  {{ questionSubject }}
                </p>
              </div>
            </div>
          </div>

          <el-button
              type="danger"
              circle
              @click="close"
              class="close-button"
          >
            <i class="fa fa-times"></i>
          </el-button>
        </div>

        <!-- Mobile close button -->
        <el-button
            v-else
            type="danger"
            circle
            @click="close"
            class="close-button md:hidden"
        >
          <i class="fa fa-times"></i>
        </el-button>
      </div>
    </template>

    <!-- Dialog Content -->
    <div class="dialog-content">
      <div v-if="hasQuestion" class="h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
        <!-- Question Info -->
        <div class="flex-1 flex flex-col min-h-0">
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
            <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i class="fa fa-info-circle text-blue-500 text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Информация о вопросе
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Детали и метаданные
                  </p>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4">
              <QuestionInfo :question="QuestionStore.currentQuestion"/>
            </div>
          </div>
        </div>

        <!-- Question Content -->
        <div class="flex-1 flex flex-col min-h-0">
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
            <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <i class="fa fa-question-circle text-purple-500 text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Содержание вопроса
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Текст и варианты ответов
                  </p>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4">
              <Question :question="QuestionStore.currentQuestion"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i class="fa fa-spinner fa-spin text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Загрузка вопроса
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Пожалуйста, подождите...
          </p>
        </div>
      </div>
    </div>

    <!-- Custom Footer -->
    <template #footer>
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <i class="fa fa-info-circle mr-2"></i>
          Для закрытия нажмите на крестик или клавишу Escape
        </div>

        <el-button
            type="primary"
            @click="close"
            class="action-button"
        >
          <i class="fa fa-times mr-2"></i>
          Закрыть
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
/* Dialog customization */
:deep(.question-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.question-dialog .el-dialog__header) {
  padding: 0;
  margin: 0;
}

:deep(.question-dialog .el-dialog__body) {
  padding: 0;
  height: 80vh;
  overflow: hidden;
}

:deep(.question-dialog .el-dialog__footer) {
  padding: 0;
  margin: 0;
}

.dialog-content {
  height: 80vh;
  background: inherit;
}

:deep(.dark) .dialog-content {
  background: #0f172a;
}

.close-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  transform: translateY(-1px);
}

:deep(.dark) .close-button {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fca5a5;
}

:deep(.dark) .close-button:hover {
  background: #991b1b;
  border-color: #b91c1c;
}

.action-button {
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

/* Scrollbar styling */
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
  .dialog-content {
    height: 85vh;
    padding: 16px;
  }

  :deep(.question-dialog .el-dialog__body) {
    height: 85vh;
  }
}

@media (max-width: 640px) {
  .dialog-content {
    height: 90vh;
    padding: 12px;
  }

  :deep(.question-dialog .el-dialog__body) {
    height: 90vh;
  }
}
</style>