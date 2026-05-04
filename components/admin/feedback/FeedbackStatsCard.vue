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
            <p class="text-sm text-(--admin-text-muted)">{{ card.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminFeedbackDto } from "~/stores/admin/interfaces/feedbacks";

const { t } = useI18n();

const props = defineProps<{
  feedbacks: AdminFeedbackDto[];
  totalCount: number;
}>();

const avgRating = computed(() => {
  if (!props.feedbacks.length) return "—";
  const avg =
    props.feedbacks.reduce((s, f) => s + f.rating, 0) / props.feedbacks.length;
  return avg.toFixed(1);
});

const cards = computed(() => [
  {
    label: t("Total Reviews"),
    value: props.totalCount,
    icon: "pi pi-comments",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600",
  },
  {
    label: t("Avg Rating"),
    value: avgRating.value,
    icon: "pi pi-star-fill",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-500",
  },
  {
    label: t("5 Stars"),
    value: props.feedbacks.filter((f) => f.rating === 5).length,
    icon: "pi pi-thumbs-up",
    bg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
  },
  {
    label: t("Low Ratings (≤2)"),
    value: props.feedbacks.filter((f) => f.rating <= 2).length,
    icon: "pi pi-thumbs-down",
    bg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600",
  },
]);
</script>
