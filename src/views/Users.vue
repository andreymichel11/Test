<script setup>
import { computed, onMounted } from 'vue'
import { useUsersStore } from '../store/UsersStore.js'
import { useAuthStore } from '../store/AuthStore.js'
import UpdateRoleDialog from '../components/Users/UpdateRoleDialog.vue'
import UserTable from '../components/Users/UserTable.vue'

const UsersStore = useUsersStore()
const AuthStore = useAuthStore()

const hasUsers = computed(() => {
  return UsersStore.users.length > 0
})

const isAdmin = computed(() => {
  return UsersStore.getRole === 'Admin'
})

const isLoading = computed(() => {
  return UsersStore.isLoading || false
})

onMounted(async () => {
  try {
    await UsersStore.getUsers()
    if (isAdmin.value) {
      await UsersStore.getRoles()
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  }
})

const close = () => {
  UsersStore.setUpdateUser({})
  UsersStore.setUpdateIsOpened()
}

const updateUser = async () => {
  try {
    await UsersStore.updateUserFunc(UsersStore.updateUser)
    close()
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error)
  }
}
</script>

<template>
  <div class="max-w-8xl">

    <!-- Main Content -->
    <div class="bg-gray-50 dark:bg-neutral-900 shadow-lg  overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="loading-spinner mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Загрузка пользователей
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Получение данных с сервера...
          </p>
        </div>
      </div>

      <!-- Users Content -->
      <div v-else-if="hasUsers" class=" ">
        <!-- Table Header Info -->

        <div class="px-6 py-4 bg-white dark:bg-neutral-800">
          <div class="flex  sm:flex-row items-center justify-between gap-4">

                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <i class="fa fa-users text-white text-lg"></i>
                    </div>
                    <div>
                      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                        Управление пользователями
                      </h1>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Просмотр и управление учетными записями пользователей
                      </p>
                    </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Всего: {{ UsersStore.users.length }} пользователей
            </p>
            <!-- Quick Stats -->

          </div>
        </div>

        <!-- User Table -->
        <div >
          <UserTable />
        </div>

      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fa fa-users text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Пользователи не найдены
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            В системе пока нет зарегистрированных пользователей или произошла ошибка при загрузке данных.
          </p>
          <el-button
              type="primary"
              @click="UsersStore.getUsers()"
              :loading="isLoading"
              class="h-10 px-6 font-semibold"
          >
            <i class="fa fa-sync-alt mr-2"></i>
            Обновить список
          </el-button>
        </div>
      </div>
    </div>

    <!-- Update Role Dialog -->
    <UpdateRoleDialog
        v-model="UsersStore.updateIsOpened"
        :roles="UsersStore.roles"
        :close="close"
        :update="updateUser"
    />
  </div>
</template>

<style scoped>
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Element Plus Pagination styling */
:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-text-color: #374151;
  --el-pagination-border-radius: 6px;
}

:deep(.dark .el-pagination) {
  --el-pagination-text-color: #d1d5db;
  --el-pagination-button-bg-color: #374151;
  --el-pagination-hover-color: #3b82f6;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

:deep(.dark .el-pagination .btn-prev),
:deep(.dark .el-pagination .btn-next) {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

:deep(.dark .el-pagination .btn-prev:hover),
:deep(.dark .el-pagination .btn-next:hover) {
  background: #4b5563;
  border-color: #6b7280;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :deep(.el-pagination) {
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.el-pagination .el-pager) {
    order: 3;
    flex-basis: 100%;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>

<style scoped>

</style>
