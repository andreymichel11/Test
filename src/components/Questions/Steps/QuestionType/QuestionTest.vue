<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Add Variant Section -->
    <div class="flex-shrink-0 space-y-3 mb-4">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Добавить вариант ответа
      </label>
      <div class="flex items-center gap-2">
        <el-input
            v-model="newVariant"
            placeholder="Введите вариант ответа"
            clearable
            size="large"
            class="flex-1 variant-input"
        />
        <el-button
            type="primary"
            @click="addVariant"
            :disabled="!newVariant.trim()"
            size="large"
            class="add-button px-4"
        >
          <i class="fa fa-plus"></i>
        </el-button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Variants List -->
      <div v-if="variants.length > 0" class="flex-1 flex flex-col min-h-0">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex-shrink-0">
          Варианты ответов ({{ variants.length }})
        </h4>

        <div class="flex-1 overflow-y-auto space-y-2 min-h-0 variants-list">
          <div
              v-for="(variant, index) in variants"
              :key="index"
              class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200"
              :class="{
              'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600': variant.isCorrect,
              'border-gray-200 bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-600': !variant.isCorrect
            }"
              @click="toggleCorrectVariant(variant)"
          >
            <div class="flex items-center gap-3 flex-1">
              <div
                  class="w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center"
                  :class="{
                  'bg-green-500 border-green-500': variant.isCorrect,
                  'border-gray-300 dark:border-neutral-500': !variant.isCorrect
                }"
              >
                <i v-if="variant.isCorrect" class="fa fa-check text-white text-xs"></i>
              </div>
              <span
                  class="font-medium flex-1 text-sm"
                  :class="{
                  'text-green-800 dark:text-green-200': variant.isCorrect,
                  'text-gray-700 dark:text-gray-300': !variant.isCorrect
                }"
              >
                {{ variant.text }}
              </span>
              <div v-if="variant.isCorrect" class="text-xs text-green-600 dark:text-green-400 font-medium">
                Правильный
              </div>
            </div>

            <el-button
                type="danger"
                size="small"
                circle
                @click.stop="removeVariant(index)"
                class="ml-2"
            >
              <i class="fa fa-trash text-xs"></i>
            </el-button>
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mt-3 flex-shrink-0">
          <p class="text-sm text-blue-700 dark:text-blue-300">
            <i class="fa fa-info-circle mr-2"></i>
            Нажмите на вариант ответа, чтобы пометить его как правильный или неправильный
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center mx-auto mb-3">
            <i class="fa fa-list-ul text-gray-400"></i>
          </div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Добавьте варианты ответов
          </h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Создайте варианты и отметьте правильные
          </p>
        </div>
      </div>
    </div>

    <!-- Correct Answers Summary -->
    <div v-if="correctVariants.length > 0" class="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Правильные ответы ({{ correctVariants.length }})
      </h4>
      <div class="flex gap-2 flex-wrap">
        <div
            v-for="(answer, index) in correctVariants"
            :key="`answer-${index}`"
            class="inline-flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg font-medium text-sm"
        >
          <i class="fa fa-check text-xs"></i>
          {{ answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch} from 'vue'
import {useQuestionStore} from "../../../../store/QuestionStore.js";

const QuestionStore = useQuestionStore()

const props = defineProps({
  isUpdate: Boolean,
})

// Реактивные переменные
const newVariant = ref('')
const variants = ref([])
const correctVariants = ref([])

watch(
    () => props.isUpdate,
    () => {
      if (props.isUpdate) {
        QuestionStore.newQuestion.variants.variants.forEach(variant => {
          const isCorrect = QuestionStore.newQuestion.answer.answer.includes(variant)
          variants.value.push( {text: variant,  isCorrect: isCorrect })
          if (isCorrect) {
            correctVariants.value.push(variant )
          }
        })
      }
    },
    { immediate: true }
);

// Добавление варианта ответа
const addVariant = () => {
  if (newVariant.value.trim()) {
    const variant = {
      text: newVariant.value.trim(),
      isCorrect: false
    }
    variants.value.push(variant)
    newVariant.value = ''
  }
}

// Удаление варианта
const removeVariant = (index) => {
  variants.value.splice(index, 1)
  updateCorrectVariants()
}

// Переключение статуса правильного ответа
const toggleCorrectVariant = (variant) => {
  variant.isCorrect = !variant.isCorrect
  updateCorrectVariants()
}

// Обновление массива правильных вариантов
const updateCorrectVariants = () => {
  return correctVariants.value = variants.value
      .filter(variant => variant.isCorrect)
      .map(variant => variant.text)
}

watch(variants,() => {
  QuestionStore.newQuestion.variants.variants.splice(0)
  QuestionStore.newQuestion.variants.variants = (variants.value.map(variant => variant.text))
}, {deep: true})

watch(correctVariants,() => {
  QuestionStore.newQuestion.answer.answer.splice(0)
  QuestionStore.newQuestion.answer.answer = correctVariants.value
}, {deep: true})
</script>

<style scoped>
.add-button {
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 6px;
  transition: all 0.3s ease;
  width: 44px;
}

.add-button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.add-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Element Plus Input Styling */
:deep(.variant-input .el-input__wrapper) {
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

:deep(.variant-input .el-input__wrapper:hover) {
  border-color: #3b82f6;
}

:deep(.variant-input .el-input__wrapper.is-focus) {
  border-color: #3b82f6;
}

/* Dark theme */
:deep(.dark .variant-input .el-input__wrapper) {
  background: #262626;
  border-color: #404040;
  color: #f9fafb;
}

/* Scrollbar styling for variants list */
.variants-list::-webkit-scrollbar {
  width: 6px;
}

.variants-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.variants-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.variants-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark theme scrollbar */
:deep(.dark) .variants-list::-webkit-scrollbar-track {
  background: #262626;
}

:deep(.dark) .variants-list::-webkit-scrollbar-thumb {
  background: #525252;
}

:deep(.dark) .variants-list::-webkit-scrollbar-thumb:hover {
  background: #737373;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .add-button {
    width: 100%;
    margin-top: 8px;
  }
}
</style>