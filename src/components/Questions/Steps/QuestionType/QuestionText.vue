<script setup>
import { ref, watch } from 'vue'
import { useQuestionStore } from '../../../../store/QuestionStore.js'

const QuestionStore = useQuestionStore()

const props = defineProps({
  isUpdate: {
    type: Boolean,
    default: false
  }
})

const answer = ref('')

// Watchers
watch(answer, (newAnswer) => {
  QuestionStore.newQuestion.answer.answer.splice(0)
  if (newAnswer.trim() !== '') {
    QuestionStore.newQuestion.answer.answer.push(newAnswer.trim())
  }
})

watch(
    () => props.isUpdate,
    () => {
      if (props.isUpdate && QuestionStore.newQuestion.answer.answer.length > 0) {
        answer.value = QuestionStore.newQuestion.answer.answer[0] || ''
      }
    },
    { immediate: true }
)
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Instructions -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex-shrink-0 mb-4">
      <div class="flex items-start gap-3">
        <i class="fa fa-keyboard text-blue-500 mt-1"></i>
        <div>
          <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Текстовый ответ
          </h4>
          <p class="text-sm text-blue-800 dark:text-blue-200">
            Введите пример правильного ответа. Студенты смогут вводить ответ в свободной форме.
          </p>
        </div>
      </div>
    </div>

    <!-- Answer Input Section -->
    <div class="flex-1 flex flex-col min-h-0">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex-shrink-0">
        Пример правильного ответа *
      </label>

      <div class="flex-1 flex flex-col min-h-0">
        <el-input
            v-model="answer"
            type="textarea"
            placeholder="Введите пример правильного ответа или ключевые слова..."
            maxlength="1000"
            show-word-limit
            class="answer-input flex-1"
            resize="none"
        />
      </div>
    </div>

    <!-- Recommendations -->
    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mt-4 flex-shrink-0">
      <div class="flex items-start gap-2">
        <i class="fa fa-lightbulb text-yellow-600 mt-0.5"></i>
        <div class="text-sm text-yellow-700 dark:text-yellow-300">
          <p class="font-medium mb-1">Рекомендации:</p>
          <ul class="space-y-1 text-xs">
            <li>• Укажите наиболее полный и точный ответ</li>
            <li>• Можно указать ключевые слова через запятую</li>
            <li>• Избегайте слишком конкретных формулировок</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="answer.trim()" class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mt-4 flex-shrink-0">
      <div class="flex items-center gap-2 mb-2">
        <i class="fa fa-eye text-green-600 text-sm"></i>
        <h4 class="text-sm font-semibold text-green-900 dark:text-green-100">Предварительный просмотр</h4>
      </div>
      <div class="bg-white dark:bg-green-900/20 border border-green-300 dark:border-green-600 rounded p-3">
        <p class="text-green-800 dark:text-green-200 font-medium text-sm leading-relaxed">
          "{{ answer }}"
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Element Plus Input Styling */
:deep(.answer-input) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.answer-input .el-textarea) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.answer-input .el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  resize: none;
  height: 100% !important;
  min-height: 120px;
  flex: 1;
}

:deep(.answer-input .el-textarea__inner:hover) {
  border-color: #10b981;
}

:deep(.answer-input .el-textarea__inner:focus) {
  border-color: #10b981;
}

:deep(.answer-input .el-input__count) {
  background: transparent;
  font-size: 11px;
  color: #6b7280;
  position: absolute;
  bottom: 8px;
  right: 8px;
}

/* Dark theme */
:deep(.dark .answer-input .el-textarea__inner) {
  background: #262626;
  border-color: #404040;
  color: #f9fafb;
}

:deep(.dark .answer-input .el-input__count) {
  color: #9ca3af;
}
</style>
