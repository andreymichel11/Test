<template>
  <div class="app-container bg-gray-50 dark:bg-neutral-900">
    <!-- Mobile Navigation Tabs -->
    <div class="mobile-tabs lg:hidden bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-10">
      <div class="px-4 sm:px-6 py-3">
        <div class="flex gap-1 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
          <button
              @click="activePanel = 'tree'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'tree'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
          >
            <i class="fa fa-tree text-xs" />
            <span>Тематики</span>
          </button>
          <button
              @click="activePanel = 'questions'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'questions'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              :disabled="!isSubjectSelected"
          >
            <i class="fa fa-list text-xs" />
            <span>Вопросы</span>
          </button>
          <button
              @click="activePanel = 'details'"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
              :class="activePanel === 'details'
              ? 'bg-white dark:bg-neutral-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              :disabled="!isQuestionSelected"
          >
            <i class="fa fa-info-circle text-xs" />
            <span>Детали</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="main-layout-container">
      <!-- Tree Sidebar -->
      <aside
          class="tree-sidebar bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700"
          :class="{
            'hidden': activePanel !== 'tree' && isMobileView,
            'lg:block': !isMobileView,
            'mobile-tree-view': isMobileView && activePanel === 'tree'
          }"
          :style="!isMobileView ? { height: treeHeight } : {}"
      >
        <!-- Sidebar Header -->
        <div class="sidebar-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-tree text-green-500 text-sm" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Структура тематик
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Выберите тематику для работы
                </p>
              </div>
            </div>

            <!-- Add Root Subject Button -->
            <button
                @click="createSubjectIsOpen(true)"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                     transition-colors duration-200 flex items-center gap-2"
                title="Добавить корневую тематику"
            >
              <i class="fa fa-plus text-xs" />
              <span class="hidden lg:inline">Корневая</span>
            </button>
          </div>
        </div>

        <!-- Tree Content with VISIBLE scroll -->
        <div class="tree-scroll-container">
          <Tree
              :subjects="subjectStore.newSubjectsStruct"
              :select="nodeSelected"
              :create="createSubjectIsOpen"
          />
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="content-area" :style="isMobileView && activePanel=== 'tree'?'display:none':''">
        <!-- Questions Panel -->
        <section
            class="questions-panel bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700"
            :class="{ 'hidden': activePanel !== 'questions' && isMobileView, 'lg:block': !isMobileView }"
        >
          <!-- Questions Header -->
          <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i class="fa fa-list text-blue-500 text-sm" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    Вопросы тематики
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ isSubjectSelected ? `${subjectStore.selectSubject.name.split('_').join(' ')}` : 'Выберите тематику' }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="isSubjectSelected" class="flex flex-wrap gap-2">
                <button
                    @click="createSubjectIsOpen(false)"
                    class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                         transition-colors duration-200 flex items-center gap-2"
                >
                  <i class="fa fa-plus text-xs" />
                  <span class="hidden sm:inline">Подтематика</span>
                </button>
                <button
                    @click="createQuestion"
                    class="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg
                         transition-colors duration-200 flex items-center gap-2"
                >
                  <i class="fa fa-question-circle text-xs" />
                  <span class="hidden sm:inline">Вопрос</span>
                </button>
                <button
                    @click="refreshSubjectQuestions"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-100
                         dark:hover:bg-neutral-700 rounded-lg transition-all duration-200"
                    title="Обновить"
                >
                  <i class="fa fa-refresh text-sm" />
                </button>
                <div v-if="canDeleteSubject">
                  <button
                      @click="delSubject"
                      class="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                           rounded-lg transition-all duration-200"
                      title="Удалить тематику"
                  >
                    <i class="fa fa-trash text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Questions List Content -->
          <div class="questions-content">
            <div v-if="hasQuestions">
              <SubjectQuestions
                  :questions="questionStore.subjectQuestions[subjectStore.selectSubject.title]"
                  :set-questions="handleCurrentChange"
              />
            </div>
            <div v-else class="questions-empty-state">
              <div class="text-center max-w-sm px-4">
                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-neutral-700
                            rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i class="fa fa-inbox text-gray-400 text-xl sm:text-2xl" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {{ questionsEmptyText }}
                </h3>
              </div>
            </div>
          </div>
        </section>

        <!-- Question Details Panel -->
        <section
            v-if="isQuestionSelected"
            class="details-panel bg-white dark:bg-neutral-800"
            :class="{ 'hidden': activePanel !== 'details' && isMobileView, 'lg:block': !isMobileView }"
        >
          <!-- Details Header -->
          <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <i class="fa fa-info-circle text-purple-500 text-sm" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    Детали вопроса
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Просмотр и редактирование
                  </p>
                </div>
              </div>

              <!-- Question Action Buttons -->
              <div class="flex flex-wrap gap-2">
                <button
                    v-if="isCurrentUserOwner"
                    @click="updateQuestion"
                    class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                         transition-colors duration-200 flex items-center gap-2"
                >
                  <i class="fa fa-edit text-xs" />
                  <span class="hidden sm:inline">Изменить</span>
                </button>
                <button
                    v-if="canModerate"
                    @click="moderateStore.setIsModerateOpened()"
                    class="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg
                         transition-colors duration-200 flex items-center gap-2"
                >
                  <i class="fa fa-gavel text-xs" />
                  <span class="hidden sm:inline">Модерация</span>
                </button>
                <button
                    v-if="isCurrentUserOwner"
                    @click="questionStore.delQuestion(route.name.toLowerCase())"
                    class="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                         rounded-lg transition-all duration-200"
                    title="Удалить вопрос"
                >
                  <i class="fa fa-trash text-sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- Question Content -->
          <div class="details-content p-4 sm:p-6">
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 h-full">
              <div>
                <QuestionInfo :question="questionStore.currentQuestion" />
              </div>
              <div>
                <Question :question="questionStore.currentQuestion" />
              </div>
            </div>
          </div>
        </section>

        <!-- Empty state when no question selected -->
        <section
            v-else
            class="details-panel bg-white dark:bg-neutral-800"
            :class="{ 'hidden': activePanel !== 'details' && isMobileView, 'lg:block': !isMobileView }"
        >
          <div class="panel-header p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <i class="fa fa-info-circle text-purple-500 text-sm" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Детали вопроса
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Выберите вопрос
                </p>
              </div>
            </div>
          </div>
          <div class="empty-state-content p-6">
            <div class="text-center max-w-sm px-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-neutral-700
                          rounded-xl flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-mouse-pointer text-gray-400 text-xl sm:text-2xl" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ detailsEmptyText }}
              </h3>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Modals -->
    <CreateSubject v-if="subjectStore.createIsOpened" :is-top="isTop" />
    <CreateQuestion v-if="questionStore.isCreateQuestionOpened" />
    <ModerateDialog v-if="moderateStore.isModerateOpened" />
    <UpdateQuestion v-if="questionStore.isUpdateQuestionOpened" />
  </div>
