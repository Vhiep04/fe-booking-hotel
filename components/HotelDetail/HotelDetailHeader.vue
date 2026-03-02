<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500 mb-3">
      <ol class="flex flex-wrap gap-1">
        <li v-for="(item, index) in breadcrumbs" :key="index">
          <NuxtLink
            v-if="item.link"
            :to="item.link"
            class="hover:underline text-blue-600"
          >
            {{ item.label }}
          </NuxtLink>
          <span v-else class="text-gray-700 font-medium">
            {{ item.label }}
          </span>
          <span v-if="index < breadcrumbs.length - 1"> › </span>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between gap-4">
      <!-- Left -->
      <div>
        <!-- Rating stars -->
        <div class="flex items-center gap-1 mb-1">
          <span class="text-yellow-400 text-sm">★ ★ ★</span>
        </div>

        <!-- Hotel Name -->
        <h1 class="text-2xl font-bold text-gray-900">
          {{ hotel.name }}
        </h1>

        <!-- Location -->
        <div class="flex items-center text-sm text-gray-600 mt-1">
          <i class="pi pi-map-marker mr-1 text-blue-600"></i>
          <span>{{ hotel.location }}</span>
          <button
            class="ml-2 text-blue-600 hover:underline text-sm font-medium"
            @click="$emit('showMap')"
          >
            Vị trí xuất sắc - hiển thị bản đồ
          </button>
        </div>
      </div>

      <!-- Right actions -->
      <div class="flex items-start gap-3">
        <button class="border rounded-lg p-2 hover:bg-gray-100">
          <i class="pi pi-heart"></i>
        </button>
        <button class="border rounded-lg p-2 hover:bg-gray-100">
          <i class="pi pi-share-alt"></i>
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          @click="$emit('bookNow')"
        >
          Đặt ngay
        </button>
      </div>
    </div>

    <!-- Gallery + Rating box -->
    <div class="grid lg:grid-cols-4 gap-4 mt-6">
      <!-- Gallery -->
      <div class="lg:col-span-3 grid grid-cols-4 gap-2">
        <img
          :src="mainImage"
          class="col-span-2 row-span-2 h-full w-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
        />
        <img
          v-for="(img, index) in thumbnails"
          :key="index"
          :src="img.imageUrl"
          class="h-full w-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
        />
      </div>

      <!-- Rating box + Mini map -->
      <div class="flex flex-col gap-3">
        <!-- Rating card -->
        <div class="border rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ ratingLabel }}</p>
              <p class="text-sm text-gray-500">
                {{ hotel.totalReviews }} đánh giá
              </p>
            </div>
            <div
              class="bg-blue-600 text-white px-3 py-1 rounded font-bold text-lg"
            >
              {{ ratingScore }}
            </div>
          </div>

          <div class="mt-4 text-sm text-gray-600">
            <p class="font-medium mb-1">Khách lưu trú ở đây thích điều gì?</p>
            <p class="italic text-gray-500 leading-relaxed">
              "Vị trí đẹp, phòng mới, sạch sẽ. Nhân viên vui vẻ, nhiệt tình"
            </p>
          </div>

          <!-- Beach score nếu có -->
          <div
            v-if="hotel.locationScore"
            class="mt-3 flex items-center justify-between border-t pt-3"
          >
            <p class="text-sm text-gray-600">
              Bãi biển được đánh giá hàng đầu gần đó
            </p>
            <span
              class="bg-blue-600 text-white text-sm font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0"
            >
              {{ hotel.locationScore }}
            </span>
          </div>
        </div>

        <HotelMiniMap
          :lat="hotel.latitude ?? 16.0544"
          :lng="hotel.longitude ?? 108.2022"
          :name="hotel.name"
          :hidden="isMapOpen"
          @click="$emit('showMap')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HotelData } from "~/stores/interface/response/cityList";
import HotelMiniMap from "./HotelMiniMap.vue";

interface Props {
  hotel: HotelData;
  isMapOpen?: boolean;
}

const props = defineProps<Props>();
defineEmits(["bookNow", "showMap"]);

const breadcrumbs = [
  { label: "Trang chủ", link: "/" },
  { label: "Khách sạn", link: "/hotels" },
  { label: "Việt Nam", link: "/hotels/vietnam" },
  { label: "Đà Nẵng", link: null },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

const mainImage = computed(() => {
  const primary = props.hotel.images?.find((i) => i.isPrimary);
  return primary?.imageUrl || DEFAULT_IMAGE;
});

const thumbnails = computed(() => {
  return props.hotel.images?.filter((i) => !i.isPrimary).slice(0, 4) || [];
});

const ratingScore = computed(() => {
  return props.hotel.averageRating
    ? props.hotel.averageRating.toFixed(1)
    : "8.2";
});

const ratingLabel = computed(() => {
  const score = props.hotel.averageRating ?? 8.0;
  if (score >= 9) return "Xuất sắc";
  if (score >= 8) return "Rất tốt";
  if (score >= 7) return "Tốt";
  return "Khá tốt";
});

// Static map thumbnail từ OpenStreetMap (không cần API key)
const staticMapUrl = computed(() => {
  const lat = props.hotel.latitude ?? 16.0544;
  const lng = props.hotel.longitude ?? 108.2022;
  const zoom = 15;
  // Dùng staticmap API của OpenStreetMap
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=300x160&markers=${lat},${lng},lightblue`;
});

const onMapImgError = (e: Event) => {
  // Fallback nếu static map lỗi: dùng màu gradient thay thế
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
};
</script>
