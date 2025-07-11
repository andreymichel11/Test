<script setup>
import SubjectTreeComponent from "./SubjectTreeComponent.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  subjects: {
    type: Array,
    default: () => []
  },
  select: {
    type: Function,
    required: true
  },
  create: {
    type: Function,
    required: true
  }
});

// Reactive state
const isMobile = ref(false);
const isCollapsed = ref(false);

// Computed properties
const hasSubjects = computed(() =>
    props.subjects !== null && props.subjects !== undefined && props.subjects.length > 0
);

const containerClasses = computed(() => {
  const baseClasses = "bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 transition-all duration-300 flex flex-col";

  if (isMobile.value) {
    return `${baseClasses} w-full h-full`;
  }

  return `${baseClasses} w-full h-full`;
});

// Methods
const handleCreateRootSubject = () => {
  props.create(true);
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024;
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Lifecycle
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div :class="containerClasses">
    <!-- Fixed Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/50 rounded-t-xl flex-shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa fa-sitemap text-blue-500"></i>
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">
          Тематики
        </h3>
      </div>

      <!-- Mobile collapse toggle -->
      <button
          v-if="isMobile"
          @click="toggleCollapse"
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
      >
        <i :class="isCollapsed ? 'fa fa-chevron-down' : 'fa fa-chevron-up'"></i>
      </button>
    </div>

    <!-- Fixed Add Button -->
    <div
        v-if="hasSubjects"
        class="p-4 border-b border-gray-100 dark:border-neutral-700 flex-shrink-0"
    >
      <button
          @click="handleCreateRootSubject"
          class=" flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-main-text)] hover:bg-blue-600 text-white text-sm rounded-lg transition-all duration-200 hover:shadow-md"
      >
        <i class="fa fa-plus"></i>
        <span class="hidden sm:inline">Добавить корневую тематику</span>
        <span class="sm:hidden">Добавить тематику</span>
      </button>
    </div>

    <!-- Scrollable Content -->
    <div
        class="flex-1  min-h-0"
        :class="{ 'h-0 overflow-hidden': isMobile && isCollapsed }"
    >
      <div v-if="hasSubjects" class="h-full overflow-y-auto p-4">
        <SubjectTreeComponent
            :subjects="subjects"
            :select="select"
            class="h-full"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="h-full flex flex-col items-center justify-center p-8 text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
          <i class="fa fa-sitemap text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>

        <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Нет доступных тематик
        </h4>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-48">
          Создайте первую тематику для организации ваших вопросов
        </p>

        <button
            @click="handleCreateRootSubject"
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <i class="fa fa-plus"></i>
          <span>Создать тематику</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4a5568;
}

/* Animation for mobile collapse */
@media (max-width: 1023px) {
  .transition-all {
    transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
}
</style>