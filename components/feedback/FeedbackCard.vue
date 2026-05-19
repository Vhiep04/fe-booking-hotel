<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 transition-shadow hover:shadow-md"
  >
    <div class="flex flex-col md:flex-row md:items-start gap-4">
      <!-- Avatar -->
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
        :style="{ background: avatarColor }"
      >
        {{ feedback.userName.charAt(0).toUpperCase() }}
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Top row: name + actions -->
        <div class="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div>
            <p class="font-semibold text-gray-900">{{ feedback.userName }}</p>
            <div class="flex items-center gap-2 mt-1">
              <Rating
                :model-value="feedback.rating"
                :stars="5"
                readonly
                :cancel="false"
              />
              <Tag
                :value="`${feedback.rating}/5`"
                severity="warn"
                class="rounded-full! text-xs! font-bold!"
              />
            </div>
          </div>

          <div class="flex gap-2 shrink-0">
            <Button
              :label="t('Edit')"
              icon="pi pi-pencil"
              size="small"
              severity="info"
              outlined
              class="rounded-lg! text-xs!"
              @click="emit('edit', feedback)"
            />
            <Button
              :label="t('Delete')"
              icon="pi pi-trash"
              size="small"
              severity="danger"
              outlined
              class="rounded-lg! text-xs!"
              @click="emit('delete', feedback)"
            />
          </div>
        </div>

        <!-- Hotel name -->
        <div class="flex items-center gap-1.5 mb-3">
          <i class="pi pi-building text-[#07689F] text-xs" />
          <NuxtLink
            :to="`/hotels/${feedback.hotelId}`"
            class="text-sm text-[#07689F] font-medium hover:underline truncate"
          >
            {{ feedback.hotelName }}
          </NuxtLink>
        </div>

        <!-- Comment -->
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ feedback.comment }}
        </p>

        <!-- Footer -->
        <div
          class="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100"
        >
          <span
            class="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium"
          >
            <i class="pi pi-verified text-[10px]" />
            {{ t("Verified") }}
          </span>
          <span class="text-xs text-gray-400">
            <i class="pi pi-calendar mr-1" />
            {{ formatDate(feedback.createdAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import Rating from "primevue/rating";
import Tag from "primevue/tag";
import Button from "primevue/button";
import type { Feedback } from "~/stores/interface/response/feedback";

const props = defineProps<{ feedback: Feedback }>();
const emit = defineEmits<{
  (e: "edit", feedback: Feedback): void;
  (e: "delete", feedback: Feedback): void;
}>();

const { t, locale } = useI18n();

const avatarPalette = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const avatarColor = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.feedback.userName.length; i++)
    hash = props.feedback.userName.charCodeAt(i) + ((hash << 5) - hash);
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
</script>
