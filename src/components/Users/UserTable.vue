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
  <div>
    <!-- Users Grid -->
    <div
        v-if="hasUsers"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 p-4"
    >
      <div
          v-for="user in usersData"
          :key="user.id || user.login"
          class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 transition-all duration-200 ease-in-out hover:-translate-y-0.5 flex flex-col gap-4 sm:gap-5"
      >
        <!-- User Avatar and Basic Info -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold shadow-sm shadow-blue-500/30 dark:shadow-blue-600/30 flex-shrink-0">
            {{ (user.login || '?')[0].toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ user.login || 'Не указан' }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
              {{ user.user_name || 'Не указан' }}
            </p>
          </div>
        </div>

        <!-- User Role -->
        <div class="flex  gap-2 justify-between">
          <div class="flex flex-col gap-2 ">
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400  tracking-wide">
              Роль
            </label>
            <UserRole :type="user.role_name" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400  tracking-wide">
              Дата создания
            </label>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <i class="fa fa-calendar text-xs text-gray-400 dark:text-gray-500"></i>
              <span>{{ formatDate(user.created_at) }}</span>
            </div>
        </div>

        <!-- Created Date -->

        </div>

        <!-- Actions -->
        <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
          <el-button
              type="warning"
              @click="updateOpen(user)"
              class="w-full flex items-center justify-center gap-2 font-medium"
              title="Редактировать пользователя"
          >
            <i class="fa fa-edit"></i>
            <span>Изменить</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
        v-else
        class="flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 min-h-96"
    >
      <div class="text-center max-w-sm">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-users text-xl sm:text-2xl text-gray-400 dark:text-gray-500"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Нет пользователей
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Пользователи появятся здесь после регистрации
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Минимальные кастомные стили только для того, что нельзя сделать с Tailwind */

/* Дополнительная тень для dark mode */
@media (prefers-color-scheme: dark) {
  .user-card-shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  }

  .user-card-shadow:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  }
}

/* Кастомизация для очень маленьких экранов */
@media (max-width: 320px) {
  .grid {
    margin: 0 -0.5rem;
  }

  .grid > div {
    border-radius: 0.5rem;
  }
}

/* Улучшение градиента аватара для совместимости */
.avatar-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

@media (prefers-color-scheme: dark) {
  .avatar-gradient {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }
}
</style>
