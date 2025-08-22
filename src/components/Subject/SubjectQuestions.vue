<script setup>
import { whatStatus } from '../../utils/utils.js';
import { useRoute } from "vue-router";
import { useTestStore } from "../../store/TestStore.js";
import { View } from "@element-plus/icons-vue";
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
  },
  forceCardView: {
    type: Boolean,
    default: false
  },
  showCompactView: {
    type: Boolean,
    default: false
  },
  noContainer: {
    type: Boolean,
    default: false
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
const isModerateRoute = computed(() => {
  return route.path.includes('/moderate');
});

// Determine if we should show card view
const shouldShowCardView = computed(() => {
  return isMobile.value || props.forceCardView || isModerateRoute.value;
});

// Determine table breakpoint for better responsive behavior
const shouldShowCompactTable = computed(() => {
  return isTablet.value || props.showCompactView;
});

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
  <div :class="{ 'h-full flex flex-col': !props.noContainer, 'flex flex-col': props.noContainer }">
    <!-- Card View (Mobile or Forced) -->
    <div v-if="shouldShowCardView" :class="{ 'space-y-4 overflow-y-auto p-2': !props.noContainer, 'space-y-4': props.noContainer }">
      <div
          v-for="(question) in questions"
          :key="question.id"
          @click="setQuestions(question)"
          class="bg-white dark:bg-neutral-800 rounded-xl p-4 cursor-pointer 
                 transition-all duration-200 hover:shadow-lg border border-gray-200 
                 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400"
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
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">Текст вопроса</h4>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 pl-4">{{ question.text }}</p>
        </div>

        <!-- Tags and Status -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-wrap gap-2">
            <el-tag :type="getTypeTag(question.type?.name).type" size="small" class="font-medium">
              {{ getTypeTag(question.type?.name).text }}
            </el-tag>
            <el-tag :type="getStatusTag(question.status).type" effect="plain" round size="small">
              {{ getStatusTag(question.status).text }}
            </el-tag>
          </div>
          
          <!-- Subject info (if not on subjects route) -->
          <div v-if="!isSubjectsRoute && question.subject_name" class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatSubjectName(question.subject_name) }}
          </div>
        </div>

        <!-- Meta info -->
        <div class="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-neutral-700">
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <i class="fa fa-user text-gray-400"></i>
            <span>{{ question.creator?.user_name || 'Неизвестно' }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <i class="fa fa-calendar text-gray-400"></i>
            <span>{{ formatDate(question.created_at) }}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div v-if="isTestsRoute" class="mt-3 pt-3 border-t border-gray-100 dark:border-neutral-700 flex justify-end">
          <button
              @click.stop="openModal(question)"
              class="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 
                     dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors
                     text-sm font-medium"
          >
            <el-icon><View /></el-icon>
            <span>Просмотр</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div v-else :class="{ 'flex-1': !props.noContainer }">
      <el-table
          :data="questions"
          highlight-current-row
          @current-change="setQuestions"
          class="w-full subjects-table"
          :class="{ 
            'table-responsive': shouldShowCompactTable,
            'table-compact': props.showCompactView 
          }"

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

        <!-- Creator column (hidden on compact view) -->
        <el-table-column
            v-if="!shouldShowCompactTable"
            prop="creator.user_name"
            label="Создал"
            min-width="100"
            show-overflow-tooltip
        />

        <!-- Moderator column (hidden on compact view) -->
        <el-table-column
            v-if="!shouldShowCompactTable"
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
            label="Действия"
            align="center"
            width="120"
            fixed="right"
        >
          <template #default="{ row }">
            <button
                @click="openModal(row)"
                class="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 
                       dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors
                       text-sm font-medium"
            >
              <el-icon><View /></el-icon>
              <span class="hidden lg:inline">Просмотр</span>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

