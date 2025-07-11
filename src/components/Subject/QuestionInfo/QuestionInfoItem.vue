<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  }
});
</script>

<template>
  <div class="py-3 border-b border-gray-100 dark:border-neutral-700 last:border-b-0">
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div class="flex-shrink-0 w-5 flex justify-center pt-0.5">
        <i
            v-if="icon"
            :class="icon"
            class="text-gray-400 dark:text-gray-500 text-sm"
        ></i>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
          <!-- Title -->
          <div class="sm:w-1/3 flex-shrink-0">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ title }}
            </span>
          </div>

          <!-- Value or Slot -->
          <div class="sm:flex-1 min-w-0">
            <div v-if="value" class="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">
              {{ value }}
            </div>
            <div v-else class="flex items-center">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>