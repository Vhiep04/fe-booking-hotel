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
import Chart from 'primevue/chart'

// Mock data - replace with real API data
const bookingStats = {
  confirmed: 450,
  pending: 85,
  cancelled: 32,
  completed: 628
}

const total = computed(() =>
  Object.values(bookingStats).reduce((a, b) => a + b, 0)
)

const statusItems = computed(() => [
  {
    label: 'Completed',
    count: bookingStats.completed,
    percentage: ((bookingStats.completed / total.value) * 100).toFixed(1),
    color: '#22c55e'
  },
  {
    label: 'Confirmed',
    count: bookingStats.confirmed,
    percentage: ((bookingStats.confirmed / total.value) * 100).toFixed(1),
    color: '#3b82f6'
  },
  {
    label: 'Pending',
    count: bookingStats.pending,
    percentage: ((bookingStats.pending / total.value) * 100).toFixed(1),
    color: '#f59e0b'
  },
  {
    label: 'Cancelled',
    count: bookingStats.cancelled,
    percentage: ((bookingStats.cancelled / total.value) * 100).toFixed(1),
    color: '#ef4444'
  }
])

const chartData = computed(() => ({
  labels: statusItems.value.map(item => item.label),
  datasets: [
    {
      data: statusItems.value.map(item => item.count),
      backgroundColor: statusItems.value.map(item => item.color),
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
}))

const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          const percentage = ((value / total.value) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}))
</script>
