<template>
  <div class="app-container bg-gray-50 dark:bg-neutral-900">
    <!-- Mobile Navigation Tabs -->
    <div class="mobile-tabs lg:hidden bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-10">
      <div class="px-4 sm:px-6 py-3">
        <div class="flex gap-1 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
          <button
              @click="activePanel = 'tests'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'tests'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            <i class="fa fa-file-alt text-xs" />
            <span>Тесты</span>
            <span v-if="hasTests"
                  class="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center">
              {{ TestStore.tests.length }}
            </span>
          </button>
          <button
              @click="activePanel = 'questions'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'questions'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              :disabled="!isTestSelected"
          >
            <i class="fa fa-list text-xs" />
            <span>Вопросы</span>
            <span v-if="hasQuestions"
                  class="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center">
              {{ TestStore.questions.length }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="main-layout-container">
      <!-- Tests Panel (Left) -->
      <aside
          class="tests-panel bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700"
          :class="{ 
            'hidden': activePanel !== 'tests' && isMobileView, 
            'lg:block': !isMobileView,
            'mobile-tests-view': isMobileView && activePanel === 'tests'
          }"
          :style="!isMobileView ? { height: leftPanelHeight } : {}"
      >
        <!-- Tests Header -->
        <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-file text-purple-500 text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Список тестов
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ hasTests ? `Всего тестов: ${TestStore.tests.length}` : 'Создайте свой первый тест' }}
                </p>
              </div>
            </div>

            <!-- Create Test Button -->
            <button
                @click="handleCreateTest"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                     transition-colors duration-200 flex items-center gap-2"
                title="Создать новый тест"
            >
              <i class="fa fa-plus text-xs" />
              <span class="hidden lg:inline">Создать</span>
            </button>
          </div>
        </div>

        <!-- Tests List with scroll -->
        <div class="tests-scroll-container">
          <div v-if="hasTests">
            <TestsTable
                :tests="TestStore.tests"
                :set-current-test="setCurrentTest"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="tests-empty-state p-4">
            <div class="text-center">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-neutral-700
                          rounded-xl flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-file-alt text-gray-400 text-xl sm:text-2xl" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Нет созданных тестов
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Создайте свой первый тест для начала работы
              </p>
              <button
                  @click="handleCreateTest"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                       transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <i class="fa fa-plus text-xs" />
                <span>Создать тест</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Questions Panel (Right) -->
      <main
          class="questions-panel bg-white dark:bg-neutral-800"
          :class="{ 
            'hidden': activePanel !== 'questions' && isMobileView, 
            'lg:block': !isMobileView,
            'mobile-questions-view': isMobileView && activePanel === 'questions'
          }"
      >
        <!-- Questions Header -->
        <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-list text-green-500 text-sm" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Вопросы теста
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ isTestSelected ? TestStore.currentTest.name : 'Выберите тест для просмотра' }}
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Questions Content -->
        <div class="questions-content">
          <div v-if="hasQuestions">
            <SubjectQuestions
                :questions="TestStore.questions"
                :open-modal="handleOpenModal"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="questions-empty-state">
            <div class="text-center max-w-sm px-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-neutral-700
                          rounded-xl flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-question-circle text-gray-400 text-xl sm:text-2xl" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ !isTestSelected ? 'Выберите тест для просмотра вопросов' : `В тесте "${TestStore.currentTest.name}" вопросов нет` }}
              </h3>
              <p v-if="isTestSelected" class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Добавьте первый вопрос в этот тест
              </p>
              <button
                  v-if="isTestSelected"
                  @click="handleAddQuestion"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg
                       transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <i class="fa fa-plus text-xs" />
                <span>Добавить вопрос</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <ShowQuestion v-model="TestStore.showIsOpened"/>
  </div>
</template>

<script setup>
import { useTestStore } from "../store/TestStore.js";
import { onMounted, onUnmounted, ref, computed, nextTick, watch } from "vue";
import { useUsersStore } from "../store/UsersStore.js";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import TestsTable from "../components/Tests/TestsTable.vue";
import { useQuestionStore } from "../store/QuestionStore.js";
import ShowQuestion from "../components/Tests/ShowQuestion.vue";

const TestStore = useTestStore()
const UsersStore = useUsersStore()
const QuestionStore = useQuestionStore()

// Reactive state
const isMobileView = ref(false)
const activePanel = ref('tests') // 'tests', 'questions'
const leftPanelHeight = ref('85vh')

// Computed properties
const isTestSelected = computed(() =>
    TestStore.currentTest !== null &&
    Object.keys(TestStore.currentTest).length > 0
)

