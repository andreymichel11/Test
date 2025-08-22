<script setup>
import { onMounted } from "vue";
import SubjectTreeComponent from "../Subject/SubjectTreeComponent.vue";
import Question from "../Subject/QuestionInfo/Question.vue";
import SubjectQuestions from "../Subject/SubjectQuestions.vue";
import QuestionInfo from "../Subject/QuestionInfo/QuestionInfo.vue";
import { useSubjectStore } from "../../store/SubjectStore.js";
import { useQuestionStore } from "../../store/QuestionStore.js";
import { useTestStore } from "../../store/TestStore.js";

const SubjectStore = useSubjectStore()
const QuestionStore = useQuestionStore()
const TestStore = useTestStore()

const props = defineProps({
  back: {
    type: Function,
    required: true
  },
  next: {
    type: Function,
    required: true
  }
})

const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    TestStore.setCurrentSubject(SubjectStore.subjects.find(sub => sub.name === nodes[0].title));

    if (QuestionStore.subjectQuestions[TestStore.currentSubject.title] === undefined) {
      QuestionStore.getSubjectQuestionsApprove(TestStore.currentSubject.title, TestStore.currentSubject.id);
      QuestionStore.currentQuestion = {}
    }
  }
}

const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question
}

onMounted(() => {
  QuestionStore.getQuestionsStatuses()
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-neutral-900">
    <!-- Header -->
    <div class="flex-shrink-0 px-6 py-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        Выберите вопросы
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Выберите тематику и добавьте вопросы в тест
      </p>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-6" style="height: calc(100vh - 180px);">
      <div class="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Subject Tree -->
        <div class="lg:col-span-1" style="height: 100%;">
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
            <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i class="fa fa-sitemap text-blue-500 text-sm"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Тематики
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Выберите категорию
                  </p>
                </div>
              </div>
            </div>

            <div class="flex-1 tree-scroll-container p-4">
              <Suspense>
                <template #default>
                  <SubjectTreeComponent
                      :subjects="SubjectStore.newSubjectsStruct"
                      :select="nodeSelected"
                      v-if="SubjectStore.newSubjectsStruct !== null"
                  />
                </template>
                <template #fallback>
                  <div class="flex items-center justify-center h-40">
                    <div class="text-center">
                      <div class="loading-spinner mx-auto mb-4"></div>
                      <p class="text-gray-500 dark:text-gray-400">Загрузка тематик...</p>
                    </div>
                  </div>
                </template>
              </Suspense>
            </div>
          </div>
        </div>

        <!-- Questions and Details -->
        <div class="lg:col-span-3 flex flex-col gap-6" style="height: 100%;">
          <!-- Questions List -->
          <div class="flex-shrink-0" style="height: 340px;">
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
              <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <i class="fa fa-list text-green-500 text-sm"></i>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">
                        Список вопросов
                      </h3>
                      <p class="text-xs text-gray-600 dark:text-gray-400">
                        Доступные вопросы из выбранной тематики
                      </p>
                    </div>
                  </div>

                  <div v-if="TestStore.currentSubject" class="text-sm text-gray-600 dark:text-gray-400">
                    {{ TestStore.currentSubject.name.split('_').join(' ') }}
                  </div>
                </div>
              </div>

              <div class="flex-1  p-2">
                <div v-if="TestStore.currentSubject !== null && QuestionStore.subjectQuestions[TestStore.currentSubject.title]?.length > 0" class="h-full">
                  <SubjectQuestions
                      :questions="QuestionStore.subjectQuestions[TestStore.currentSubject.title]"
                      :set-questions="handleCurrentChange"
                      :no-container="true"
                  />
                </div>

                <div v-else class="h-full flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <i class="fa fa-question-circle text-gray-400 text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {{ TestStore.currentSubject === null ? 'Выберите тематику' : 'Нет доступных вопросов' }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ TestStore.currentSubject === null
                        ? 'Выберите тематику из дерева слева'
                        : `В тематике "${TestStore.currentSubject.name.split('_').join(' ')}" нет вопросов` }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question Details -->
          <div class="flex-1">
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 h-full flex flex-col">
              <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-700">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <i class="fa fa-eye text-purple-500 text-sm"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      Предварительный просмотр
                    </h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Детали выбранного вопроса
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex-1 overflow-hidden p-4">
                <div v-if="QuestionStore.currentQuestion !== null && Object.keys(QuestionStore.currentQuestion).length > 0" class="h-full flex gap-4">
                  <div class="flex-1 overflow-y-auto details-scroll-area">
                    <QuestionInfo :question="QuestionStore.currentQuestion"/>
                  </div>
                  <div class="flex-1 overflow-y-auto details-scroll-area">
                    <Question :question="QuestionStore.currentQuestion"/>
                  </div>
                </div>

                <div v-else class="h-full flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <i class="fa fa-search text-gray-400 text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Выберите вопрос
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ TestStore.currentSubject === null
                        ? 'Сначала выберите тематику'
                        : 'Выберите доступный вопрос из списка выше' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-shrink-0 p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
      <div class="flex items-center justify-between">
        <!-- Progress Info -->
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <i class="fa fa-list-ol text-blue-500"></i>
            <span class="text-gray-700 dark:text-gray-300">
              Выбрано вопросов: {{ TestStore.testQuestions.question_ids.length }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <el-button
              size="large"
              @click="back"
              class="secondary-action h-10 px-6 font-semibold"
          >
            <i class="fa fa-arrow-left mr-2"></i>
            Назад
          </el-button>

          <el-button
              v-if="TestStore.testQuestions.question_ids.length > 0"
              type="primary"
              size="large"
              @click="next"
              class="primary-action h-10 px-6 font-semibold"
          >
            <i class="fa fa-arrow-right mr-2"></i>
            Продолжить
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.primary-action {
  background: #8b5cf6;
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary-action:hover {
  background: #7c3aed;
  transform: translateY(-1px);
}

.secondary-action {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.secondary-action:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark theme */
:deep(.dark .secondary-action) {
  background: #262626;
  border-color: #404040;
  color: #d1d5db;
}

:deep(.dark .secondary-action:hover) {
  background: #404040;
  border-color: #525252;
}

/* Details scroll area styling */
.details-scroll-area::-webkit-scrollbar {
  width: 8px !important;
}

.details-scroll-area::-webkit-scrollbar-track {
  background: #f8fafc !important;
  border-radius: 4px !important;
  border: 1px solid #e2e8f0 !important;
}

.details-scroll-area::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
  border: 1px solid #f8fafc !important;
  transition: all 0.2s ease !important;
  min-height: 20px !important;
}

.details-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #9ca3af !important;
}

/* Dark theme for details scroll */
:deep(.dark) .details-scroll-area::-webkit-scrollbar-track {
  background: #475569;
  border-color: #64748b;
}

:deep(.dark) .details-scroll-area::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-color: #475569;
}

:deep(.dark) .details-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Tree scroll container - forced visibility */
.tree-scroll-container {
  overflow-y: auto !important;
}

.tree-scroll-container::-webkit-scrollbar {
  width: 8px !important;
  background: transparent;
}

.tree-scroll-container::-webkit-scrollbar-track {
  background: #f8fafc !important;
  border-radius: 4px !important;
  border: 1px solid #e2e8f0 !important;
}

.tree-scroll-container::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
  border: 1px solid #f8fafc !important;
  transition: all 0.2s ease !important;
  min-height: 20px !important;
}

.tree-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af !important;
}

/* Dark theme for tree container */
.dark .tree-scroll-container::-webkit-scrollbar-track {
  background: #475569 !important;
  border-color: #64748b !important;
}

.dark .tree-scroll-container::-webkit-scrollbar-thumb {
  background: #94a3b8 !important;
  border-color: #475569 !important;
}

.dark .tree-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1 !important;
}

/* Firefox scrollbar support */
.tree-scroll-area,
.questions-scroll-area,
.details-scroll-area,
.tree-scroll-container {
  scrollbar-width: auto;
  scrollbar-color: #cbd5e1 #f8fafc;
}

:deep(.dark) .tree-scroll-area,
:deep(.dark) .questions-scroll-area,
:deep(.dark) .details-scroll-area,
.dark .tree-scroll-container {
  scrollbar-color: #94a3b8 #475569;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  .lg\:col-span-1,
  .lg\:col-span-3 {
    grid-column: span 1;
  }
}
</style>