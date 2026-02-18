<template>
  <div class="grid grid-cols-2 gap-2 mb-6">
    <div class="col-span-2 md:col-span-1">
      <img
        :src="mainImage"
        :alt="hotel?.name || 'Hotel'"
        class="w-full h-64 md:h-full object-cover rounded-lg"
      />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <img
        v-for="(image, index) in thumbnailImages"
        :key="index"
        :src="image.imageUrl"
        :alt="image.description || `Image ${index + 1}`"
        class="w-full h-32 md:h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
        @click="$emit('imageClick', index + 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HotelData } from "~/stores/interface/response/cityList";

interface Props {
  hotel: HotelData | null;
}

const props = defineProps<Props>();

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800";

// Get main image (primary or first image)
const mainImage = computed(() => {
  if (!props.hotel?.images?.length) return DEFAULT_IMAGE;
  const primary = props.hotel.images.find((img) => img.isPrimary);
  return primary?.imageUrl || props.hotel.images[0]?.imageUrl || DEFAULT_IMAGE;
});

// Get 4 thumbnail images
const thumbnailImages = computed(() => {
  if (!props.hotel?.images?.length) {
    return Array(4).fill({
      imageUrl: DEFAULT_IMAGE,
      description: "Default Image",
    });
  }

  const sorted = [...props.hotel.images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const thumbnails = sorted.filter((img) => !img.isPrimary).slice(0, 4);

  // Fill with default images if less than 4
  while (thumbnails.length < 4) {
    thumbnails.push({
      imageUrl: DEFAULT_IMAGE,
      isPrimary: false,
      displayOrder: thumbnails.length,
    });
  }

  return thumbnails;
});

defineEmits(["imageClick"]);
</script>
