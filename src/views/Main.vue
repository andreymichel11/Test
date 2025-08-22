<script setup>
import SmallCard from "../components/Main/SmallCard.vue";
import BigCard from "../components/Main/BigCard.vue";
import CreateQuestion from "../components/Questions/CreateQuestion.vue";
import { useSubjectStore } from "../store/SubjectStore.js";
import { useQuestionStore } from "../store/QuestionStore.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/AuthStore.js";
import { useUsersStore } from "../store/UsersStore.js";
import { computed } from 'vue';

const SubjectStore = useSubjectStore();
const QuestionStore = useQuestionStore();
const AuthStore = useAuthStore();
const UsersStore = useUsersStore();
const router = useRouter();

// Computed properties for better reactivity
const isAdmin = computed(() => AuthStore.access_token !== null && UsersStore.getRole === 'admin');
const statistics = computed(() => SubjectStore.statistic);
const chartData = computed(() => ({
  labels: SubjectStore.chartLabelArray,
  counts: SubjectStore.chartCountArray
}));

// Navigation handlers
const handleNewTest = () => router.push({ name: 'NewTest' });
const handleNewQuestion = () => router.push({ name: 'NewQuestion' });
</script>

<template>
  <div class="min-h-[var(--main-height)] relative px-4 sm:px-6 lg:px-8">
    <!-- Background -->
<!--    <div class="absolute inset-0 z-[-1] lg:bg-[image:var(&#45;&#45;main-bg-image)] bg-right-bottom bg-auto bg-no-repeat"></div>-->

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-10 mb-6 sm:mb-10">
      <el-button
          type="primary"
          size="large"
          @click="handleNewTest"
          class="flex-1 sm:flex-initial sm:max-w-xs"
      >
        Сгенерировать тест
      </el-button>
      <div></div>
      <el-button
          type="primary"
          size="large"
          @click="handleNewQuestion"
          class="flex-1 sm:flex-initial sm:max-w-xs"
      >
        Добавить новый вопрос
      </el-button>
    </div>

    <!-- Cards Grid - Unified Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-10">
      <!-- Small Card 1 -->
      <SmallCard
          class="col-span-1 md:col-span-1 lg:col-span-1"
          title="Всего тематик:"
          :count="statistics.subject_count"
          :is-go="isAdmin"
          go="Subjects"
      />

      <!-- Small Card 2 -->
      <SmallCard
          class="col-span-1 md:col-span-1 lg:col-span-1"
          title="Всего вопросов:"
          :count="statistics.question_count"
      />

      <!-- Small Card 3 -->
      <SmallCard
          class="col-span-1 md:col-span-1 lg:col-span-1 md:row-start-2 lg:row-start-2"
          title="Моих вопросов:"
          :count="statistics.question_count_created_by_current_user"
          :is-go="true"
          go="MyQuestions"
      />

      <!-- Small Card 4 -->
      <SmallCard
          class="col-span-1 md:col-span-1 lg:col-span-1 md:row-start-2 lg:row-start-2"
          title="Сгенерированных тестов:"
          :count="statistics.test_count_created_by_current_user"
          :is-go="true"
          go="Tests"
      />

      <!-- Big Card -->
      <BigCard
          class="col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:row-start-1"
          title="Топ тематик:"
          :label="chartData.labels"
          :count="chartData.counts"
      />
    </div>

    <!-- Modal -->
    <CreateQuestion v-if="QuestionStore.isCreateQuestionOpened" />
  </div>
</template>