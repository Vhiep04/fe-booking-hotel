<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="admin-card" v-for="card in cards" :key="card.label">
      <div class="admin-card-body p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="card.bg"
          >
            <i :class="[card.icon, card.iconColor]"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-(--admin-text-color)">
              {{ card.value }}
            </p>
            <p class="text-sm text-(--admin-text-muted)">
              {{ card.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reservation } from "~/stores/admin/interfaces/reservations";

const { t } = useI18n();

const props = defineProps<{
  reservations: Reservation[];
  totalCount: number;
}>();

const cards = computed(() => [
  {
    label: t("Reservationst"),
    value: props.totalCount,
    icon: "pi pi-calendar",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600",
  },
  {
    label: t("Pending"),
    value: props.reservations.filter((r) => r.paymentStatus === "Pending")
      .length,
    icon: "pi pi-clock",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600",
  },
  {
    label: t("Confirmed"),
    value: props.reservations.filter((r) => r.paymentStatus === "Confirmed")
      .length,
    icon: "pi pi-check-circle",
    bg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
  },
  {
    label: t("Cancelled"),
    value: props.reservations.filter((r) => r.paymentStatus === "Cancelled")
      .length,
    icon: "pi pi-times-circle",
    bg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600",
  },
]);
</script>
