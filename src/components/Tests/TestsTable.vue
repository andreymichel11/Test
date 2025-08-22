<script setup>
import { computed } from 'vue'

const props = defineProps({
  tests: {
    type: Array,
    required: true
  },
  setCurrentTest: {
    type: Function,
    required: true
  }
})

const formattedTests = computed(() => {
  return props.tests.map(test => ({
    ...test,
    formattedDate: new Date(test.created_at).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    questionCount: test.question_ids?.length || 0,
    creatorName: test.creator?.user_name || 'Неизвестно'
  }))
})
</script>

<template>
  <div class="bg-white dark:bg-neutral-800  shadow-sm overflow-hidden">
    <!-- Table Header -->


    <!-- Table Content -->
    <div class="overflow-hidden">
      <el-table
          :data="formattedTests"

          @current-change="setCurrentTest"
          class="custom-table"
          :empty-text="'Нет созданных тестов'"
          highlight-current-row
      >
        <el-table-column prop="name" label="Название" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-2">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fa fa-clipboard text-purple-500"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-gray-900 dark:text-white truncate">
                  {{ row.name }}
                </p>
                <p v-if="row.description" class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ row.description }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="questionCount" label="Вопросов" width="120" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': row.questionCount > 0,
                      'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-400': row.questionCount === 0
                    }">
                <i class="fa fa-list-ol mr-1"></i>
                {{ row.questionCount }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="creatorName" label="Создал" width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i class="fa fa-user text-blue-500 text-sm"></i>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ row.creatorName }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="formattedDate" label="Создан" width="180" sortable>
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <i class="fa fa-calendar text-gray-400"></i>
              <span class="text-gray-700 dark:text-gray-300">
                {{ row.formattedDate }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="80" align="center">
          <template #default>
            <div class="flex justify-center">
              <div class="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <i class="fa fa-chevron-right text-gray-400 text-xs"></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Empty State -->
    <div v-if="tests.length === 0" class="p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
        <i class="fa fa-clipboard-list text-gray-400 text-2xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Нет созданных тестов
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Создайте первый тест, чтобы начать работу
      </p>
    </div>
  </div>
</template>

<style scoped>


/* Mobile responsiveness */
@media (max-width: 768px) {
  :deep(.custom-table .el-table th),
  :deep(.custom-table .el-table td) {
    padding: 8px 4px;
  }
}
</style>