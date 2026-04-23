<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="admin-card" v-for="card in cards" :key="card.label">
      <div class="admin-card-body p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="card.bgClass"
          >
            <i :class="[card.icon, card.iconClass]"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-[var(--admin-text-color)]">
              {{ card.value }}
            </p>
            <p class="text-sm text-[var(--admin-text-muted)]">
              {{ card.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatsProps {
  total: number;
  admins: number;
  active: number;
  newThisMonth: number;
}

const props = defineProps<{ stats: StatsProps }>();

const cards = computed(() => [
  {
    label: "Total Users",
    value: props.stats.total,
    icon: "pi pi-users",
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconClass: "text-blue-600",
  },
  {
    label: "Admins",
    value: props.stats.admins,
    icon: "pi pi-shield",
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-600",
  },
  {
    label: "Active",
    value: props.stats.active,
    icon: "pi pi-check-circle",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    iconClass: "text-green-600",
  },
  {
    label: "New This Month",
    value: props.stats.newThisMonth,
    icon: "pi pi-user-plus",
    bgClass: "bg-gray-100 dark:bg-gray-900/30",
    iconClass: "text-gray-600",
  },
]);
</script>
