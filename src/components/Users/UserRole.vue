<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: 'user'
  }
})

const roleConfig = computed(() => {
  const role = (props.type || 'user').toLowerCase()

  const configs = {
    admin: {
      color: 'danger',
      bgClass: 'bg-red-100 text-red-800 border-red-200',
      darkBgClass: 'dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
      icon: 'fa-star',
      label: 'Админ'
    },
    moderator: {
      color: 'warning',
      bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      darkBgClass: 'dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800',
      icon: 'fa-shield',
      label: 'Модератор'
    },
    user: {
      color: 'success',
      bgClass: 'bg-blue-100 text-blue-800 border-blue-200',
      darkBgClass: 'dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
      icon: 'fa-user',
      label: 'Пользователь'
    }
  }

  return configs[role] || configs.user
})

const formattedLabel = computed(() => {
  if (!props.type) return 'Пользователь'
  return props.type.charAt(0).toUpperCase() + props.type.slice(1).toLowerCase()
})
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <!-- Element Plus Tag -->
    <el-tag
        :type="roleConfig.color"
        effect="light"
        size="large"
        class="role-tag font-semibold"
    >
      <i class="fa mr-1.5 text-xs" :class="roleConfig.icon"></i>
      <span>{{ formattedLabel }}</span>
    </el-tag>

    <!-- Custom Styled Alternative (commented out, can be used instead) -->
    <!--
    <div
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
      :class="[roleConfig.bgClass, roleConfig.darkBgClass]"
    >
      <i class="fa text-xs" :class="roleConfig.icon"></i>
      <span>{{ formattedLabel }}</span>
    </div>
    -->
  </div>
</template>

<style scoped>
.role-tag {
  border-radius: 20px;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
}

.role-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Element Plus Tag Customization */
:deep(.el-tag) {
  border-radius: 20px;
  padding: 4px 10px;
  font-weight: 600;
  letter-spacing: 0.025em;
  font-size: 11px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  :deep(.el-tag) {
    padding: 3px 8px;
    font-size: 10px;
    border-radius: 16px;
  }

  .role-tag {
    transform: scale(0.9);
    transform-origin: center;
  }
}

@media (max-width: 640px) {
  :deep(.el-tag) {
    padding: 2px 6px;
    font-size: 9px;
    border-radius: 12px;
  }

  .role-tag {
    transform: scale(0.85);
  }
}

:deep(.el-tag--danger) {
  --el-tag-text-color: #dc2626;
  --el-tag-bg-color: #fef2f2;
  --el-tag-border-color: #fecaca;
}

:deep(.el-tag--warning) {
  --el-tag-text-color: #d97706;
  --el-tag-bg-color: #fffbeb;
  --el-tag-border-color: #fed7aa;
}

:deep(.el-tag--info) {
  --el-tag-text-color: #2563eb;
  --el-tag-bg-color: #eff6ff;
  --el-tag-border-color: #bfdbfe;
}

/* Dark theme adjustments */
:deep(.dark .el-tag--danger) {
  --el-tag-text-color: #fca5a5;
  --el-tag-bg-color: rgba(185, 28, 28, 0.2);
  --el-tag-border-color: rgba(185, 28, 28, 0.3);
}

:deep(.dark .el-tag--warning) {
  --el-tag-text-color: #fbbf24;
  --el-tag-bg-color: rgba(217, 119, 6, 0.2);
  --el-tag-border-color: rgba(217, 119, 6, 0.3);
}

:deep(.dark .el-tag--info) {
  --el-tag-text-color: #93c5fd;
  --el-tag-bg-color: rgba(37, 99, 235, 0.2);
  --el-tag-border-color: rgba(37, 99, 235, 0.3);
}
</style>