</template>

<script setup>
import { useSubjectStore } from '../store/SubjectStore.js'
import { onBeforeMount, onMounted, onUnmounted, ref, computed, nextTick, watch } from 'vue'
import { useQuestionStore } from '../store/QuestionStore.js'
import { useModerateStore } from '../store/ModerateStore.js'
import { useUsersStore } from '../store/UsersStore.js'
import { useRoute } from 'vue-router'
import 'sl-vue-tree-next/sl-vue-tree-next-minimal.css'

// Components
import Tree from '../components/Subject/Tree.vue'
import SubjectQuestions from '../components/Subject/SubjectQuestions.vue'
import QuestionInfo from '../components/Subject/QuestionInfo/QuestionInfo.vue'
import Question from '../components/Subject/QuestionInfo/Question.vue'
import CreateSubject from '../components/Subject/CreateSubject.vue'
import CreateQuestion from '../components/Questions/CreateQuestion.vue'
import ModerateDialog from '../components/Moderate/ModerateDialog.vue'
import UpdateQuestion from '../components/Questions/UpdateQuestion.vue'

// Stores
const route = useRoute()
const subjectStore = useSubjectStore()
const questionStore = useQuestionStore()
const moderateStore = useModerateStore()
const usersStore = useUsersStore()

// Reactive state
const isTop = ref(false)
const isMobileView = ref(false)
const activePanel = ref('tree') // 'tree', 'questions', 'details'
const treeHeight = ref('auto')

// Computed properties
const isSubjectSelected = computed(() =>
    subjectStore.selectSubject !== null &&
    Object.keys(subjectStore.selectSubject).length > 0
)

const hasQuestions = computed(() =>
    isSubjectSelected.value &&
    questionStore.subjectQuestions[subjectStore.selectSubject.title]?.length > 0
)

const isQuestionSelected = computed(() =>
    questionStore.currentQuestion !== null &&
    Object.keys(questionStore.currentQuestion).length > 0
)

