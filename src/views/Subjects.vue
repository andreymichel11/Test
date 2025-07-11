<script setup>
import { useSubjectStore } from "../store/SubjectStore.js";
import { onBeforeMount, onMounted, onUnmounted, ref, computed } from "vue";
import { useQuestionStore } from "../store/QuestionStore.js";
import { useModerateStore } from "../store/ModerateStore.js";
import { useUsersStore } from "../store/UsersStore.js";
import { useRoute } from "vue-router";
import 'sl-vue-tree-next/sl-vue-tree-next-minimal.css';

// Components
import Tree from "../components/Subject/Tree.vue";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import QuestionInfo from "../components/Subject/QuestionInfo/QuestionInfo.vue";
import Question from "../components/Subject/QuestionInfo/Question.vue";
import CreateSubject from "../components/Subject/CreateSubject.vue";
import CreateQuestion from "../components/Questions/CreateQuestion.vue";
import ModerateDialog from "../components/Moderate/ModerateDialog.vue";
import UpdateQuestion from "../components/Questions/UpdateQuestion.vue";

// Stores
const route = useRoute();
const SubjectStore = useSubjectStore();
const QuestionStore = useQuestionStore();
const ModerateStore = useModerateStore();
const UsersStore = useUsersStore();

// Reactive state
const isTop = ref(false);
const isMobileView = ref(false);
const activePanel = ref('tree'); // 'tree', 'questions', 'details'
const containerHeight = ref('calc(100vh - 120px)');

// Computed properties
const isSubjectSelected = computed(() =>
    SubjectStore.selectSubject !== null && Object.keys(SubjectStore.selectSubject).length > 0
);

const hasQuestions = computed(() =>
    isSubjectSelected.value &&
    QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length > 0
);

const isQuestionSelected = computed(() =>
    QuestionStore.currentQuestion !== null &&
    Object.keys(QuestionStore.currentQuestion).length > 0
);

const canDeleteSubject = computed(() =>
    isSubjectSelected.value &&
    QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length === 0 &&
    SubjectStore.selectSubject.children.length === 0
);

const isCurrentUserOwner = computed(() =>
    isQuestionSelected.value &&
    QuestionStore.currentQuestion.creator.user_name.toLowerCase() === UsersStore.getUser.toLowerCase()
);

const canModerate = computed(() =>
    isQuestionSelected.value &&
    QuestionStore.currentQuestion.status.toLowerCase() === 'создан'
);

const questionsEmptyText = computed(() => {
  if (!isSubjectSelected.value) return 'Выберите тематику';
  if (!hasQuestions.value) return `В тематике '${SubjectStore.selectSubject.name.split('_').join(' ')}' вопросов нет`;
  return '';
});

const detailsEmptyText = computed(() => {
  if (!isSubjectSelected.value) return 'Выберите тематику, а затем вопрос';
  return 'Выберите доступный вопрос из тематики';
});

// Methods


const handleResize = () => {
  isMobileView.value = window.innerWidth < 1024;
};

const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    SubjectStore.setIsSelect(SubjectStore.subjects.find(sub => sub.name === nodes[0].title));

    if (QuestionStore.subjectQuestions[SubjectStore.selectSubject.title] === undefined) {
      QuestionStore.getSubjectQuestions(SubjectStore.selectSubject.title, SubjectStore.selectSubject.id);
      QuestionStore.currentQuestion = {};
    }

    // Auto-switch to questions panel on mobile after selection
    if (window.innerWidth < 1024) {
      activePanel.value = 'questions';
    }
  }
};

const refreshSubjectQuestions = () => {
  if (!isSubjectSelected.value) return;
  QuestionStore.getSubjectQuestions(SubjectStore.selectSubject.title, SubjectStore.selectSubject.id);
  QuestionStore.currentQuestion = {};
};

const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question;

  // Auto-switch to details panel on mobile after question selection
  if (window.innerWidth < 1024) {
    activePanel.value = 'details';
  }
};

const createSubjectIsOpen = (top) => {
  isTop.value = top;
  SubjectStore.setCreateIsOpened();
};

const createQuestion = () => {
  if (!isSubjectSelected.value) return;
  QuestionStore.setIsCreateQuestionOpened();
  QuestionStore.newQuestion.subject_id = SubjectStore.selectSubject.id;
};

const delSubject = () => {
  if (!isSubjectSelected.value) return;
  SubjectStore.delSubject(SubjectStore.selectSubject.id).then(() => {
    SubjectStore.setIsSelect(null);
    activePanel.value = 'tree';
  });
};

const updateQuestion = () => {
  if (!isQuestionSelected.value || !isSubjectSelected.value) return;

  QuestionStore.newQuestion.subject_id = SubjectStore.selectSubject.id;
  QuestionStore.newQuestion.text = QuestionStore.currentQuestion.text;
  QuestionStore.newQuestion.code = QuestionStore.currentQuestion.code;
  QuestionStore.newQuestion.variants = JSON.parse(JSON.stringify(QuestionStore.currentQuestion.variants));
  QuestionStore.newQuestion.answer = JSON.parse(JSON.stringify(QuestionStore.currentQuestion.answer));
  QuestionStore.newQuestion.type_id = QuestionStore.currentQuestion.type.id;
  QuestionStore.setIsUpdateQuestionOpened();
  QuestionStore.getQuestionsTypes();
};

// Lifecycle
onBeforeMount(() => {
  SubjectStore.getSubjects(false);
});

onMounted(() => {
  handleResize();

  window.addEventListener('resize', handleResize);


});

