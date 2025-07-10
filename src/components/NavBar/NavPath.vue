<script setup>
import { ArrowRight, House } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

// Computed properties
const currentPageTitle = computed(() => route.meta.alias || 'Страница');
const breadcrumbItems = computed(() => {
  const items = [
    {
      label: 'Главная',
      path: '/',
      icon: House
    }
  ];

  // Add current page if not home
  if (route.path !== '/') {
    items.push({
      label: currentPageTitle.value,
      path: route.path,
      icon: null
    });
  }

  return items;
});

const handleBreadcrumbClick = (path) => {
  if (path !== route.path) {
    router.push(path);
  }
};
</script>

<template>
  <!-- Modern Breadcrumb Design -->
  <nav class="mt-6 sm:mt-8 lg:mt-10" aria-label="Breadcrumb">
    <!-- Element Plus Version -->
    <el-breadcrumb
        :separator-icon="ArrowRight"
        class="hidden sm:block text-sm"
    >
      <el-breadcrumb-item :to="{ path: '/' }" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <div class="flex items-center gap-1">
          <el-icon size="14"><House /></el-icon>
          <span>Главная</span>
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="text-[color:var(--color-main-text)] font-medium">
        {{ currentPageTitle }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Custom Mobile Breadcrumb -->
    <div class="sm:hidden">
      <div class="flex items-center gap-2 text-sm">
        <button
            @click="handleBreadcrumbClick('/')"
            class="flex items-center gap-1 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200"
        >
          <el-icon size="14"><House /></el-icon>
          <span class="sr-only sm:not-sr-only">Главная</span>
        </button>

        <el-icon size="12" class="text-gray-400">
          <ArrowRight />
        </el-icon>

        <span class="text-[color:var(--color-main-text)] font-medium truncate max-w-48">
          {{ currentPageTitle }}
        </span>
      </div>
    </div>
  </nav>
</template>
