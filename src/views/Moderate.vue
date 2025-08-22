<template>
  <div class="app-container bg-gray-50 dark:bg-neutral-900">
    <!-- Mobile Navigation Tabs -->
    <div class="mobile-tabs lg:hidden bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-10">
      <div class="px-4 sm:px-6 py-3">
        <div class="flex gap-1 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
          <button
              @click="activePanel = 'questions'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'questions'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            <i class="fa fa-list text-xs" />
            <span>Вопросы ({{ questionsCount }})</span>
          </button>
          <button
              @click="activePanel = 'moderate'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'moderate'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              :disabled="!hasSelectedQuestion"
          >
            <i class="fa fa-eye text-xs" />
            <span>Модерация</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="main-layout-container">
      <!-- Questions List Panel (Left) -->
      <aside
          class="questions-panel bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700"
          :class="{
            'hidden': activePanel !== 'questions' && isMobileView,
            'lg:block': !isMobileView,
            'mobile-questions-view': isMobileView && activePanel === 'questions'
          }"
          :style="!isMobileView ? { height: leftPanelHeight } : {}"
      >
        <!-- Questions Header -->
        <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
          <div class="flex justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-list text-blue-500 text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Вопросы на модерации
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Ожидают проверки и одобрения
                </p>
              </div>
            </div>

            <!-- Counter Badge -->
            <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg px-3 py-2">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <i class="fa fa-clock-o text-white text-xs"></i>
                </div>
                <div class="flex gap-2 items-center">
                  <p class="text-xs text-orange-600 dark:text-orange-400">На модерации:</p>
                  <p class="font-bold" :class="{
                    'text-orange-600 dark:text-orange-400': questionsCount > 0,
                    'text-gray-600 dark:text-gray-400': questionsCount === 0
                  }">{{ questionsCount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions List Content with scroll -->
        <div class="questions-scroll-container">
          <div v-if="hasQuestions" class="p-4">
            <SubjectQuestions
                :show-compact-view="true"
                :questions="QuestionStore.questions"
                :set-questions="handleCurrentChange"
            />
          </div>

          <div v-else class="questions-empty-state p-4">
            <div class="text-center">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30
                          rounded-xl flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-check-circle text-green-500 text-xl sm:text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Нет вопросов на модерации
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Все вопросы проверены и обработаны
              </p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Moderation Panel (Right) -->
      <main
          class="moderate-panel bg-white dark:bg-neutral-800"
          :class="{
            'hidden': activePanel !== 'moderate' && isMobileView,
            'lg:block': !isMobileView,
            'mobile-moderate-view': isMobileView && activePanel === 'moderate'
          }"
      >
        <!-- Moderation Header -->
        <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-eye text-purple-500 text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Модерация вопроса
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Просмотр и принятие решения
                </p>
              </div>
            </div>

            <!-- Mobile Back Button -->
            <button
                v-if="isMobileView && hasSelectedQuestion"
                @click="activePanel = 'questions'"
                class="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500
                       hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200"
            >
              <i class="fa fa-arrow-left text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Moderation Content -->
        <div class="moderate-content p-4 sm:p-6">
          <div v-if="hasSelectedQuestion">
            <ModerateComponent />
          </div>

          <div v-else class="moderate-empty-state">
            <div class="text-center max-w-sm px-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-neutral-700
                          rounded-xl flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-mouse-pointer text-gray-400 text-xl sm:text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Выберите вопрос для модерации
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ isMobileView ? 'Вернитесь к списку и выберите вопрос' : 'Кликните на вопрос из списка слева для начала проверки' }}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref, nextTick, watch } from "vue";
import { useQuestionStore } from "../store/QuestionStore.js";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import ModerateComponent from "../components/Moderate/ModerateComponent.vue";

const QuestionStore = useQuestionStore()

// Reactive state
const activePanel = ref('questions')
const isMobileView = ref(false)
const leftPanelHeight = ref('85vh')

// Computed properties
const hasQuestions = computed(() => {
  return QuestionStore.questions.length > 0
})

const hasSelectedQuestion = computed(() => {
  return QuestionStore.currentQuestion !== null &&
      Object.keys(QuestionStore.currentQuestion).length > 0
})

const questionsCount = computed(() => {
  return QuestionStore.questions.length
})

// Methods
const handleResize = () => {
  isMobileView.value = window.innerWidth < 1024
  if (!isMobileView.value) {
    syncPanelHeight()
  }
}

