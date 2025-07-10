<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from 'vue';

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  isGo: {
    type: Boolean,
    default: false
  },
  go: {
    type: String,
    default: ''
  }
});

const displayCount = ref(0);
const isAnimated = ref(false);
let animationInterval = null;
let animationTimeout = null;

// Современная анимация
const startModernAnimation = () => {
  // Фаза 1: Быстрый набор случайных чисел
  const quickPhase = () => {
    let phaseCount = 0;
    const maxPhase = 15;

    animationInterval = setInterval(() => {
      displayCount.value = Math.floor(Math.random() * 999);
      phaseCount++;

      if (phaseCount >= maxPhase) {
        clearInterval(animationInterval);
        animationInterval = null;

        // Фаза 2: Замедление к приблизительному значению
        slowPhase();
      }
    }, 80);
  };

  // Фаза 2: Замедление к приблизительному значению
  const slowPhase = () => {
    const targetRange = Math.max((props.count ?? 0) * 1.5, 100);
    let phaseCount = 0;
    const maxPhase = 10;

    animationInterval = setInterval(() => {
      displayCount.value = Math.floor(Math.random() * targetRange);
      phaseCount++;

      if (phaseCount >= maxPhase) {
        clearInterval(animationInterval);
        animationInterval = null;
        finalizeCount();
      }
    }, 150);
  };

  quickPhase();
};

// Финальная анимация к точному значению
const finalizeCount = () => {
  const finalValue = props.count ?? 0;
  const startValue = displayCount.value;
  const duration = 800;
  const startTime = Date.now();

  const smoothTransition = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Использование easing функции для плавности
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    displayCount.value = Math.round(startValue + (finalValue - startValue) * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(smoothTransition);
    } else {
      isAnimated.value = true;
    }
  };

  requestAnimationFrame(smoothTransition);
};

const handleNavigation = () => {
  if (props.isGo && props.go) {
    router.push({ name: props.go });
  }
};

onMounted(() => {
  // Страховочный таймер
  animationTimeout = setTimeout(() => {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
    finalizeCount();
  }, 1000);

  startModernAnimation();
});

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }
});
</script>

<template>
  <div class="w-full h-[250px] rounded-xl shadow-2xl bg-white dark:bg-neutral-800 p-4 sm:p-6 flex flex-col relative transition-all duration-300 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5">
    <div class="mb-3 sm:mb-4">
      <h2 class=" sm:text-base  font-normal text-[color:var(--color-main-text)] text-left">
        {{ title }}
      </h2>
    </div>

    <div class="flex-1 flex flex-col justify-between">
      <div class="flex-1 flex items-center justify-center relative">
        <!-- Анимация загрузки -->
        <div
            v-if="!isAnimated"
            class="text-6xl sm:text-7xl lg:text-8xl font-bold text-[color:var(--color-main-text)] text-center leading-none transition-all duration-300 relative"
        >
          {{ displayCount }}

          <!-- Эффект мигающего курсора -->
          <div class="absolute -right-2 top-0 w-1 h-full bg-blue-500 animate-pulse"></div>
        </div>

        <!-- Финальное значение -->
        <div
            v-else
            class="text-6xl sm:text-7xl lg:text-8xl font-bold text-[color:var(--color-main-text)] text-center leading-none transition-all duration-500 animate-fadeIn"
        >
          {{ displayCount }}
        </div>
      </div>

      <div class="flex justify-end mt-3 sm:mt-4">
        <button
            v-if="isGo && go"
            @click="handleNavigation"
            class="bg-transparent border-none text-[color:var(--color-main-text)] text-md cursor-pointer px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2 hover:text-[color:var(--color-main-hover-text)] hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10"
        >
          Перейти
          <i class="fa fa-long-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
</style>