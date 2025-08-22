<script setup>
import {
  EditPen,
  Folder,
  QuestionFilled,
  SwitchButton,
  User,
  Bell,
  ArrowDown,
  Menu,
  Close,
  Sunny
} from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../store/AuthStore.js";
import NavPath from "./NavPath.vue";
import { useSubjectStore } from "../../store/SubjectStore.js";
import { useUsersStore } from "../../store/UsersStore.js";

const router = useRouter();
const route = useRoute();
const AuthStore = useAuthStore();
const UsersStore = useUsersStore();
const SubjectStore = useSubjectStore();

const dark = ref(false);
const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

// Computed properties
const isAuthenticated = computed(() => AuthStore.access_token !== null);
const moderationCount = computed(() => SubjectStore.statistic?.question_to_moderate_count || 0);
const shouldShowModerationBadge = computed(() => moderationCount.value > 0);
const userRole = computed(() => UsersStore.getRole);
const userName = computed(() => UsersStore.getUser);
const userInitial = computed(() => UsersStore.getFirstLetter);
const shouldShowNavPath = computed(() =>
    isAuthenticated.value && route.path !== '/' && route.path !== '/404'
);

// Navigation items for both desktop and mobile
const navigationItems = computed(() => [
  {
    icon: QuestionFilled,
    label: 'Добавить вопрос',
    action: () => router.push({ name: 'NewQuestion' }),
    show: true,
    highlight: false
  },
  {
    icon: EditPen,
    label: 'Модерация',
    action: () => router.push({ name: 'Moderate' }),
    show: userRole.value !== 'creator',
    highlight: shouldShowModerationBadge.value,
    badge: moderationCount.value
  },
  {
    icon: Folder,
    label: 'Тематики',
    action: () => router.push({ name: 'Subjects' }),
    show: userRole.value === 'admin',
    highlight: false
  },
  {
    icon: User,
    label: 'Пользователи',
    action: () => router.push({ name: 'Users' }),
    show: userRole.value === 'admin',
    highlight: false
  }
]);

// Methods
const logOutFunc = () => {
  router.push({ name: "Auth" });
  AuthStore.logOut();
  closeMobileMenu();
};

