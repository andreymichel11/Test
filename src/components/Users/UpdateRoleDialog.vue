<script setup>
import { computed } from 'vue'
import { useUsersStore } from '../../store/UsersStore.js'

const UsersStore = useUsersStore()

const props = defineProps({
  roles: {
    type: Array,
    default: () => []
  },
  close: {
    type: Function,
    required: true
  },
  update: {
    type: Function,
    required: true
  }
})

const currentUser = computed(() => {
  return UsersStore.updateUser || {}
})

const availableRoles = computed(() => {
  return props.roles || []
})

const canUpdate = computed(() => {
  return currentUser.value.role_name &&
      currentUser.value.role_name !== currentUser.value.original_role_name
})

const isLoading = computed(() => {
  return UsersStore.isLoading || false
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}
</script>

<template>
  <el-dialog
      title="Обновить пользователя"
      v-model="UsersStore.updateIsOpened"
      width="90%"
      center
      :before-close="close"
      destroy-on-close
      append-to-body
      class="update-role-dialog max-w-md"
  >
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
          <i class="fa fa-user text-orange-500 text-lg"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Редактирование пользователя</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Изменение роли и прав доступа</p>
        </div>
      </div>
    </template>

    <!-- Content -->
    <div class="space-y-6">
      <!-- Info Banner -->
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <i class="fa fa-info-circle text-blue-500 mt-1"></i>
          <div>
            <h4 class="text-base font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Изменение роли пользователя
            </h4>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Выберите новую роль для пользователя. Изменения вступят в силу немедленно.
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <el-form label-position="top" class="space-y-6">
        <!-- User Info Section -->
        <div class="space-y-4">
          <!-- Username (Full Width) -->
          <el-form-item label="Псевдоним" class="form-item">
            <el-input
                :model-value="currentUser.user_name || 'Не указан'"
                disabled
                size="large"
                class="w-full"
            >
              <template #prefix>
                <i class="fa fa-user text-gray-400"></i>
              </template>
            </el-input>
          </el-form-item>

          <!-- Created Date (Full Width) -->
          <el-form-item label="Дата регистрации" class="form-item">
            <el-input
                :model-value="formatDate(currentUser.created_at)"
                disabled
                size="large"
                class="w-full"
            >
              <template #prefix>
                <i class="fa fa-calendar-alt text-gray-400"></i>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- Role Selection -->
        <el-form-item label="Роль пользователя" required class="form-item">
          <el-select
              v-model="currentUser.role_name"
              size="large"
              placeholder="Выберите роль"
              class="w-full"
              :disabled="isLoading"
          >
            <template #prefix>
              <i class="fa fa-shield-alt text-gray-400"></i>
            </template>
            <el-option
                v-for="role in availableRoles"
                :key="role.id"
                :label="role.name"
                :value="role.name"
                class="role-option"
            >
              <div class="flex items-center justify-between w-full">
                <span class="font-medium">{{ role.name }}</span>
                <i
                    class="fa text-xs"
                    :class="{
                    'fa-crown text-red-500': role.name.toLowerCase() === 'admin',
                    'fa-shield-alt text-yellow-500': role.name.toLowerCase() === 'moderator',
                    'fa-user text-blue-500': role.name.toLowerCase() === 'user'
                  }"
                ></i>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <el-button
              type="primary"
              size="large"
              @click="update"
              :disabled="!canUpdate || isLoading"
              :loading="isLoading"
              class="flex-1 h-12 font-semibold"
          >
            <i class="fa fa-save mr-2"></i>
            {{ isLoading ? 'Сохранение...' : 'Обновить роль' }}
          </el-button>

          <el-button
              type="default"
              size="large"
              @click="close"
              :disabled="isLoading"
              class="flex-1 h-12 font-semibold"
          >
            <i class="fa fa-times mr-2"></i>
            Отмена
          </el-button>
        </div>
      </el-form>

      <!-- Warning Note -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
        <div class="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
          <i class="fa fa-exclamation-triangle"></i>
          <span>Изменение роли повлияет на права доступа пользователя в системе</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.update-role-dialog {
  border-radius: 12px;
}

.form-item {
  margin-bottom: 0;
}

.role-option {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.role-option:hover {
  background: #f3f4f6;
}

/* Element Plus Overrides */
:deep(.el-dialog) {
  margin: 16px;
  max-height: calc(100vh - 32px);
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__title) {
  display: none;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #3b82f6;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

/* Dark theme */
:deep(.dark .el-dialog__header) {
  border-bottom-color: #374151;
}

:deep(.dark .el-form-item__label) {
  color: #d1d5db;
}

:deep(.dark .el-input__wrapper) {
  background: #374151;
  border-color: #4b5563;
}

:deep(.dark .el-select .el-input__wrapper) {
  background: #374151;
  border-color: #4b5563;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :deep(.el-dialog) {
    margin: 8px;
    max-height: calc(100vh - 16px);
  }

  :deep(.el-dialog__header) {
    padding: 16px 16px 12px;
  }

  :deep(.el-dialog__body) {
    padding: 16px;
  }
}
</style>