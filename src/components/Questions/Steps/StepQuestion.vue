<script setup>
import { computed, ref, watch } from 'vue'
import hljs from 'highlight.js'
import { useQuestionStore } from '../../../store/QuestionStore.js'
import { useSubjectStore } from '../../../store/SubjectStore.js'
import QuestionCompare from './QuestionType/QuestionCompare.vue'
import QuestionText from './QuestionType/QuestionText.vue'
import QuestionTest from './QuestionType/QuestionTest.vue'

const QuestionStore = useQuestionStore()
const SubjectStore = useSubjectStore()

const props = defineProps({
  back: {
    type: Function,
    required: true
  },
  save: {
    type: Function,
    required: true
  },
  isUpdate: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const isCode = ref(false)

const selectedSubjectName = computed(() => {
  if (SubjectStore.selectSubject !== null) {
    return SubjectStore.selectSubject.name.split('_').join(' ')
  }
  return QuestionStore.currentQuestion.subject_name.split('_').join(' ')
})

const selectedTypeName = computed(() => {
  const type = QuestionStore.types.find(item => item.id === QuestionStore.newQuestion.type_id)
  return type ? type.name.charAt(0).toUpperCase() + type.name.slice(1) : ''
})

const typeIcon = computed(() => {
  const type = selectedTypeName.value.toLowerCase()
  const icons = {
    'текст': 'fa-keyboard',
    'тест': 'fa-list-ul',
    'сопоставление': 'fa-exchange-alt'
  }
  return icons[type] || 'fa-question-circle'
})

const canAddCode = computed(() => {
  return selectedTypeName.value.toLowerCase() !== 'сопоставление'
})

const questionComponent = computed(() => {
  const type = selectedTypeName.value.toLowerCase()
  const components = {
    'сопоставление': QuestionCompare,
    'текст': QuestionText,
    'тест': QuestionTest
  }
  return components[type] || QuestionTest
})

const canSave = computed(() => {
  const hasAnswers = Object.keys(QuestionStore.newQuestion.answer.answer).length > 0
  const hasText = QuestionStore.newQuestion.text.trim() !== ''
  return hasAnswers && hasText
})

const inputHighlight = () => {
  const codeElement = document.querySelector("code")
  if (codeElement) {
    codeElement.removeAttribute('data-highlighted')
    hljs.highlightAll()
  }
}

const programmingLanguages = [
  ['cpp', 'C++'],
  ['python', 'Python'],
  ['php', 'PHP'],
  ['go', 'Go'],
  ['c', 'C'],
  ['javascript', 'JavaScript'],
  ['sql', 'SQL']
]

// Watchers
watch(
    () => props.isUpdate,
    () => {
      isCode.value = QuestionStore.newQuestion.code !== undefined && QuestionStore.newQuestion.code.length > 0
    },
    { immediate: true }
)

watch(
    isCode,
    (newIsCode) => {
      if (!newIsCode) {
        QuestionStore.newQuestion.code = ''
      }
    },
    { deep: true }
)
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-neutral-900">
    <!-- Compact Header -->
    <div class="flex-shrink-0 px-6 py-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Создание вопроса
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Заполните все необходимые поля
          </p>
        </div>

        <!-- Question Info Cards -->
        <div class="hidden md:flex items-center gap-4">
          <!-- Type Card -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <i class="fa text-white text-xs" :class="typeIcon"></i>
              </div>
              <div>
                <p class="text-xs text-blue-600 dark:text-blue-400">Тип</p>
                <p class="text-sm font-medium text-blue-900 dark:text-blue-100">{{ selectedTypeName }}</p>
              </div>
            </div>
          </div>

          <!-- Subject Card -->
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <i class="fa fa-folder text-white text-xs"></i>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-green-600 dark:text-green-400">Тематика</p>
                <p class="text-sm font-medium text-green-900 dark:text-green-100 truncate" style="max-width: 120px;" :title="selectedSubjectName">{{ selectedSubjectName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4">
      <div class="h-full flex flex-col gap-4">
        <!-- Question Text Section -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-4 flex-shrink-0">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Текст вопроса *
          </label>
          <el-input
              v-model="QuestionStore.newQuestion.text"
              type="textarea"
              :rows="3"
              size="large"
              placeholder="Введите текст вашего вопроса..."
              class="question-input"
              maxlength="1000"
              show-word-limit
          />

          <!-- Code Option -->
          <div v-if="canAddCode" class="mt-4">
            <el-checkbox
                v-model="isCode"
                size="large"
                class="code-checkbox"
            >
              <span class="flex items-center gap-2">
                <i class="fa fa-code"></i>
                <span class="font-medium">Добавить программный код</span>
              </span>
            </el-checkbox>
          </div>
        </div>

        <!-- Content Layout -->
        <div class="flex-1 overflow-hidden">
          <div class="h-full grid gap-4" :class="isCode ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1'">

            <!-- Code Editor -->
            <div v-if="isCode" class="xl:col-span-2 h-full">
              <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden h-full flex flex-col">
                <div class="p-3 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 flex-shrink-0">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                      <i class="fa fa-code text-white text-xs"></i>
                    </div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Редактор кода</h3>
                  </div>
                </div>
                <div class="flex-1 overflow-hidden">
                  <code-editor
                      class="code-editor h-full"
                      font-size="14px"
                      v-model="QuestionStore.newQuestion.code"
                      @input="inputHighlight"
                      :languages="programmingLanguages"
                  />
                </div>
              </div>
            </div>

            <!-- Question Type Component -->
            <div :class="isCode ? 'xl:col-span-3' : 'xl:col-span-5'" class="h-full">
              <div class="h-full bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden flex flex-col">
                <div class="p-3 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 flex-shrink-0">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                      <i class="fa text-white text-xs" :class="typeIcon"></i>
                    </div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Настройка ответов</h3>
                  </div>
                </div>
                <div class="flex-1 overflow-hidden p-4">
                  <Suspense>
                    <template #default>
                      <component
                          :is="questionComponent"
                          :is-update="isUpdate"
                          :is-code="isCode"
                          class="h-full"
                      />
                    </template>
                    <template #fallback>
                      <div class="flex items-center justify-center h-40">
                        <div class="text-center">
                          <div class="loading-spinner mx-auto mb-4"></div>
                          <p class="text-gray-500 dark:text-gray-400">Загрузка компонента...</p>
                        </div>
                      </div>
                    </template>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with Actions -->
    <div class="flex-shrink-0 p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
      <div class="flex items-center justify-between">
        <!-- Progress Indicator -->
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-1">
            <i class="fa fa-check-circle" :class="QuestionStore.newQuestion.text.trim() ? 'text-green-500' : 'text-gray-400'"></i>
            <span class="text-xs" :class="QuestionStore.newQuestion.text.trim() ? 'text-green-700 dark:text-green-400' : 'text-gray-500'">
              Текст
            </span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa fa-check-circle" :class="Object.keys(QuestionStore.newQuestion.answer.answer).length > 0 ? 'text-green-500' : 'text-gray-400'"></i>
            <span class="text-xs" :class="Object.keys(QuestionStore.newQuestion.answer.answer).length > 0 ? 'text-green-700 dark:text-green-400' : 'text-gray-500'">
              Ответы
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <el-button
              type="default"
              size="large"
              @click="back"
              :disabled="isLoading"
              class="secondary-action h-10 px-6 font-semibold"
          >
            <i class="fa fa-arrow-left mr-2"></i>
            Назад
          </el-button>

          <el-button
              v-if="canSave"
              type="primary"
              size="large"
              @click="save"
              :loading="isLoading"
              :disabled="!canSave || isLoading"
              class="primary-action h-10 px-6 font-semibold"
          >
            <i class="fa fa-save mr-2"></i>
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </el-button>
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
  border-top: 2px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.primary-action {
  background: #8b5cf6;
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary-action:hover:not(:disabled) {
  background: #7c3aed;
  transform: translateY(-1px);
}

.primary-action:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.secondary-action {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.secondary-action:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.code-checkbox {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.code-checkbox:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Element Plus Input Styling */
:deep(.question-input .el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
}

:deep(.question-input .el-textarea__inner:hover) {
  border-color: #8b5cf6;
}

:deep(.question-input .el-textarea__inner:focus) {
  border-color: #8b5cf6;
}

/* Dark theme */
:deep(.dark .code-checkbox) {
  background: #262626;
  border-color: #404040;
}

:deep(.dark .code-checkbox:hover) {
  background: #404040;
  border-color: #525252;
}

:deep(.dark .question-input .el-textarea__inner) {
  background: #262626;
  border-color: #404040;
  color: #f9fafb;
}

:deep(.dark .secondary-action) {
  background: #262626;
  border-color: #404040;
  color: #d1d5db;
}

:deep(.dark .secondary-action:hover:not(:disabled)) {
  background: #404040;
  border-color: #525252;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 1280px) {
  .xl\:col-span-2,
  .xl\:col-span-3,
  .xl\:col-span-5 {
    grid-column: span 1;
  }
}
</style>