const canDeleteSubject = computed(() =>
    isSubjectSelected.value &&
    questionStore.subjectQuestions[subjectStore.selectSubject.title]?.length === 0 &&
    subjectStore.selectSubject.children.length === 0
)

const isCurrentUserOwner = computed(() =>
    isQuestionSelected.value &&
    questionStore.currentQuestion.creator.user_name.toLowerCase() === usersStore.getUser.toLowerCase()
)

const canModerate = computed(() =>
    isQuestionSelected.value &&
    questionStore.currentQuestion.status.toLowerCase() === 'создан'
)

const questionsEmptyText = computed(() => {
  if (!isSubjectSelected.value) return 'Выберите тематику'
  if (!hasQuestions.value) return `В тематике '${subjectStore.selectSubject.name.split('_').join(' ')}' вопросов нет`
  return ''
})

const detailsEmptyText = computed(() => {
  if (!isSubjectSelected.value) return 'Выберите тематику, а затем вопрос'
  return 'Выберите доступный вопрос из тематики'
})

// Methods
const handleResize = () => {
  isMobileView.value = window.innerWidth < 1024
  if (!isMobileView.value) {
    syncTreeHeight()
  }
}

// Синхронизация высоты дерева с правым контентом
const syncTreeHeight = async () => {
  await nextTick()
  if (isMobileView.value) return

  const rightContent = document.querySelector('.content-area')
  const minHeight = window.innerHeight * 0.85

  if (rightContent) {
    // Если есть вопрос, используем реальную высоту контента
    // Если нет - используем минимальную высоту
    const height = isQuestionSelected.value
        ? Math.max(rightContent.scrollHeight, minHeight)
        : minHeight

    treeHeight.value = `${height}px`
  }
}

const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    subjectStore.setIsSelect(subjectStore.subjects.find(sub => sub.name === nodes[0].title))

    if (questionStore.subjectQuestions[subjectStore.selectSubject.title] === undefined) {
      questionStore.getSubjectQuestions(subjectStore.selectSubject.title, subjectStore.selectSubject.id)
      questionStore.currentQuestion = {}
    }

    // Auto-switch to questions panel on mobile after selection
    if (window.innerWidth < 1024) {
      activePanel.value = 'questions'
    }

    nextTick(syncTreeHeight)
  }
}

const refreshSubjectQuestions = () => {
  if (!isSubjectSelected.value) return
  questionStore.getSubjectQuestions(subjectStore.selectSubject.title, subjectStore.selectSubject.id)
  questionStore.currentQuestion = {}
  nextTick(syncTreeHeight)
}

const handleCurrentChange = (question) => {
  questionStore.currentQuestion = question

  // Auto-switch to details panel on mobile after question selection
  if (window.innerWidth < 1024) {
    activePanel.value = 'details'
  }

  nextTick(syncTreeHeight)
}

const createSubjectIsOpen = (top) => {
  isTop.value = top
  subjectStore.setCreateIsOpened()
}

const createQuestion = () => {
  if (!isSubjectSelected.value) return
  questionStore.setIsCreateQuestionOpened()
  questionStore.newQuestion.subject_id = subjectStore.selectSubject.id
}

const delSubject = () => {
  if (!isSubjectSelected.value) return
  subjectStore.delSubject(subjectStore.selectSubject.id).then(() => {
    subjectStore.setIsSelect(null)
    activePanel.value = 'tree'
    nextTick(syncTreeHeight)
  })
}

const updateQuestion = () => {
  if (!isQuestionSelected.value || !isSubjectSelected.value) return

  questionStore.newQuestion.subject_id = subjectStore.selectSubject.id
  questionStore.newQuestion.text = questionStore.currentQuestion.text
  questionStore.newQuestion.code = questionStore.currentQuestion.code
  questionStore.newQuestion.variants = JSON.parse(JSON.stringify(questionStore.currentQuestion.variants))
  questionStore.newQuestion.answer = JSON.parse(JSON.stringify(questionStore.currentQuestion.answer))
  questionStore.newQuestion.type_id = questionStore.currentQuestion.type.id
  questionStore.setIsUpdateQuestionOpened()
  questionStore.getQuestionsTypes()
  nextTick(syncTreeHeight)
}

