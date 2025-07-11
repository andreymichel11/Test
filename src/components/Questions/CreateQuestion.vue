<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useQuestionStore } from '../../store/QuestionStore.js'
import NewQuestion from '../../views/NewQuestion.vue'

const QuestionStore = useQuestionStore()

const isLoading = computed(() => {
  return QuestionStore.isLoading || false
})

const hasUnsavedChanges = computed(() => {
  return QuestionStore.hasUnsavedChanges || false
})

// Методы жизненного цикла
onMounted(() => {
  if (QuestionStore.isCreateQuestionOpened) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

watch(() => QuestionStore.isCreateQuestionOpened, (isOpened) => {
  if (isOpened) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

const handleBeforeClose = (done) => {
  if (hasUnsavedChanges.value) {
    ElMessageBox.confirm(
        'У вас есть несохраненные изменения. Вы уверены, что хотите закрыть?',
        'Внимание',
        {
          confirmButtonText: 'Да, закрыть',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }
    ).then(() => {
      done()
    }).catch(() => {
      // Отменить закрытие
    })
  } else {
    done()
  }
}
</script>

<template>
  <el-dialog
      title="Добавить новый вопрос"
      v-model="QuestionStore.isCreateQuestionOpened"
      width="95%"
      top="20px"
      center
      destroy-on-close
      append-to-body
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleBeforeClose"
      class="create-question-dialog max-w-6xl"
  >
    <!-- Header Content -->
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <i class="fa fa-plus-circle text-blue-500 text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white text-left">Добавить новый вопрос</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Создайте качественный вопрос для тестирования</p>
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div class="loading-spinner"></div>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Загрузка...</span>
        </div>
      </div>
    </template>

    <!-- Main Content -->
    <div class="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
      <!-- Info Banner -->
      <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <i class="fa fa-lightbulb text-yellow-500 mt-1"></i>
          <div>
            <h4 class="text-base font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Создание вопроса
            </h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              Заполните все необходимые поля для создания полноценного вопроса.
              <span class="hidden sm:inline">Убедитесь, что вопрос понятен и имеет четкие варианты ответов.</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Content Container -->
      <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[400px]">
        <Suspense>
          <template #default>
            <NewQuestion />
          </template>
          <template #fallback>
            <div class="flex items-center justify-center min-h-[400px]">
              <div class="text-center max-w-xs">
                <div class="large-spinner mx-auto mb-6"></div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Загрузка формы
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Подготавливаем интерфейс для создания вопроса...
                </p>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex items-center justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <i class="fa fa-info-circle text-blue-500 mr-2"></i>
          <span>Все поля обязательны для заполнения</span>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.create-question-dialog {
  border-radius: 12px;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.large-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Element Plus Overrides */
:deep(.el-dialog) {
  margin: 16px;
  max-height: calc(100vh - 32px);
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
}

:deep(.el-dialog__title) {
  display: none;
}

/* Dark theme for Element Plus */
:deep(.dark .el-dialog__header) {
  border-bottom-color: #374151;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :deep(.el-dialog) {
    margin: 8px;
    max-height: calc(100vh - 16px);
  }

  :deep(.el-dialog__header) {
    padding: 16px 16px 12px;
  }

  :deep(.el-dialog__body) {
    padding: 16px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 16px 16px;
  }
}
</style>