// Синхронизация высоты левой панели с правой
const syncPanelHeight = async () => {
  await nextTick()
  if (isMobileView.value) return

  const rightPanel = document.querySelector('.moderate-panel')
  const minHeight = window.innerHeight * 0.85

  if (rightPanel) {
    // Всегда используем большую из двух высот: контент правой панели или минимальная высота
    const height = Math.max(rightPanel.scrollHeight, minHeight)
    leftPanelHeight.value = `${height}px`
  }
}

const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question

  // Auto-switch to moderation panel on mobile after selection
  if (isMobileView.value) {
    activePanel.value = 'moderate'
  }

  nextTick(syncPanelHeight)
}

// Lifecycle
onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)

  try {
    await QuestionStore.getQuestionsStatuses()
    const status = QuestionStore.statuses.find(item => item.name.toLowerCase() === 'создан')
    if (status) {
      await QuestionStore.getQuestions(`?status_id=${status.id}`)
    }
  } catch (error) {
    console.error('Ошибка загрузки данных модерации:', error)
  }

  // Начальная синхронизация высоты после загрузки данных
  await nextTick()
  syncPanelHeight()

  // Наблюдаем за изменениями контента
  const observer = new MutationObserver(syncPanelHeight)
  const rightPanel = document.querySelector('.moderate-panel')
  if (rightPanel) {
    observer.observe(rightPanel, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
})

// Следим за изменением выбранного вопроса и количества вопросов
watch([hasSelectedQuestion, questionsCount], () => {
  nextTick(syncPanelHeight)
})

onUnmounted(() => {
  QuestionStore.questions = []
  QuestionStore.currentQuestion = {}
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Основной контейнер - минимальная высота с возможностью роста */
.app-container {
  min-height: 85vh;
  display: flex;
  flex-direction: column;
}

/* Мобильные табы */
.mobile-tabs {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Основной layout контейнер */
.main-layout-container {
  flex: 1;
  display: flex;
  min-height: 85vh;
  /* Панели идут вплотную друг к другу без отступов */
}

/* Десктоп версия */
@media (min-width: 1024px) {
  .main-layout-container {
    align-items: flex-start;
  }
}

/* Левая панель с вопросами - фиксированная */
.questions-panel {
  width: 35rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  min-height: 85vh;
  align-self: flex-start;
  overflow: hidden;
}

@media (min-width: 1280px) {
  .questions-panel {
    width: 32rem;
  }
}

@media (min-width: 1536px) {
  .questions-panel {
    width: 40rem;
  }
}

/* Правая панель модерации - растягивается */
.moderate-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 85vh;
}

/* Заголовки панелей */
.panel-header {
  flex-shrink: 0;
}

/* Контейнер со скроллом для вопросов */
.questions-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  /* Видимый скроллбар */
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f3f4f6;
}

.questions-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.questions-scroll-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.questions-scroll-container::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
  border: 2px solid #f3f4f6;
}

.questions-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Темная тема для скролла */
.dark .questions-scroll-container {
  scrollbar-color: #525252 #262626;
}

.dark .questions-scroll-container::-webkit-scrollbar-track {
  background: #262626;
}

.dark .questions-scroll-container::-webkit-scrollbar-thumb {
  background: #525252;
  border: 2px solid #262626;
}

.dark .questions-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #737373;
}

/* Контент модерации */
.moderate-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Пустые состояния */
.questions-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.moderate-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

/* Мобильная версия */
@media (max-width: 1023px) {
  .app-container {
    min-height: 100vh;
    height: auto;
  }

  .main-layout-container {
    flex-direction: column;
    min-height: calc(100vh - 60px); /* Вычитаем высоту табов */
  }

  .questions-panel,
  .moderate-panel {
    width: 100%;
    height: auto !important;
    min-height: calc(100vh - 60px);
    position: relative;
  }

  .questions-panel.hidden,
  .moderate-panel.hidden {
    display: none;
  }

  /* Мобильная панель вопросов когда активна */
  .mobile-questions-view {
    min-height: calc(100vh - 60px);
  }

  /* Мобильная панель модерации когда активна */
  .mobile-moderate-view {
    min-height: calc(100vh - 60px);
  }

  /* На мобильных убираем скроллбары и используем естественный скролл */
  .questions-scroll-container {
    overflow-y: visible;
    max-height: none;
  }

  .questions-scroll-container::-webkit-scrollbar {
    display: none;
  }

  .questions-scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .moderate-content {
    min-height: calc(100vh - 200px);
  }
}

/* Анимации */
@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition: none;
  }
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}


</style>
