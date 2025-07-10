<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, Colors, ArcElement } from 'chart.js';
import { reactive, watch, ref, onMounted, onUnmounted, computed } from "vue";

ChartJS.register(Title, Tooltip, Colors, Legend, ArcElement);

const props = defineProps({
  label: {
    type: Array,
    default: () => []
  },
  count: {
    type: Array,
    default: () => []
  },
});

const chartContainer = ref(null);
let resizeObserver = null;

const chartData = reactive({
  labels: [...(props.label || [])],
  datasets: [{
    data: [...(props.count || [])],
    borderWidth: 0,
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF'
    ]
  }]
});

const isMobile = ref(false);

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: isMobile.value ? 'bottom' : 'top',
      align: 'center',
      labels: {
        boxWidth: isMobile.value ? 12 : 20,
        padding: isMobile.value ? 8 : 12,
        font: {
          size: isMobile.value ? 10 : 12
        },
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: isMobile.value ? '40%' : '50%',
  elements: {
    arc: {
      borderWidth: 0
    }
  }
}));

const updateChartData = () => {
  chartData.labels = [...(props.label || [])];
  chartData.datasets[0].data = [...(props.count || [])];
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleResize = () => {
  checkIfMobile();
};

watch(() => ({
  labels: props.label,
  count: props.count,
}), updateChartData, { deep: true });

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', handleResize);

  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      // Chart.js automatically handles resize
    });
    resizeObserver.observe(chartContainer.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<template>
  <div ref="chartContainer" class="relative w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-2">
    <Doughnut
        id="chart-doughnut-chart"
        :options="options"
        :data="chartData"
        class="!w-full !h-full !max-w-full !max-h-full"
    />
  </div>
</template>