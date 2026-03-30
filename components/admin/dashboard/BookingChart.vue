<template>
  <div class="admin-card h-full">
    <div class="admin-card-header">
      <h3 class="admin-card-title">Booking Status</h3>
    </div>
    <div class="admin-card-body">
      <div class="flex flex-col lg:flex-row items-center gap-6">
        <div class="w-full lg:w-1/2">
          <Chart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            class="h-64"
          />
        </div>
        <div class="w-full lg:w-1/2">
          <div class="space-y-4">
            <div
              v-for="(item, index) in statusItems"
              :key="index"
              class="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-surface-hover)]"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: item.color }"
                ></span>
                <span class="text-[var(--admin-text-color)] font-medium">
                  {{ item.label }}
                </span>
              </div>
              <div class="text-right">
                <p class="font-bold text-[var(--admin-text-color)]">
                  {{ item.count }}
                </p>
                <p class="text-xs text-[var(--admin-text-muted)]">
                  {{ item.percentage }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from "primevue/chart";

const props = defineProps<{
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}>();

const total = computed(
  () => props.confirmed + props.pending + props.cancelled + props.completed,
);

const pct = (val: number) =>
  total.value === 0 ? "0.0" : ((val / total.value) * 100).toFixed(1);

const statusItems = computed(() => [
  {
    label: "Completed",
    count: props.completed,
    percentage: pct(props.completed),
    color: "#22c55e",
  },
  {
    label: "Confirmed",
    count: props.confirmed,
    percentage: pct(props.confirmed),
    color: "#3b82f6",
  },
  {
    label: "Pending",
    count: props.pending,
    percentage: pct(props.pending),
    color: "#f59e0b",
  },
  {
    label: "Cancelled",
    count: props.cancelled,
    percentage: pct(props.cancelled),
    color: "#ef4444",
  },
]);

const chartData = computed(() => ({
  labels: statusItems.value.map((i) => i.label),
  datasets: [
    {
      data: statusItems.value.map((i) => i.count),
      backgroundColor: statusItems.value.map((i) => i.color),
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}));

const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: any) => {
          const value = context.raw || 0;
          const percentage = pct(value);
          return `${context.label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
}));
</script>
