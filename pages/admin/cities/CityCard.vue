<template>
  <div class="admin-card overflow-hidden group">
    <!-- City Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="primaryImage"
        :alt="city.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
      />
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="text-white font-bold text-xl">{{ city.name }}</h3>
        <p class="text-white/80 text-sm">{{ city.country }}</p>
      </div>
    </div>

    <!-- City Info -->
    <div class="p-4">
      <div class="grid grid-cols-1 gap-4 mb-4">
        <div class="text-center p-3 rounded-lg bg-(--admin-surface-hover)">
          <i class="pi pi-building text-(--admin-primary) mb-1"></i>
          <p class="text-lg font-bold text-(--admin-text-color)">
            {{ city.hotelCount }}
          </p>
          <p class="text-xs text-(--admin-text-muted)">Hotels</p>
        </div>
      </div>

      <p
        v-if="city.description"
        class="text-sm text-(--admin-text-muted) mb-4 line-clamp-2"
      >
        {{ city.description }}
      </p>

      <div class="flex items-center justify-end gap-1">
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          text
          rounded
          size="small"
          v-tooltip.top="'Edit'"
          @click="emit('edit', city)"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          v-tooltip.top="'Delete'"
          @click="emit('delete', city)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import type { CityDto } from "~/stores/admin/interfaces/cities";

const props = defineProps<{ city: CityDto }>();

const emit = defineEmits<{
  (e: "edit", city: CityDto): void;
  (e: "delete", city: CityDto): void;
}>();

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop";

const primaryImage = computed(() => {
  const primary = props.city.images?.find((img) => img.isPrimary);
  return (
    primary?.imageUrl ?? props.city.images?.[0]?.imageUrl ?? FALLBACK_IMAGE
  );
});
</script>
