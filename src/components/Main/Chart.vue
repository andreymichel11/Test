<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, Colors, ArcElement } from 'chart.js';
import { reactive, watch, ref, onMounted, onUnmounted } from "vue";

ChartJS.register(Title, Tooltip, Colors, Legend, ArcElement);

const props = defineProps({
  label: Array,
  count: Array,
});

const chartData = reactive({
  labels: props.label,
  datasets: [{
    data: props.count,
    borderWidth: 0,
  }]
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      fullSize: true,
      labels: {
        boxWidth: 20,
      }
    }
  }
};

const chartContainer = ref(null);
let resizeObserver = null;

watch(() => ({
  labels: props.label,
  count: props.count,
}), (newValues) => {
  chartData.labels = newValues.labels;
  chartData.datasets[0].data = newValues.count;
});

onMounted(() => {
  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
    });
    resizeObserver.observe(chartContainer.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

</script>

<template>
  <div ref="chartContainer" >
    <Doughnut id="chart-doughnut-chart" :options="options" :data="chartData" style="height: 100%; width: 100%;" />
  </div>
</template>

<style scoped>

</style>