<template>
  <div class="admin-card h-full">
    <div class="admin-card-header flex items-center justify-between">
      <h3 class="admin-card-title">Revenue Overview</h3>
      <Dropdown
        v-model="selectedPeriod"
        :options="periodOptions"
        optionLabel="label"
        optionValue="value"
        class="w-36"
      />
    </div>
    <div class="admin-card-body">
      <div v-if="hasData">
        <Chart
          type="line"
          :data="chartData"
          :options="chartOptions"
          class="h-80"
        />
      </div>
      <div v-else class="h-80 flex flex-col items-center justify-center gap-2">
        <i class="pi pi-chart-line text-4xl text-[var(--admin-text-muted)]"></i>
        <p class="text-[var(--admin-text-muted)] text-sm">
          No revenue data available
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from "primevue/chart";
import Dropdown from "primevue/dropdown";
import type { RevenueChart } from "~/stores/admin/interfaces/dashboard";

const props = defineProps<{
  chartData: RevenueChart[];
}>();

const selectedPeriod = ref("12months");
const periodOptions = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "Last 12 months", value: "12months" },
];

const hasData = computed(() => props.chartData && props.chartData.length > 0);

const chartData = computed(() => {
  const items = props.chartData ?? [];
  return {
    labels: items.map((i) => i.monthName || `${i.month}/${i.year}`),
    datasets: [
      {
        label: "Revenue ($)",
        data: items.map((i) => i.revenue),
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Bookings",
        data: items.map((i) => i.reservationCount),
        fill: false,
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
      },
    ],
  };
});

const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  responsive: true,
  interaction: { intersect: false, mode: "index" },
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: { usePointStyle: true, padding: 20 },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b" },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      grid: { color: "rgba(0, 0, 0, 0.05)" },
      ticks: {
        color: "#64748b",
        callback: (value: number) => "$" + value.toLocaleString(),
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: { drawOnChartArea: false },
      ticks: { color: "#64748b" },
    },
  },
}));
</script>
