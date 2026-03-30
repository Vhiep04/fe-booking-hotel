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
      <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
        class="h-80"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart'
import Dropdown from 'primevue/dropdown'

const selectedPeriod = ref('12months')
const periodOptions = [
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 12 months', value: '12months' }
]

// Mock data - replace with real API data
const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  revenue: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 69000, 78000, 85000, 92000, 98000],
  bookings: [320, 380, 340, 420, 390, 460, 510, 480, 540, 590, 640, 680]
}

const chartData = computed(() => ({
  labels: monthlyData.labels,
  datasets: [
    {
      label: 'Revenue ($)',
      data: monthlyData.revenue,
      fill: true,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: 'Bookings',
      data: monthlyData.bookings,
      fill: false,
      borderColor: '#22c55e',
      backgroundColor: '#22c55e',
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      yAxisID: 'y1'
    }
  ]
}))

const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      },
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#64748b'
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        color: '#64748b',
        callback: (value: number) => '$' + value.toLocaleString()
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false
      },
      ticks: {
        color: '#64748b'
      }
    }
  }
}))
</script>
