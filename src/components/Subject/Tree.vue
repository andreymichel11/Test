<script setup>
import SubjectTreeComponent from './SubjectTreeComponent.vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'

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
})

// Reactive state
const isMobile = ref(false)

// Computed properties
const hasSubjects = computed(() =>
    props.subjects !== null && props.subjects !== undefined && props.subjects.length > 0
)

// Methods
const handleCreateRootSubject = () => {
  props.create(true)
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
}

// Lifecycle
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <!-- Scrollable Content with ALWAYS visible scrollbar -->
    <div class="flex-1 p-4 sm:p-6 tree-scrollable-container">
      <div v-if="hasSubjects" class="tree-content-wrapper">
        <SubjectTreeComponent
            :subjects="subjects"
            :select="select"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="h-full flex flex-col items-center justify-center p-8 text-center">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-neutral-700
                    rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <i class="fa fa-sitemap text-xl sm:text-2xl text-gray-400 dark:text-gray-500" />
        </div>

        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Нет доступных тематик
        </h4>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs leading-relaxed">
          Создайте первую тематику для организации ваших вопросов
        </p>

        <button
            @click="handleCreateRootSubject"
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600
                 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
        >
          <i class="fa fa-plus text-sm" />
          <span>Создать тематику</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>