onUnmounted(() => {
  SubjectStore.setIsSelect(null);
  QuestionStore.currentQuestion = {};
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div
      class="flex flex-col lg:flex-row gap-4 lg:gap-10 p-4 lg:p-0 overflow-hidden "

  >
    <!-- Mobile Navigation Tabs -->
    <div class="lg:hidden bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-1 mb-4 flex-shrink-0">
      <div class="flex gap-1">
        <button
            @click="activePanel = 'tree'"
            class="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="activePanel === 'tree'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'"
        >
          <i class="fa fa-tree mr-2"></i>
          Тематики
        </button>
        <button
            @click="activePanel = 'questions'"
            class="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="activePanel === 'questions'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'"
            :disabled="!isSubjectSelected"
        >
          <i class="fa fa-list mr-2"></i>
          Вопросы
        </button>
        <button
            @click="activePanel = 'details'"
            class="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="activePanel === 'details'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'"
            :disabled="!isQuestionSelected"
        >
          <i class="fa fa-info-circle mr-2"></i>
          Детали
        </button>
      </div>
    </div>

    <!-- Tree Panel -->
    <div
        class="lg:w-[30%] transition-all duration-300 flex-shrink-0"
        :class="{ 'hidden lg:block': activePanel !== 'tree' }"
    >
      <Tree
          :subjects="SubjectStore.newSubjectsStruct"
          :select="nodeSelected"
          :create="createSubjectIsOpen"
          class="h-full"
      />
    </div>

    <!-- Content Panels -->
    <div class="flex-1 flex flex-col gap-4 lg:gap-6 min-h-0 overflow-hidden">
      <!-- Questions Panel -->
      <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300"
          :class="[
          'lg:h-[35%] min-h-[250px]',
          { 'hidden lg:block': activePanel !== 'questions' && activePanel !== 'tree' }
        ]"
      >
        <div class="p-4 lg:p-6 h-full flex flex-col">
          <!-- Questions Header -->
          <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
              v-if="isSubjectSelected"
          >
            <div class="flex flex-wrap gap-2">
              <button
                  @click="createSubjectIsOpen(false)"
                  class="px-3 py-2 bg-[var(--color-main-text)] hover:bg-[var(--color-main-hover-text)] text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <i class="fa fa-plus mr-1"></i>
                <span class="hidden sm:inline">Добавить подтематику</span>
                <span class="sm:hidden">Подтематика</span>
              </button>
              <button
                  @click="createQuestion"
                  class="px-3 py-2 bg-[#67c23a] hover:bg-[#74d743] text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <i class="fa fa-question-circle mr-1"></i>
                <span class="hidden sm:inline">Добавить вопрос</span>
                <span class="sm:hidden">Вопрос</span>
              </button>
            </div>

            <div class="flex gap-2">
              <button
                  @click="refreshSubjectQuestions"
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200"
                  title="Обновить"
              >
                <i class="fa fa-refresh"></i>
              </button>

              <el-popconfirm
                  v-if="canDeleteSubject"
                  title="Вы уверены что хотите удалить данную тематику?"
                  width="220"
                  @confirm="delSubject"
              >
                <template #reference>
                  <button
                      class="p-2 text-red-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Удалить тематику"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </template>
                <template #actions="{ confirm, cancel }">
                  <el-button type="danger" size="small" @click="confirm">Да</el-button>
                  <el-button size="small" @click="cancel">Нет</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>

          <!-- Questions List -->
          <div class="flex-1 overflow-hidden">
            <SubjectQuestions
                v-if="hasQuestions"
                :questions="QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]"
                :set-questions="handleCurrentChange"
                class="h-full"
            />
            <div v-else class="h-full flex items-center justify-center">
              <el-empty :description="questionsEmptyText" />
            </div>
          </div>
        </div>
      </div>

      <!-- Question Details Panel -->
      <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg flex-1 transition-all duration-300"
          :class="[
          'lg:h-[65%] min-h-[400px]',
          { 'hidden lg:block': activePanel !== 'details' && activePanel !== 'tree' }
        ]"
      >
        <div class="p-4 lg:p-6 h-full flex flex-col">
          <!-- Details Header -->
          <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
              v-if="isQuestionSelected"
          >
            <div class="flex flex-wrap gap-2">
              <button
                  v-if="isCurrentUserOwner"
                  @click="updateQuestion"
                  class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <i class="fa fa-edit mr-1"></i>
                <span class="hidden sm:inline">Изменить вопрос</span>
                <span class="sm:hidden">Изменить</span>
              </button>

              <button
                  v-if="canModerate"
                  @click="ModerateStore.setIsModerateOpened()"
                  class="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <i class="fa fa-gavel mr-1"></i>
                <span class="hidden sm:inline">Модерировать</span>
                <span class="sm:hidden">Модерация</span>
              </button>
            </div>

            <button
                v-if="isCurrentUserOwner"
                @click="QuestionStore.delQuestion(route.name.toLowerCase())"
                class="p-2 text-red-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 self-start sm:self-auto"
                title="Удалить вопрос"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>

          <!-- Question Content -->
          <div class="flex-1 overflow-hidden">
            <div
                v-if="isQuestionSelected"
                class="h-full flex flex-col lg:flex-row gap-4"
            >
              <QuestionInfo
                  :question="QuestionStore.currentQuestion"
                  class="lg:w-2/5 flex-shrink-0"
              />
              <Question
                  :question="QuestionStore.currentQuestion"
                  class="flex-1"
              />
            </div>
            <div v-else class="h-full flex items-center justify-center">
              <el-empty :description="detailsEmptyText" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <CreateSubject v-if="SubjectStore.createIsOpened" :is-top="isTop" />
  <CreateQuestion v-if="QuestionStore.isCreateQuestionOpened" />
  <ModerateDialog v-if="ModerateStore.isModerateOpened" />
  <UpdateQuestion v-if="QuestionStore.isUpdateQuestionOpened" />
</template>