<script setup>
import { computed } from 'vue'
import { useUsersStore } from '../../store/UsersStore.js'
import UserRole from './UserRole.vue'

const UsersStore = useUsersStore()

const usersData = computed(() => {
  return UsersStore.getUsersSlice || []
})

const hasUsers = computed(() => {
  return usersData.value.length > 0
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

const updateOpen = (user) => {
  if (!user) return

  try {
    const userCopy = JSON.parse(JSON.stringify(user))
    UsersStore.setUpdateUser(userCopy)
    UsersStore.setUpdateIsOpened()
  } catch (error) {
    console.error('Ошибка при копировании данных пользователя:', error)
  }
}
</script>

<template>
  <div class="user-table-container">
    <!-- Table Wrapper -->
    <div class="overflow-x-auto">
      <el-table
          :data="usersData"
          size="large"
          class="w-full"
          :class="{ 'opacity-75': !hasUsers }"
          stripe
          header-cell-class-name="table-header"
          row-class-name="table-row"
      >
        <!-- Login Column -->
        <el-table-column
            prop="login"
            label="Логин"
            min-width="150"
            show-overflow-tooltip
        >
          <template #default="scope">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {{ (scope.row.login || '?')[0].toUpperCase() }}
              </div>
              <div class="min-w-0">
                <div class="font-medium text-gray-900 dark:text-white truncate">
                  {{ scope.row.login || 'Не указан' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Username Column -->
        <el-table-column
            prop="user_name"
            label="Псевдоним"
            min-width="150"
            show-overflow-tooltip
        >
          <template #default="scope">
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {{ scope.row.user_name || 'Не указан' }}
            </div>
          </template>
        </el-table-column>

        <!-- Role Column -->
        <el-table-column
            prop="role_name"
            label="Роль"
            min-width="140"
            align="center"
            class-name="role-column"
        >
          <template #default="scope">
            <UserRole :type="scope.row.role_name" />
          </template>
        </el-table-column>

        <!-- Created Date Column -->
        <el-table-column
            prop="created_at"
            label="Дата создания"
            min-width="160"
            show-overflow-tooltip
        >
          <template #default="scope">
            <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <i class="fa fa-calendar-alt text-xs"></i>
              <span class="text-sm">{{ formatDate(scope.row.created_at) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Actions Column -->
        <el-table-column
            label="Управление"
            align="center"
            min-width="100"

            class-name="actions-column"
        >
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                  type="warning"
                  size="small"
                  @click="updateOpen(scope.row)"
                  class="action-button"
                  title="Редактировать пользователя"
              >
                <i class="fa fa-edit"></i>
                <span class="hidden lg:inline ml-1">Изменить</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Empty State (если нет данных) -->
    <div v-if="!hasUsers" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fa fa-users text-gray-300 dark:text-gray-600 text-4xl mb-3"></i>
        <p class="text-gray-500 dark:text-gray-400">Нет данных для отображения</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-table-container {
  border-radius: 8px;
  overflow: hidden;
}

.action-button {
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Element Plus Table Styling */
:deep(.el-table) {

  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.dark .el-table) {
  --el-table-border-color: #3f3f46;
  --el-table-text-color: #f4f4f5;
  --el-table-header-text-color: #f4f4f5;
  --el-table-bg-color: #27272a;
  --el-table-tr-bg-color: #27272a;
  --el-table-expanded-cell-bg-color: #27272a;
  background: #27272a !important;

}

:deep(.table-header) {
  background: #f8fafc !important;
  font-weight: 600 !important;
  color: #374151 !important;

}



:deep( .dark > .table-header) {
  background: linear-gradient(135deg, #3f3f46 0%, #52525b 100%) !important;
  color: #f4f4f5 !important;
  font-weight: 700 !important;
}

:deep(.table-row) {
  transition: all 0.3s ease;
}


:deep(.dark .table-row) {
  background: #27272a !important;
  transition: all 0.3s ease;
}


:deep(.el-table__cell) {
  padding: 16px 12px !important;
  transition: all 0.3s ease;
}

:deep(.dark .el-table__cell) {
  background: #27272a !important;
}

:deep(.dark .el-table__row) {
  background: #27272a !important;
}

:deep(.dark .el-table__row:hover .el-table__cell) {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
  border-bottom-color: #52525b !important;
}

:deep(.dark .el-table__row--striped) {
  background: #2d2d30 !important;
}

:deep(.dark .el-table__row--striped .el-table__cell) {
  background: #2d2d30 !important;
}

:deep(.dark .el-table__row--striped:hover .el-table__cell) {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
}

:deep(.dark .el-table__header) {
  background: linear-gradient(135deg, #3f3f46 0%, #52525b 100%) !important;
}

:deep(.dark .el-table__header-wrapper) {
  background: linear-gradient(135deg, #3f3f46 0%, #52525b 100%) !important;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

:deep(.dark .el-table__header th) {
  background: linear-gradient(135deg, #3f3f46 0%, #52525b 100%) !important;
  color: #f4f4f5 !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 12px;
  border-bottom: 1px solid #52525b !important;
}

:deep(.dark .el-table__header th .cell) {
  color: #f4f4f5 !important;
  font-weight: 700 !important;
}

:deep(.dark .el-table__body) {
  background: #27272a !important;
}

/* Переопределяем Element Plus hover стили */
:deep(.dark .el-table__body tr:hover > td) {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
}

:deep(.dark .el-table__body tr.hover-row > td) {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
}

/* Дополнительные эффекты */
:deep(.dark .el-table__body tr) {
  position: relative;
}

:deep(.dark .el-table__body tr::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: transparent;
  transition: all 0.3s ease;
}

:deep(.dark .el-table__body tr:hover::before) {
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  :deep(.el-table__cell) {
    padding: 12px 8px !important;
  }

  .action-button {
    padding: 8px 10px;
    font-size: 12px;
    min-width: 36px;
  }

  :deep(.role-column .el-table__cell) {
    padding: 12px 4px !important;
  }

  :deep(.actions-column .el-table__cell) {
    padding: 12px 4px !important;
  }
}

@media (max-width: 640px) {
  :deep(.el-table .cell) {
    word-break: break-word;
    font-size: 14px;
  }

  .action-button {
    padding: 6px 8px;
    min-width: 32px;
  }

  :deep(.role-column .el-table__cell) {
    padding: 8px 2px !important;
  }
}
</style>