const hasTests = computed(() => TestStore.tests?.length > 0)
const hasQuestions = computed(() => TestStore.questions?.length > 0)

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

  const rightPanel = document.querySelector('.questions-panel')
  const minHeight = window.innerHeight * 0.85

  if (rightPanel) {
    // Всегда используем большую из двух высот: контент правой панели или минимальная высота
    const height = Math.max(rightPanel.scrollHeight, minHeight)
    leftPanelHeight.value = `${height}px`
  }
}

const setCurrentTest = (test) => {
  TestStore.setCurrentTest(test)

  // Auto-switch to questions panel on mobile after selection
  if (isMobileView.value) {
    activePanel.value = 'questions'
  }

  nextTick(syncPanelHeight)
}

const handleOpenModal = (question) => {
  QuestionStore.currentQuestion = question
  if (Object.keys(QuestionStore.currentQuestion).length !== 0) {
    TestStore.setShowIsOpened()
  }
}

const handleCreateTest = () => {
  // Implement test creation logic
  console.log('Create test')
}

const handleAddQuestion = () => {
  // Implement add question logic
  console.log('Add question to test')
}

// Lifecycle
onMounted(async () => {
  TestStore.getTestsFunc(`?creator_user_id=${UsersStore.getUserId}`)
  handleResize()
  window.addEventListener('resize', handleResize)

  // Начальная синхронизация высоты после загрузки данных
  await nextTick()
  syncPanelHeight()

  // Наблюдаем за изменениями контента
  const observer = new MutationObserver(syncPanelHeight)
  const rightPanel = document.querySelector('.questions-panel')
  if (rightPanel) {
    observer.observe(rightPanel, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
})

// Следим за изменением выбранного теста и количества вопросов
watch([isTestSelected, hasQuestions], () => {
  nextTick(syncPanelHeight)
})

onUnmounted(() => {
  TestStore.questions = []
  QuestionStore.currentQuestion = {}
  TestStore.currentTest = {}
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

  /* На больших экранах можно немного изменить пропорции при необходимости */
  @media (min-width: 1536px) {
    .tests-panel {
      width: 45%; /* Немного меньше для большего пространства вопросам */
    }

    .questions-panel {
      width: 55%; /* Немного больше места для вопросов */
    }
  }
}

/* Левая панель с тестами - фиксированная */
.tests-panel {
  width: 35%; /* Половина экрана */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  min-height: 85vh;
  align-self: flex-start;
  overflow: hidden;
}

/* Правая панель с вопросами - растягивается */
.questions-panel {
  width: 65%; /* Половина экрана */
  display: flex;
  flex-direction: column;
  min-height: 85vh;
}

/* Заголовки панелей */
.panel-header {
  flex-shrink: 0;
}

/* Контейнер со скроллом для тестов */
.tests-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  /* Видимый скроллбар */
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f3f4f6;
}

.tests-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.tests-scroll-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.tests-scroll-container::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
  border: 2px solid #f3f4f6;
}

.tests-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Темная тема для скролла */
.dark .tests-scroll-container {
  scrollbar-color: #525252 #262626;
}

.dark .tests-scroll-container::-webkit-scrollbar-track {
  background: #262626;
}

.dark .tests-scroll-container::-webkit-scrollbar-thumb {
  background: #525252;
  border: 2px solid #262626;
}

.dark .tests-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #737373;
}

/* Контент вопросов */
.questions-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Пустые состояния */
.tests-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.questions-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

/* Badge styling */
.min-w-4 {
  min-width: 1rem;
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

  .tests-panel,
  .questions-panel {
    width: 100%;
    height: auto !important;
    min-height: calc(100vh - 60px);
    position: relative;
  }

  .tests-panel.hidden,
  .questions-panel.hidden {
    display: none;
  }

  /* Мобильная панель тестов когда активна */
  .mobile-tests-view {
    min-height: calc(100vh - 60px);
  }

  /* Мобильная панель вопросов когда активна */
  .mobile-questions-view {
    min-height: calc(100vh - 60px);
  }

  /* На мобильных убираем скроллбары и используем естественный скролл */
  .tests-scroll-container {
    overflow-y: visible;
    max-height: none;
  }

  .tests-scroll-container::-webkit-scrollbar {
    display: none;
  }

  .tests-scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .questions-content {
    min-height: calc(100vh - 200px);
  }
}

/* Анимации */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-colors {
    transition: none;
  }
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Disabled state styling */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Утилиты */
.min-h-0 {
  min-height: 0 !important;
}
</style>