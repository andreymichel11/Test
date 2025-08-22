<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useModerateStore } from '../../store/ModerateStore.js'
import ModerateComponent from './ModerateComponent.vue'

const moderateStore = useModerateStore()

const isDialogOpen = computed({
  get: () => moderateStore.isModerateOpened,
  set: (value) => {
    moderateStore.isModerateOpened = value
  }
})

const isLoading = computed(() => {
  return moderateStore.isLoading || false
})

// Методы жизненного цикла
onMounted(() => {
  if (moderateStore.isModerateOpened) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

watch(() => moderateStore.isModerateOpened, (isOpened) => {
  if (isOpened) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

const handleBeforeClose = (done) => {
  done()
}
</script>

<template>
  <el-dialog
      title="Модерация вопроса"
      v-model="isDialogOpen"
      width="95%"
      top="20px"
      center
      destroy-on-close
      append-to-body
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleBeforeClose"
      class="moderate-dialog max-w-7xl"
  >
    <!-- Header Content -->
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
          <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                      bg-gradient-to-br from-orange-500 to-orange-600
                      rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
            <i class="fa fa-gavel text-white text-lg sm:text-xl md:text-2xl"></i>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold 
                       text-gray-900 dark:text-white text-left leading-tight">
              Модерация вопроса
            </h2>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
              Проверьте вопрос и примите решение о его публикации
            </p>
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div class="loading-spinner"></div>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Загрузка...</span>
        </div>
      </div>
    </template>

    <!-- Main Content -->
    <div class="space-y-6 max-h-[calc(90vh)] overflow-y-auto">
      <!-- Info Banner -->
      <div class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 
                  border border-orange-200 dark:border-orange-700 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <i class="fa fa-exclamation-triangle text-orange-500 mt-1"></i>
          <div>
            <h4 class="text-base font-semibold text-orange-800 dark:text-orange-200 mb-1">
              Модерация контента
            </h4>
            <p class="text-sm text-orange-700 dark:text-orange-300">
              Внимательно проверьте содержание вопроса и оставьте обоснованный комментарий.
              <span class="hidden sm:inline">Убедитесь в корректности формулировки и соответствии тематике.</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Content Container -->
      <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[400px]">
        <ModerateComponent />
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex items-center justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <i class="fa fa-info-circle text-orange-500 mr-2"></i>
          <span>Комментарий модератора обязателен для заполнения</span>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.moderate-dialog {
  border-radius: 12px;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #ea580c;
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
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.el-dialog__header) {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #f9fafb;
}

:deep(.el-dialog__body) {
  padding: 24px;
  background: white;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  background: #f9fafb;
}

:deep(.el-dialog__title) {
  display: none;
}

:deep(.el-dialog__close) {
  color: #6b7280;
  font-size: 18px;
}

:deep(.el-dialog__close:hover) {
  color: #374151;
}

/* Dark theme for Element Plus */
:deep(.dark .el-dialog) {
  background: #1f2937;
  border: 1px solid #374151;
}

:deep(.dark .el-dialog__header) {
  border-bottom-color: #374151;
  background: #111827;
}

:deep(.dark .el-dialog__body) {
  background: #1f2937;
}

:deep(.dark .el-dialog__footer) {
  background: #111827;
}

:deep(.dark .el-dialog__close) {
  color: #9ca3af;
}

:deep(.dark .el-dialog__close:hover) {
  color: #d1d5db;
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

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 95vw !important;
    margin: 8px auto;
  }
}

@media (max-width: 360px) {
  :deep(.el-dialog) {
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}
</style>