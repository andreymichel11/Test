<script setup>
import { reactive, computed } from "vue";
import { useQuestionStore } from "../../store/QuestionStore.js";
import QuestionBlock from "../Subject/QuestionInfo/QuestionBlock.vue";
import {useModerateStore} from "../../store/ModerateStore.js";

const QuestionStore = useQuestionStore()
const moderateStore = useModerateStore()
const moderate = reactive({
  approve: false,
  comment: ''
})

const canSubmit = computed(() => {
  return moderate.comment.trim().length > 0
})

const isLoading = reactive({
  approve: false,
  reject: false
})

const submit = async (status) => {
  const action = status ? 'approve' : 'reject'

  try {
    isLoading[action] = true
    moderate.approve = status
    await QuestionStore.moderateQuestion(moderate)

    // Сброс формы после успешной отправки
    moderate.comment = ''
    moderate.approve = false
  } catch (error) {
    console.error('Ошибка модерации:', error)
  } finally {
    isLoading[action] = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Question Content -->
    <div class=" overflow-y-auto mb-6 p-2" v-if="!moderateStore.isModerateOpened">
      <div class="bg-gray-50 dark:bg-neutral-900/50 rounded-xl p-4 border border-gray-200 dark:border-neutral-700">
        <QuestionBlock />
      </div>
    </div>

    <!-- Moderation Form -->
    <div class="flex-shrink-0 space-y-6">
      <!-- Comment Section -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3">
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fa fa-comment text-white text-lg"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-md font-semibold text-blue-900 dark:text-blue-100 ">
              Комментарий модератора
            </h3>
            <p class="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Оставьте комментарий с обоснованием вашего решения
            </p>

            <el-input
                v-model="moderate.comment"
                type="textarea"
                :rows="4"
                placeholder="Укажите причину одобрения или отказа, замечания по содержанию..."
                maxlength="500"
                show-word-limit
                class="moderate-input"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <i class="fa fa-gavel text-orange-500"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Принять решение
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Выберите действие для данного вопроса
              </p>
            </div>
          </div>

          <!-- Status Indicator -->
          <div v-if="!canSubmit" class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <i class="fa fa-exclamation-triangle text-yellow-500"></i>
            <span>Комментарий обязателен</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Approve Button -->
          <el-button
              size="large"
              type="success"
              @click="submit(true)"
              :disabled="!canSubmit"
              :loading="isLoading.approve"
              class="approve-button h-12 px-8 font-semibold flex-1"
          >
            <i class="fa fa-check mr-2"></i>
            {{ isLoading.approve ? 'Одобрение...' : 'Одобрить вопрос' }}
          </el-button>

          <!-- Reject Button -->
          <el-button
              size="large"
              type="danger"
              @click="submit(false)"
              :disabled="!canSubmit"
              :loading="isLoading.reject"
              class="reject-button h-12 px-8 font-semibold flex-1"
          >
            <i class="fa fa-times mr-2"></i>
            {{ isLoading.reject ? 'Отклонение...' : 'Отклонить вопрос' }}
          </el-button>
        </div>

        <!-- Help Text -->
        <div class="mt-4 bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <i class="fa fa-info-circle text-blue-500 mt-0.5"></i>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <p class="font-medium mb-1">Рекомендации по модерации:</p>
              <ul class="space-y-1 text-xs">
                <li>• Проверьте корректность формулировки вопроса</li>
                <li>• Убедитесь в правильности вариантов ответов</li>
                <li>• Оцените соответствие тематике</li>
                <li>• Укажите конкретные замечания в комментарии</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Action buttons styling */
.approve-button {
  background: #10b981;
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.approve-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.approve-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.reject-button {
  background: #ef4444;
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.reject-button:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.reject-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Element Plus Input Styling */
:deep(.moderate-input .el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #bfdbfe;
  background: white;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
}

:deep(.moderate-input .el-textarea__inner:hover) {
  border-color: #3b82f6;
}

:deep(.moderate-input .el-textarea__inner:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.moderate-input .el-input__count) {
  background: transparent;
  font-size: 11px;
  color: #6b7280;
}

/* Dark theme */
:deep(.dark .moderate-input .el-textarea__inner) {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

:deep(.dark .moderate-input .el-textarea__inner:hover) {
  border-color: #60a5fa;
}

:deep(.dark .moderate-input .el-textarea__inner:focus) {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

:deep(.dark .moderate-input .el-input__count) {
  color: #9ca3af;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .approve-button,
  .reject-button {
    width: 100%;
  }
}
</style>