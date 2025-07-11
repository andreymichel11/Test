<script setup>
import { computed } from 'vue'
import { useQuestionStore } from '../../../store/QuestionStore.js'

const QuestionStore = useQuestionStore()

const props = defineProps({
  next: {
    type: Function,
    required: true
  },
  home: {
    type: Function,
    required: true
  }
})

const findTypeById = (id) => {
  return QuestionStore.types.find(item => item.id === id)
}

const selectedType = computed(() => {
  if (!QuestionStore.newQuestion.type_id) return null
  return findTypeById(QuestionStore.newQuestion.type_id)
})

const typeDescription = computed(() => {
  if (!selectedType.value) return ''

  const descriptions = {
    'Текст': 'Данный тип вопроса позволяет вводить ответ в произвольной письменной форме',
    'Тест': 'Данный тип вопроса позволяет выбирать один или несколько ответов из представленных вариантов',
    'Сопоставление': 'Данный тип вопроса позволяет сопоставлять значения из одной таблицы с значениями из другой'
  }

  return descriptions[selectedType.value.name] || 'Описание недоступно'
})

const typeIcon = computed(() => {
  if (!selectedType.value) return 'fa-question-circle'

  const icons = {
    'Текст': 'fa-keyboard-o',
    'Тест': 'fa-list',
    'Сопоставление': 'fa-exchange'
  }

  return icons[selectedType.value.name] || 'fa-question-circle'
})

const formattedTypes = computed(() => {
  return QuestionStore.types.map(type => ({
    ...type,
    displayName: type.name.charAt(0).toUpperCase() + type.name.slice(1),
    icon: {
      'Текст': 'fa-keyboard-o',
      'Тест': 'fa-list',
      'Сопоставление': 'fa-exchange'
    }[type.name] || 'fa-question-circle'
  }))
})

const canContinue = computed(() => {
  return QuestionStore.newQuestion.type_id !== null
})

const backButtonText = computed(() => {
  return QuestionStore.isCreateQuestionOpened ? 'Вернуться к тематикам' : 'Вернуться на главную'
})
</script>

<template>
  <div class="h-auto flex flex-col">
    <!-- Content Container -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-4xl">
        <!-- Compact Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Выберите тип вопроса
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Определите формат ответа, который будет использоваться в вашем вопросе
          </p>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Type Selection -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Тип вопроса
              </label>
              <el-select
                  v-model="QuestionStore.newQuestion.type_id"
                  size="large"
                  placeholder="Выберите тип вопроса"
                  class="w-full type-select"
              >
                <el-option
                    v-for="type in formattedTypes"
                    :key="type.id"
                    :label="type.displayName"
                    :value="type.id"
                    class="type-option"
                >
                  <div class="flex items-center gap-3 py-2">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <i class="fa text-blue-500 text-sm dark:text-white" :class="type.icon"></i>
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900 dark:text-white">{{ type.displayName }}</div>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 mt-6">
              <el-button
                  v-if="canContinue"
                  type="primary"
                  size="large"
                  @click="next"
                  class="action-button primary-action h-11 font-semibold"
              >
                <i class="fa fa-arrow-right mr-2"></i>
                Продолжить
              </el-button>
              <div></div>
              <el-button
                  type="default"
                  size="large"
                  @click="home"
                  class="action-button secondary-action h-11 font-semibold"
              >
                <i class="fa fa-arrow-left mr-2"></i>
                {{ backButtonText }}
              </el-button>
            </div>
          </div>

          <!-- Type Description -->
          <div v-if="canContinue" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fa text-white text-lg" :class="typeIcon"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  {{ selectedType?.displayName }}
                </h3>
                <p class="text-blue-800 dark:text-blue-200 leading-relaxed">
                  {{ typeDescription }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl p-8 text-center">
            <div class="w-16 h-16 bg-gray-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-question-circle text-gray-400 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Описание типа
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Выберите тип вопроса, чтобы увидеть подробное описание
            </p>
          </div>
        </div>

        <!-- Help Section -->
        <div class="mt-8 text-center">
          <div class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <i class="fa fa-info-circle"></i>
            <span>Тип вопроса нельзя будет изменить после создания</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-button {
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.primary-action {
  background: #3b82f6;
  border: none;
  color: white;
}

.primary-action:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.secondary-action {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.secondary-action:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Element Plus Select Styling */
:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: #3b82f6;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #3b82f6;
}

:deep(.el-option) {
  padding: 8px 12px;
  margin: 2px 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.el-option:hover) {
  background: #f8fafc;
}

:deep(.el-option.selected) {
  background: #eff6ff;
  color: #1d4ed8;
}

/* Dark theme */
:deep(.dark .el-select .el-input__wrapper) {
  background: #262626;
  border-color: #404040;
}

:deep(.dark .secondary-action) {
  background: #262626;
  border-color: #404040;
  color: #d1d5db;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}

.type-option {
  height: 100%;
}
</style>
