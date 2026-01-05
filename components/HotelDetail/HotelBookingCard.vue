<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="space-y-4 mb-6">
      <div class="text-sm text-gray-600">
        <div class="font-semibold text-gray-800 mb-1">
          {{ guests }}
        </div>
        <div v-if="roomTypes && roomTypes.length">
          {{ roomTypes.join(", ") }}
        </div>
      </div>

      <div class="flex items-start gap-2 text-sm text-gray-600">
        <i class="pi pi-map-marker text-blue-600 mt-1"></i>
        <span>{{ location }}</span>
      </div>

      <div class="border-t pt-4">
        <div class="flex items-end justify-between mb-4">
          <div>
            <div class="text-3xl font-bold text-green-600">
              {{ formatPrice(minPrice) }}
            </div>
            <div class="text-sm text-gray-600">Per night</div>
            <div v-if="maxPrice > minPrice" class="text-xs text-gray-500 mt-1">
              Up to {{ formatPrice(maxPrice) }}
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <Button @click="toggleLike">
            <i
              :class="[
                'p-1 transition-all duration-100',
                isLiked
                  ? 'text-red-500 pi pi-heart-fill'
                  : 'text-white pi pi-heart',
              ]"
            />
          </Button>
          <Button
            label="Book Now"
            class="flex-1 bg-blue-600 hover:bg-blue-700 border-blue-600"
            @click="$emit('bookNow')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "primevue";

interface Props {
  location: string;
  minPrice: number;
  maxPrice: number;
  roomTypes?: string[];
  guests?: string;
}

const props = withDefaults(defineProps<Props>(), {
  guests: "2 Adults, 3 Children, 4 Nights",
  roomTypes: () => ["Two Rooms", "Double Bed"],
});

const isLiked = ref(false);

const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

defineEmits(["bookNow"]);
</script>
