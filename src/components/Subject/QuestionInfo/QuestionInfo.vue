<script setup>
import { whatStatus } from '../../../utils/utils.js';
import QuestionInfoItem from "./QuestionInfoItem.vue";
import { computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});

// Computed properties for formatted data
const formattedSubjectName = computed(() => {
  if (!props.question.subject_name) return '---';
  return props.question.subject_name.split('_').join(' ');
});

const formattedCreatedDate = computed(() => {
  if (!props.question.created_at) return '---';
  return props.question.created_at.split('T')[0];
});

const formattedModeratedDate = computed(() => {
  if (!props.question.moderated_at) return '---';
  return props.question.moderated_at.split('T')[0];
});

const typeInfo = computed(() => {
  if (!props.question.type?.name) return { type: 'info', text: '---' };
  const typeName = props.question.type.name;
  return {
    type: whatStatus(typeName),
    text: typeName.charAt(0).toUpperCase() + typeName.slice(1)
  };
});

const statusInfo = computed(() => {
  if (!props.question.status) return { type: 'info', text: '---' };
  return {
    type: whatStatus(props.question.status),
    text: props.question.status.charAt(0).toUpperCase() + props.question.status.slice(1)
  };
});

const moderatorName = computed(() => {
  return props.question.moderator?.user_name || '---';
});

const creatorName = computed(() => {
  return props.question.creator?.user_name || '---';
});

const hasModeratorInfo = computed(() => {
  return props.question.moderator?.user_name !== undefined;
});

const hasModerationDate = computed(() => {
  return props.question.moderated_at !== undefined && props.question.moderated_at !== null;
});
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700/50 rounded-t-xl">
      <h3 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <i class="fa fa-info-circle text-blue-500"></i>
        Общая информация
      </h3>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-1">
      <!-- Subject -->
      <QuestionInfoItem
          title="Тематика"
          :value="formattedSubjectName"
          icon="fa fa-folder-open"
      />

      <!-- Question Type -->
      <QuestionInfoItem title="Тип вопроса" icon="fa fa-question-circle">
        <el-tag :type="typeInfo.type" size="small" effect="light">
          {{ typeInfo.text }}
        </el-tag>
      </QuestionInfoItem>

      <!-- Status -->
      <QuestionInfoItem title="Статус" icon="fa fa-flag">
        <el-tag
            :type="statusInfo.type"
            effect="dark"
            round
            size="small"
        >
          {{ statusInfo.text }}
        </el-tag>
      </QuestionInfoItem>

      <!-- Creator -->
      <QuestionInfoItem
          title="Создал"
          :value="creatorName"
          icon="fa fa-user"
      />

      <!-- Created Date -->
      <QuestionInfoItem
          title="Дата создания"
          :value="formattedCreatedDate"
          icon="fa fa-calendar"
      />

      <!-- Moderator (if exists) -->
      <QuestionInfoItem
          v-if="hasModeratorInfo"
          title="Модератор"
          :value="moderatorName"
          icon="fa fa-gavel"
      />

      <!-- Moderated Date (if exists) -->
      <QuestionInfoItem
          v-if="hasModerationDate"
          title="Дата модерации"
          :value="formattedModeratedDate"
          icon="fa fa-check-circle"
      />
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
</style>