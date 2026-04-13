<template>
  <div
    class="group flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
  >
    <div class="relative w-[190px] shrink-0 overflow-hidden">
      <img
        :src="hotel.hotelImgUrl || FALLBACK"
        :alt="hotel.hotelName"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="(e) => ((e.target as HTMLImageElement).src = FALLBACK)"
      />

      <Button
        :icon="isFavourited ? 'pi pi-heart-fill' : 'pi pi-heart'"
        rounded
        text
        severity="secondary"
        size="small"
        :loading="isToggling"
        :class="[
          'absolute! top-2 left-2 w-9! h-9! bg-white/90! dark:bg-slate-800/90! backdrop-blur-sm shadow-md',
          isFavourited ? 'text-blue-500!' : 'text-slate-400!',
        ]"
        @click.stop="handleToggle"
      />

      <div
        class="absolute bottom-2 right-2 flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow text-xs font-bold text-slate-800 dark:text-white"
      >
        <i class="pi pi-star-fill text-amber-400 text-[10px]" />
        {{ hotel.averageRating?.toFixed(1) ?? "—" }}
      </div>
    </div>

    <div class="flex flex-col flex-1 p-4 min-w-0">
      <h3
        class="text-[15px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1"
      >
        {{ hotel.hotelName }}
      </h3>

      <div
        class="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-3"
      >
        <i class="pi pi-map-marker text-[11px]" />
        <span>{{ hotel.cityName }}, {{ hotel.country }}</span>
      </div>

      <Divider class="my-0! mb-3!" />

      <div class="flex items-end justify-between gap-3">
        <div class="flex flex-col gap-0.5">
          <span
            class="text-[10px] uppercase tracking-widest text-slate-400 font-medium"
            >From</span
          >
          <div class="flex items-baseline gap-0.5 leading-none">
            <span class="text-sm font-bold text-slate-600 dark:text-slate-300"
              >$</span
            >
            <span
              class="text-[28px] font-extrabold text-slate-900 dark:text-white"
            >
              {{ hotel.minPrice }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400"
            >Includes taxes &amp; charges</span
          >
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <div class="flex flex-col items-end gap-0.5">
            <span
              class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none"
            >
              {{ reviewLabel }}
            </span>
            <span class="text-[10px] text-slate-400 leading-none">
              {{ hotel.totalReviews?.toLocaleString() }} reviews
            </span>
          </div>

          <div
            :class="[
              'w-9 h-9 rounded-lg rounded-br-none flex items-center justify-center text-sm font-bold text-white',
              scoreColor,
            ]"
          >
            {{ hotel.averageRating?.toFixed(1) ?? "—" }}
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 mt-3">
        <Tag
          v-if="hotel.sustainableLevel"
          severity="success"
          class="text-[10px]! px-2! py-0.5! rounded-full! font-medium!"
        >
          <template #default>
            <i class="pi pi-verified mr-1 text-[10px]" />
            Trip Sustainable · Level {{ hotel.sustainableLevel }}
          </template>
        </Tag>

        <Tag
          v-if="discountLabel"
          severity="warn"
          class="text-[10px]! px-2! py-0.5! rounded-full! font-medium!"
        >
          <template #default>
            <i class="pi pi-tag mr-1 text-[10px]" />
            {{ discountLabel }}
          </template>
        </Tag>
      </div>

      <div class="mt-auto pt-3">
        <Button
          label="See Availability"
          icon="pi pi-arrow-right"
          icon-pos="right"
          size="small"
          text
          class="p-0! text-blue-600! dark:text-blue-400! font-bold! text-sm!"
          @click.stop="$emit('view', hotel)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Tag from "primevue/tag";
import type { FavouriteHotel } from "@/stores/favouriteHotelStore";

const props = defineProps<{
  hotel: FavouriteHotel;
  isFavourited?: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-favourite", hotelId: number): void;
  (e: "view", hotel: FavouriteHotel): void;
}>();

const FALLBACK =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop";
const isToggling = ref(false);

const reviewLabel = computed(() => {
  const r = props.hotel.averageRating ?? 0;
  if (r >= 4.8) return "Exceptional";
  if (r >= 4.5) return "Wonderful";
  if (r >= 4.2) return "Excellent";
  if (r >= 4.0) return "Very Good";
  if (r >= 3.5) return "Good";
  return "Fair";
});

const scoreColor = computed(() => {
  const r = props.hotel.averageRating ?? 0;
  if (r >= 4.5) return "bg-blue-700";
  if (r >= 4.0) return "bg-blue-600";
  if (r >= 3.5) return "bg-blue-500";
  return "bg-slate-500";
});

const discountLabel = computed(() => {
  if (!props.hotel.maxPrice || props.hotel.minPrice >= props.hotel.maxPrice)
    return null;
  const pct = Math.round(
    ((props.hotel.maxPrice - props.hotel.minPrice) / props.hotel.maxPrice) *
      100,
  );
  return pct > 0 ? `${pct}% Off` : null;
});

async function handleToggle() {
  if (isToggling.value) return;
  isToggling.value = true;
  try {
    emit("toggle-favourite", props.hotel.hotelId);
  } finally {
    setTimeout(() => (isToggling.value = false), 400);
  }
}
</script>