// Lifecycle
onBeforeMount(() => {
  subjectStore.getSubjects(false)
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)

  // Начальная синхронизация высоты
  syncTreeHeight()

  // Наблюдаем за изменениями контента
  const observer = new MutationObserver(syncTreeHeight)
  const rightContent = document.querySelector('.content-area')
  if (rightContent) {
    observer.observe(rightContent, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
})

// Следим за изменением выбранного вопроса
watch(isQuestionSelected, () => {
  nextTick(syncTreeHeight)
})

onUnmounted(() => {
  subjectStore.setIsSelect(null)
  questionStore.currentQuestion = {}
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Основной контейнер - минимальная высота с возможностью роста */
.app-container {
  min-height: 85vh; /* Минимальная высота, но может расти */
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
  min-height: calc(85vh - 60px); /* Минимальная высота */
}

/* Десктоп версия */
@media (min-width: 1024px) {
  .main-layout-container {
    align-items: flex-start; /* Выравнивание по верху для sticky сайдбара */
  }

  /* Когда нет вопроса - растягиваем content-area на минимум 85vh */
  .content-area:has(.details-panel:not(:has(.details-content))) {
    min-height: 85vh;
  }
}

/* Левая панель с деревом */
.tree-sidebar {
  width: 24rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  min-height: 85vh; /* Минимальная высота */
  align-self: flex-start;
  overflow: hidden;
}

@media (min-width: 1280px) {
  .tree-sidebar {
    width: 28rem;
  }
}

/* Заголовок сайдбара */
.sidebar-header {
  flex-shrink: 0;
}

/* Контент дерева с видимым скроллом */
.tree-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* Позволяет flex сжиматься */
  padding-right: 4px;

  /* Видимый скроллбар */
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f3f4f6;
}

.tree-scroll-container::-webkit-scrollbar {
  width: 10px;
}

.tree-scroll-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 5px;
}

.tree-scroll-container::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 5px;
  border: 2px solid #f3f4f6;
}

.tree-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Темная тема для скролла дерева */
.dark .tree-scroll-container {
  scrollbar-color: #525252 #262626;
}

.dark .tree-scroll-container::-webkit-scrollbar-track {
  background: #262626;
}

.dark .tree-scroll-container::-webkit-scrollbar-thumb {
  background: #525252;
  border: 2px solid #262626;
}

.dark .tree-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #737373;
}

/* Правая область контента */
.content-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 85vh; /* Минимальная высота */
}

/* Панель вопросов */
.questions-panel {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

/* Контент вопросов */
.questions-content {
  /* Без ограничений высоты - растет по контенту */
}

/* Пустое состояние вопросов */
.questions-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

/* Панель деталей - растягивается на всё оставшееся место */
.details-panel {
  flex: 1; /* Занимает всё оставшееся пространство */
  display: flex;
  flex-direction: column;
  min-height: 500px; /* Увеличиваем минимальную высоту */
}

/* Контент деталей */
.details-content {
  flex: 1; /* Растягивается внутри панели */
  display: flex;
  flex-direction: column;
}

/* Пустое состояние деталей */
.empty-state-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px; /* Увеличиваем минимальную высоту для заполнения */
}

/* Заголовки панелей */
.panel-header {
  flex-shrink: 0;
}

/* Мобильная версия - упрощенная без лишних скроллов */
@media (max-width: 1023px) {
  .app-container {
    min-height: 100vh; /* Минимальная высота на мобильных */
    height: auto;
  }

  .main-layout-container {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 60px);
  }

  .tree-sidebar {
    width: 100%;
    height: auto !important; /* Автоматическая высота */
    min-height: auto; /* Убираем фиксированную минимальную высоту */
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .tree-sidebar.hidden {
    display: none;
  }

  .content-area {
    width: 100%;
    height: auto;
    min-height: calc(100vh - 60px);
  }

  .questions-panel,
  .details-panel {
    width: 100%;
    height: auto;
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
  }

  .questions-panel.hidden,
  .details-panel.hidden {
    display: none;
  }

  /* Убираем ограничения высоты и лишние скроллы на мобильных */
  .tree-scroll-container {
    flex: 0 1 auto; /* Подстраивается под контент, не растягивается */
    height: auto;
    overflow-y: visible; /* Убираем скролл */
    max-height: none; /* Убираем ограничение */
  }

  .questions-content {
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
    overflow-y: visible; /* Убираем скролл */
  }

  .details-content {
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
  }

  /* Мобильное дерево когда активно */
  .mobile-tree-view {
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
  }

  /* На мобильных убираем скроллбар у дерева */
  .tree-scroll-container::-webkit-scrollbar {
    display: none;
  }

  .tree-scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
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


</style>