<script setup>
import Chart from "./Chart.vue";
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: Array,
    default: () => []
  },
  count: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  }
});

const hasData = computed(() => props.count && props.count.length > 0);
</script>

<template>
  <div class="w-full h-[350px] sm:h-[350px] lg:h-[532px] rounded-xl shadow-2xl bg-white dark:bg-neutral-800 p-4 sm:p-6 flex flex-col transition-all duration-300 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5">
    <div class="mb-3 sm:mb-4">
      <h2 class="text-sm sm:text-base font-normal text-[color:var(--color-main-text)] text-left">
        {{ title }}
      </h2>
    </div>

    <div class="flex-1 flex items-center justify-center min-h-0">
      <Chart
          v-if="hasData"
          :count="count"
          :label="label"
          class="w-full h-full min-h-[160px] sm:min-h-[200px] lg:min-h-[420px]"
      />
      <el-empty
          v-else
          class="w-full h-full flex items-center justify-center"
      />
    </div>
  </div>
</template>