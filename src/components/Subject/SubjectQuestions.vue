<script setup>
import { whatStatus } from '../../utils/utils.js';
import { useRoute } from "vue-router";
import { useTestStore } from "../../store/TestStore.js";
import { Delete, View } from "@element-plus/icons-vue";
import { computed, ref } from 'vue';

const route = useRoute();
const TestStore = useTestStore();

const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  setQuestions: {
    type: Function,
    required: true
  },
  openModal: {
    type: Function,
    default: null
  }
});

// Responsive table configuration
const isMobile = ref(false);
const isTablet = ref(false);

const updateViewport = () => {
  const width = window.innerWidth;
  isMobile.value = width < 768;
  isTablet.value = width >= 768 && width < 1024;
};

// Computed properties for responsive display
const isTestRoute = computed(() => route.path.toLowerCase() === '/test');
const isSubjectsRoute = computed(() => route.path === '/subjects');
const isTestsRoute = computed(() => route.path === '/tests');

const displayColumns = computed(() => {
  const baseColumns = [
    { prop: 'text', label: 'Текст вопроса', width: isMobile.value ? '200' : '400', show: true },
    { prop: 'type.name', label: 'Тип', sortable: true, show: true },
    { prop: 'status', label: 'Статус', show: true }
  ];

  if (!isSubjectsRoute.value) {
    baseColumns.splice(2, 0, {
      prop: 'subject_name',
      label: 'Тематика',
      sortable: true,
      show: !isMobile.value
    });
  }

  if (!isMobile.value) {
    baseColumns.push(
        { prop: 'creator.user_name', label: 'Создал', show: !isTablet.value },
        { prop: 'moderator.user_name', label: 'Модератор', show: !isTablet.value },
        { prop: 'created_at', label: 'Дата создания', sortable: true, show: true }
    );
  }

  return baseColumns.filter(col => col.show);
});

// Methods
const handleTest = (row, event) => {
  if (!isTestRoute.value) return;

  if (event) {
    TestStore.testQuestions.question_ids.push(row.id);
    TestStore.preparedQuestions.push(row);
  } else {
    const index = TestStore.testQuestions.question_ids.indexOf(row.id);
    if (index !== -1) {
      TestStore.testQuestions.question_ids.splice(index, 1);
    }
    TestStore.preparedQuestions = TestStore.preparedQuestions.filter(item => item.id !== row.id);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  return dateString.split('T')[0];
};

const formatSubjectName = (subjectName) => {
  if (!subjectName) return '---';
  return subjectName.split('_').join(' ');
};

const getTypeTag = (typeName) => {
  if (!typeName) return { type: 'info', text: '---' };
  return {
    type: whatStatus(typeName),
    text: typeName.charAt(0).toUpperCase() + typeName.slice(1)
  };
};

const getStatusTag = (status) => {
  if (!status) return { type: 'info', text: '---' };
  return {
    type: whatStatus(status),
    text: status.charAt(0).toUpperCase() + status.slice(1)
  };
};

// Lifecycle
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  updateViewport();
  window.addEventListener('resize', updateViewport);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport);
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Mobile Card View -->
    <div v-if="isMobile" class="space-y-3 overflow-y-auto">
      <div
          v-for="(question, index) in questions"
          :key="question.id"
          @click="setQuestions(question)"
          class="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-transparent hover:border-blue-500"
      >
        <!-- Checkbox for test route -->
        <div v-if="isTestRoute" class="flex items-center mb-3">
          <el-checkbox
              v-model="question.isTest"
              @change="handleTest(question, $event)"
              @click.stop
          />
          <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Добавить в тест</span>
        </div>

        <!-- Question text -->
        <div class="mb-3">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1">Вопрос</h4>
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{{ question.text }}</p>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-3">
          <el-tag :type="getTypeTag(question.type?.name).type" size="small">
            {{ getTypeTag(question.type?.name).text }}
          </el-tag>
          <el-tag :type="getStatusTag(question.status).type" effect="dark" round size="small">
            {{ getStatusTag(question.status).text }}
          </el-tag>
        </div>

        <!-- Meta info -->
        <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{{ question.creator?.user_name || '---' }}</span>
          <span>{{ formatDate(question.created_at) }}</span>
        </div>

        <!-- View button for tests route -->
        <div v-if="isTestsRoute" class="mt-3 flex justify-end">
          <button
              @click.stop="openModal(question)"
              class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <el-icon><View /></el-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div v-else class="flex-1 overflow-hidden">
      <el-table
          :data="questions"
          highlight-current-row
          @current-change="setQuestions"
          class="w-full h-full"
          :class="{ 'table-responsive': isTablet }"
      >
        <!-- Test checkbox column -->
        <el-table-column v-if="isTestRoute" width="50" align="center">
          <template #default="{ row }">
            <el-checkbox
                v-model="row.isTest"
                @change="handleTest(row, $event)"
            />
          </template>
        </el-table-column>

        <!-- Question text column -->
        <el-table-column
            prop="text"
            label="Текст вопроса"
            :width="isMobile ? '200' : '400'"
            show-overflow-tooltip
        />

        <!-- Type column -->
        <el-table-column prop="type.name" label="Тип" sortable min-width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type?.name).type" size="small">
              {{ getTypeTag(row.type?.name).text }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Subject column (not on subjects route) -->
        <el-table-column
            v-if="!isSubjectsRoute"
            prop="subject_name"
            label="Тематика"
            sortable
            min-width="120"
            show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ formatSubjectName(row.subject_name) }}
          </template>
        </el-table-column>

        <!-- Status column -->
        <el-table-column prop="status" label="Статус" min-width="100">
          <template #default="{ row }">
            <el-tag
                :type="getStatusTag(row.status).type"
                effect="dark"
                round
                size="small"
            >
              {{ getStatusTag(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Creator column (hidden on tablet) -->
        <el-table-column
            v-if="!isTablet"
            prop="creator.user_name"
            label="Создал"
            min-width="100"
            show-overflow-tooltip
        />

        <!-- Moderator column (hidden on tablet) -->
        <el-table-column
            v-if="!isTablet"
            prop="moderator.user_name"
            label="Модератор"
            min-width="100"
            show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.moderator?.user_name || '---' }}
          </template>
        </el-table-column>

        <!-- Created date column -->
        <el-table-column
            prop="created_at"
            label="Дата создания"
            sortable
            min-width="120"
        >
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>

        <!-- View action column (tests route only) -->
        <el-table-column
            v-if="isTestsRoute"
            label="Просмотр"
            align="center"
            width="100"
            fixed="right"
        >
          <template #default="{ row }">
            <button
                @click="openModal(row)"
                class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <el-icon><View /></el-icon>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for mobile cards */
.space-y-3 {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.space-y-3::-webkit-scrollbar {
  width: 6px;
}

.space-y-3::-webkit-scrollbar-track {
  background: transparent;
}

.space-y-3::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive table styles */
.table-responsive :deep(.el-table__body-wrapper) {
  scrollbar-width: thin;
}

.table-responsive :deep(.el-table__body-wrapper)::-webkit-scrollbar {
  height: 6px;
}

.table-responsive :deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}
</style>