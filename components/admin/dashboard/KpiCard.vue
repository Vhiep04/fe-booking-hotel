<template>
  <div class="admin-card h-full">
    <div class="admin-card-body">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-[var(--admin-text-secondary)] text-sm font-medium mb-1">
            {{ title }}
          </p>
          <h3 class="text-2xl font-bold text-[var(--admin-text-color)] mb-2">
            {{ formattedValue }}
          </h3>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1 text-sm font-medium"
              :class="changeColorClass"
            >
              <i :class="changeIcon"></i>
              {{ Math.abs(change) }}%
            </span>
            <span class="text-xs text-[var(--admin-text-muted)]">
              vs last {{ period }}
            </span>
          </div>
        </div>
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :class="iconBgClass"
        >
          <i :class="[icon, 'text-xl', iconColorClass]"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number
  change: number
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple' | 'pink'
  format?: 'number' | 'currency' | 'percentage'
  period?: string
}>()

const formattedValue = computed(() => {
  const format = props.format || 'number'
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(props.value)
    case 'percentage':
      return `${props.value}%`
    default:
      return new Intl.NumberFormat('en-US').format(props.value)
  }
})

const changeColorClass = computed(() => {
  return props.change >= 0
    ? 'text-[var(--admin-success)]'
    : 'text-[var(--admin-danger)]'
})

const changeIcon = computed(() => {
  return props.change >= 0
    ? 'pi pi-arrow-up'
    : 'pi pi-arrow-down'
})

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400'
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-600 dark:text-pink-400'
  }
}

const iconBgClass = computed(() => colorMap[props.color].bg)
const iconColorClass = computed(() => colorMap[props.color].text)
</script>
