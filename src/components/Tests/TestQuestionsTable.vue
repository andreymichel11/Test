<script setup>
import { computed } from 'vue';
import SubjectQuestions from "../Subject/SubjectQuestions.vue";
import { useTestStore } from "../../store/TestStore.js";

const TestStore = useTestStore()

const props = defineProps({
  back: {
    type: Function,
    required: true
  },
  save: {
    type: Function,
    required: true
  }
})

const canSave = computed(() => {
  return TestStore.testQuestions.question_ids.length > 0 &&
      TestStore.testQuestions.name.trim().length > 0
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-neutral-900">
    <!-- Header -->
    <div class="flex-shrink-0 px-6 py-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Финальная проверка
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Проверьте выбранные вопросы перед сохранением теста
          </p>
        </div>

        <!-- Test Info -->
        <div class="hidden md:flex items-center gap-4">
          <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <i class="fa fa-clipboard-list text-white text-xs"></i>
              </div>
              <div>
                <p class="text-xs text-purple-600 dark:text-purple-400">Тест</p>
                <p class="text-sm font-medium text-purple-900 dark:text-purple-100 truncate max-w-32" :title="TestStore.testQuestions.name">
                  {{ TestStore.testQuestions.name }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <i class="fa fa-list-ol text-white text-xs"></i>
              </div>
              <div>
                <p class="text-xs text-blue-600 dark:text-blue-400">Вопросов</p>
                <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {{ TestStore.testQuestions.question_ids.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-6">
      <div class="h-full">
        <!-- Test Summary -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Информация о тесте
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название теста
              </label>
              <div class="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ TestStore.testQuestions.name }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Количество вопросов
              </label>
              <div class="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ TestStore.testQuestions.question_ids.length }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="TestStore.testQuestions.description" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Описание
            </label>
            <div class="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
              <p class="text-gray-900 dark:text-white">
                {{ TestStore.testQuestions.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 flex-1 flex flex-col">
          <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-list text-green-500 text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Выбранные вопросы
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Все вопросы, которые войдут в тест
                </p>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-hidden p-4">
            <div v-if="TestStore.preparedQuestions.length > 0" class="h-full overflow-y-auto">
              <SubjectQuestions :questions="TestStore.preparedQuestions"/>
            </div>

            <div v-else class="h-full flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i class="fa fa-exclamation-triangle text-gray-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Нет выбранных вопросов
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Вернитесь на предыдущий шаг и выберите вопросы для теста
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-shrink-0 p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
      <div class="flex items-center justify-between">
        <!-- Status Info -->
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-1">
            <i class="fa fa-check-circle" :class="TestStore.testQuestions.name.trim() ? 'text-green-500' : 'text-gray-400'"></i>
            <span class="text-xs" :class="TestStore.testQuestions.name.trim() ? 'text-green-700 dark:text-green-400' : 'text-gray-500'">
              Название указано
            </span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa fa-check-circle" :class="TestStore.testQuestions.question_ids.length > 0 ? 'text-green-500' : 'text-gray-400'"></i>
            <span class="text-xs" :class="TestStore.testQuestions.question_ids.length > 0 ? 'text-green-700 dark:text-green-400' : 'text-gray-500'">
              Вопросы выбраны
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <el-button
              size="large"
              @click="back"
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
              class="primary-action h-10 px-6 font-semibold"
          >
            <i class="fa fa-save mr-2"></i>
            Сохранить тест
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>