const changeTheme = () => {
  const theme = localStorage.getItem("data-theme");
  const html = document.querySelector('html');
  html.classList.toggle("dark");

  if (theme === "dark") {
    dark.value = false;
    localStorage.setItem('data-theme', 'light');
    document.documentElement.removeAttribute("data-theme");
  } else {
    localStorage.setItem('data-theme', 'dark');
    dark.value = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isUserMenuOpen.value = false;
};

const handleNavigation = (action) => {
  action();
  closeMobileMenu();
};

// Initialize theme
onMounted(() => {
  const theme = localStorage.getItem("data-theme");
  dark.value = theme === "dark";
});
</script>

<template>
  <!-- Glassmorphism Style Header -->
  <header class="relative">
    <!-- Background with blur effect -->
    <div class="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 rounded-2xl shadow-xl"></div>

    <!-- Content -->
    <div class="relative px-4 sm:px-6 py-2">
      <div class="flex justify-between items-center h-14">
        <!-- Logo with gradient -->
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 bg-[color:var(--color-main-text)] rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xs">T</span>
          </div>
          <h1 class="text-lg font-bold text-[color:var(--color-main-text)] select-none cursor-pointer" @click="router.push('/')">
            Test Project
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <nav v-if="isAuthenticated" class="hidden lg:flex items-center gap-2">
          <!-- Navigation Pills -->
          <div class="flex items-center gap-1 bg-gray-100/50 dark:bg-neutral-800/50 rounded-xl p-1">
            <template v-for="item in navigationItems" :key="item.label">
              <button
                  v-if="item.show"
                  @click="item.action"
                  class="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/70 dark:hover:bg-neutral-700/70 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  :class="{ 'bg-white/70 dark:bg-neutral-700/70 text-blue-600 dark:text-blue-400': item.highlight }"
              >
                <el-icon :size="16">
                  <component :is="item.icon" />
                </el-icon>
                <span class="hidden xl:block">{{ item.label }}</span>
                <!-- Badge -->
                <span
                    v-if="item.badge && item.badge > 0"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse"
                >
                  {{ item.badge }}
                </span>
              </button>
            </template>
          </div>

          <!-- User Section -->
          <div class="flex items-center gap-3 ml-4">
            <!-- Notification Bell -->
            <button
                @click="router.push({ name: 'Moderate' })"
                class="relative p-2 rounded-xl transition-all duration-200 hover:bg-white/70 dark:hover:bg-neutral-700/70 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                :class="{ 'animate-pulse': shouldShowModerationBadge }"
            >
              <el-icon :size="20"><Bell /></el-icon>
              <span
                  v-if="shouldShowModerationBadge"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center"
              >
                {{ moderationCount }}
              </span>
            </button>

            <!-- Theme Toggle -->
            <button
                @click="changeTheme"
                class="p-2 rounded-xl transition-all duration-200 hover:bg-white/70 dark:hover:bg-neutral-700/70 text-gray-600 dark:text-gray-400 hover:text-amber-500"
            >
              <el-icon v-if="dark" :size="20"><Sunny /></el-icon>
              <el-icon v-else :size="20"><Moon/></el-icon>

            </button>

            <!-- User Avatar & Menu -->
            <div class="relative">
              <button
                  @click="isUserMenuOpen = !isUserMenuOpen"
                  class="flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200 hover:bg-white/70 dark:hover:bg-neutral-700/70"
              >
                <el-avatar :size="28" class="bg-[color:var(--color-main-text)]">
                  {{ userInitial }}
                </el-avatar>
                <span class="hidden xl:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 truncate">
                  {{ userName }}
                </span>
                <el-icon class="text-gray-500 dark:text-gray-400 hidden xl:block">
                  <ArrowDown />
                </el-icon>
              </button>

              <!-- User Dropdown -->
              <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 py-2 z-[60]"
                  @click.stop
              >
                <div class="px-3 py-2 border-b border-gray-200/50 dark:border-neutral-700/50">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ userRole }}</p>
                </div>
                <button
                    @click="logOutFunc"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <el-icon><SwitchButton /></el-icon>
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </nav>

        <!-- Mobile/Tablet Navigation -->
        <div v-if="isAuthenticated" class="lg:hidden flex items-center gap-3">
          <!-- Notification Bell Mobile -->
          <button
              @click="router.push({ name: 'Moderate' })"
              class="relative p-2 rounded-xl transition-all duration-200 hover:bg-white/70 dark:hover:bg-neutral-700/70"
              :class="{ 'animate-pulse': shouldShowModerationBadge }"
          >
            <el-icon :size="20" class="text-gray-600 dark:text-gray-400">
              <Bell />
            </el-icon>
            <span
                v-if="shouldShowModerationBadge"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center"
            >
              {{ moderationCount }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button
              @click="toggleMobileMenu"
              class="p-2 rounded-xl transition-all duration-200 hover:bg-white/70 dark:hover:bg-neutral-700/70 text-gray-600 dark:text-gray-400"
          >
            <el-icon :size="20">
              <Menu v-if="!isMobileMenuOpen" />
              <Close v-else />
            </el-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
          v-if="isAuthenticated && isMobileMenuOpen"
          class="lg:hidden mt-3 pt-3 border-t border-white/20 dark:border-neutral-700/30 animate-slideDown bg-white/95 dark:bg-neutral-900/95 rounded-b-2xl -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 relative z-[60]"
      >
        <!-- User Info -->
        <div class="flex items-center gap-3 mb-4 p-3 bg-gray-100 dark:bg-neutral-700 rounded-xl">
          <el-avatar :size="28" class="bg-[color:var(--color-main-text)]">
            {{ userInitial }}
          </el-avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ userRole }}</p>
          </div>
        </div>

        <!-- Mobile Navigation Items -->
        <div class="space-y-1 mb-4">
          <template v-for="item in navigationItems" :key="item.label">
            <button
                v-if="item.show"
                @click="handleNavigation(item.action)"
                class="w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 hover:bg-white/50 dark:hover:bg-neutral-800/50 text-gray-700 dark:text-gray-300"
                :class="{ 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': item.highlight }"
            >
              <el-icon :size="18">
                <component :is="item.icon" />
              </el-icon>
              <span class="font-medium">{{ item.label }}</span>
              <span
                  v-if="item.badge && item.badge > 0"
                  class="ml-auto bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center"
              >
                {{ item.badge }}
              </span>
            </button>
          </template>
        </div>

        <!-- Mobile Actions -->
        <div class="space-y-1 pt-4 border-t border-white/20 dark:border-neutral-700/30">
          <button
              @click="changeTheme(); closeMobileMenu()"
              class="w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300"
          >
            <i :class="dark ? 'fa fa-sun-o' : 'fa fa-moon-o'" class="w-5 h-5 text-amber-500" />
            <span class="font-medium">Сменить тему</span>
          </button>

          <button
              @click="logOutFunc"
              class="w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 hover:bg-red-50/50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
          >
            <el-icon :size="18"><SwitchButton /></el-icon>
            <span class="font-medium">Выйти</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
        v-if="isUserMenuOpen || isMobileMenuOpen"
        @click="closeMobileMenu"
        class="fixed inset-0 z-[40] bg-black/10"
    ></div>
  </header>

  <!-- Navigation Path -->
  <NavPath v-if="shouldShowNavPath" />
</template>

<style scoped>
/* Custom backdrop blur for better browser support */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Gradient text fallback */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth slide down animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

/* Enhanced hover effects */
@media (hover: hover) {
  button:hover {
    transform: translateY(-1px);
  }

  .bg-gradient-to-br:hover {
    transform: scale(1.05);
  }
}

/* Focus styles for accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Mobile menu overlay */
.fixed.inset-0 {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}
</style>