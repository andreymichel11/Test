<script setup>
import { reactive, computed } from 'vue'
import { useSubjectStore } from '../../store/SubjectStore.js'

const SubjectStore = useSubjectStore()

const props = defineProps({
  isTop: {
    type: Boolean,
    default: false
  }
})

const newSubject = reactive({
  name: '',
  description: '',
  parent_id: null
})

const dialogTitle = computed(() => {
  return props.isTop ? 'Создать корневую тематику' : 'Создать подтематику'
})

const canCreate = computed(() => {
  return newSubject.name.trim().length > 0
})

const isLoading = computed(() => {
  return SubjectStore.isLoading || false
})

const resetForm = () => {
  newSubject.name = ''
  newSubject.description = ''
  newSubject.parent_id = null
}

const close = () => {
  resetForm()
  SubjectStore.setCreateIsOpened()
}

const createSubject = async () => {
  if (!canCreate.value || isLoading.value) return

  try {
    if (!props.isTop) {
      newSubject.parent_id = SubjectStore.selectSubject?.id
    }

    await SubjectStore.addSubject(newSubject)
    close()
  } catch (error) {
    console.error('Ошибка при создании тематики:', error)
  }
}
</script>

<template>
  <el-dialog
      :title="dialogTitle"
      v-model="SubjectStore.createIsOpened"
      :before-close="close"
      center
      width="90%"
      class="create-subject-dialog max-w-md"
      destroy-on-close
      append-to-body
  >
    <div class="space-y-6">
      <!-- Info Banner -->
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <i class="fa fa-info-circle text-blue-500 mt-1"></i>
          <div>
            <h4 class="text-base font-semibold text-blue-800 dark:text-blue-200 mb-1">
              {{ isTop ? 'Новая корневая тематика' : 'Новая подтематика' }}
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ isTop ? 'Создайте основную категорию для организации вопросов' : 'Добавьте подкатегорию к выбранной тематике' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <el-form label-position="top" class="space-y-6">
        <!-- Subject Name -->
        <el-form-item label="Название тематики" required>
          <el-input
              v-model="newSubject.name"
              size="large"
              placeholder="Введите название тематики"
              maxlength="100"
              show-word-limit
              clearable
              autofocus
              class="w-full"
          />
        </el-form-item>

        <!-- Description -->
        <el-form-item label="Описание (опционально)">
          <el-input
              v-model="newSubject.description"
              type="textarea"
              :rows="3"
              placeholder="Краткое описание тематики"
              maxlength="500"
              show-word-limit
              resize="none"
              class="w-full"
          />
        </el-form-item>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <el-button
              type="primary"
              size="large"
              :disabled="!canCreate"
              :loading="isLoading"
              @click="createSubject"
              class="flex-1 h-12 font-semibold"
          >
            <i class="fa fa-plus mr-2"></i>
            {{ isLoading ? 'Создание...' : 'Добавить тематику' }}
          </el-button>

          <el-button
              type="default"
              size="large"
              @click="close"
              :disabled="isLoading"
              class="flex-1 h-12 font-semibold"
          >
            <i class="fa fa-times mr-2"></i>
            Отмена
          </el-button>
        </div>
      </el-form>

      <!-- Mobile Helper -->
      <div class="sm:hidden bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 text-center">
        <div class="flex items-center justify-center text-sm text-yellow-700 dark:text-yellow-300">
          <i class="fa fa-lightbulb mr-2"></i>
          <span>Нажмите Enter для быстрого создания</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.create-subject-dialog {
  border-radius: 12px;
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

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

/* Dark theme */
:deep(.dark .el-dialog__header) {
  border-bottom-color: #374151;
}

:deep(.dark .el-dialog__title) {
  color: #f9fafb;
}

:deep(.dark .el-form-item__label) {
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

  :deep(.el-dialog__title) {
    font-size: 16px;
  }
}
</style>
