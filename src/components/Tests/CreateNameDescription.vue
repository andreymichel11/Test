<script setup>
import { useTestStore } from "../../store/TestStore.js";
import { computed } from 'vue';

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

const TestStore = useTestStore()

const canContinue = computed(() => {
  return TestStore.testQuestions.name.trim().length > 0
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-neutral-900">
    <!-- Content Container -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="min-h-full flex items-center justify-center">
      <div class="w-full max-w-2xl">
        <!-- Header -->
        <div class="text-center mb-8 flex items-center justify-center gap-2">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center ">
            <i class="fa fa-edit text-purple-500 text-2xl"></i>
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Укажите название и описание для вашего теста
          </p>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 p-8 mb-8">
          <div class="space-y-6">
            <!-- Test Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Название теста *
              </label>
              <el-input
                  v-model="TestStore.testQuestions.name"
                  size="large"
                  placeholder="Введите название теста..."
                  class="test-input"
                  maxlength="100"
                  show-word-limit
              />
            </div>

            <!-- Test Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Описание (необязательно)
              </label>
              <el-input
                  v-model="TestStore.testQuestions.description"
                  type="textarea"
                  :rows="4"
                  size="large"
                  placeholder="Введите описание теста..."
                  class="test-input"
                  maxlength="500"
                  show-word-limit
              />
            </div>
          </div>
        </div>



        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <el-button
              v-if="canContinue"
              type="primary"
              size="large"
              @click="next"
              class="action-button primary-action h-12 px-8 font-semibold"
          >
            <i class="fa fa-arrow-right mr-2"></i>
            Продолжить
          </el-button>

          <el-button

              size="large"
              @click="home"
              class="action-button secondary-action h-12 px-8 font-semibold"
          >
            <i class="fa fa-home mr-2"></i>
            На главную
          </el-button>
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
  background: #8b5cf6;
  border: none;
  color: white;
}

.primary-action:hover {
  background: #7c3aed;
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

/* Element Plus Input Styling */
:deep(.test-input .el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

:deep(.test-input .el-input__wrapper:hover) {
  border-color: #8b5cf6;
}

:deep(.test-input .el-input__wrapper.is-focus) {
  border-color: #8b5cf6;
}

:deep(.test-input .el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

:deep(.test-input .el-textarea__inner:hover) {
  border-color: #8b5cf6;
}

:deep(.test-input .el-textarea__inner:focus) {
  border-color: #8b5cf6;
}

/* Dark theme */
:deep(.dark .test-input .el-input__wrapper) {
  background: #262626;
  border-color: #404040;
  color: #f9fafb;
}

:deep(.dark .test-input .el-textarea__inner) {
  background: #262626;
  border-color: #404040;
  color: #f9fafb;
}

:deep(.dark .secondary-action) {
  background: #262626;
  border-color: #404040;
  color: #d1d5db;
}

:deep(.dark .secondary-action:hover) {
  background: #404040;
  border-color: #525252;
}

/* Custom scrollbar for content */
.overflow-y-auto {
  scrollbar-width: auto;
  scrollbar-color: #cbd5e1 #f8fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
  border: 1px solid #f8fafc;
  transition: all 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Dark theme scrollbar */
.dark .overflow-y-auto {
  scrollbar-color: #94a3b8 #475569;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #475569;
  border-color: #64748b;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-color: #475569;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .action-button {
    width: 100%;
  }
}
</style>