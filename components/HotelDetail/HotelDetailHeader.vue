<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex flex-col lg:flex-row justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ hotel.name }}</h1>
        <div class="flex items-center text-sm text-gray-600 mt-1">
          <i class="pi pi-map-marker mr-1 text-blue-600"></i>
          <span>{{ hotel.location }}</span>
          <button
            class="ml-2 text-blue-600 hover:underline text-sm font-medium"
            @click="$emit('showMap')"
          >
            {{ t("Excellent location - show map") }}
          </button>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <button
          class="border rounded-lg p-2 hover:bg-gray-100 transition-colors"
          :class="{ 'text-red-500 border-red-300 bg-red-50': isFavourited }"
          :disabled="favouriteStore.isLoading"
          @click="handleToggleFavourite"
        >
          <i
            class="pi"
            :class="isFavourited ? 'pi-heart-fill' : 'pi-heart'"
          ></i>
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          @click="$emit('bookNow')"
        >
          {{ t("Reserve Now") }}
        </button>
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-3 mt-6 overflow-hidden">
      <!-- Gallery -->
      <div
        class="lg:col-span-3 grid grid-cols-4 grid-rows-2 gap-2 h-64 lg:h-80"
      >
        <img
          :src="mainImage"
          class="col-span-2 row-span-2 w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
          @error="onImgError"
        />
        <img
          v-for="(img, index) in thumbnails"
          :key="index"
          :src="img.imageUrl"
          class="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
          @error="onImgError"
        />
      </div>

      <div class="flex flex-col gap-3 min-w-0" style="isolation: isolate">
        <!-- Rating card -->
        <div class="border rounded-lg p-4 bg-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ ratingLabel }}</p>
              <p class="text-sm text-gray-500">
                {{ hotel.totalReviews }} {{ t("reviews") }}
              </p>
            </div>
            <div
              class="bg-blue-600 text-white px-3 py-1 rounded font-bold text-lg"
            >
              {{ ratingScore }}
            </div>
          </div>

          <div class="mt-3 text-sm text-gray-600">
            <p class="font-medium mb-1">{{ t("What do guests love here?") }}</p>
            <p class="italic text-gray-500 leading-relaxed text-xs">
              "{{ firstFeedbackComment }}"
            </p>
          </div>
        </div>

        <div style="isolation: isolate; position: relative; z-index: 0">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HotelData } from "~/stores/interface/response/cityList";
import HotelMiniMap from "./HotelMiniMap.vue";

const { t } = useI18n();

interface Props {
  hotel: HotelData;
  isMapOpen?: boolean;
}

const props = defineProps<Props>();
defineEmits(["bookNow", "showMap"]);

const favouriteStore = useFavouriteHotelStore();

const isFavourited = computed(() =>
  favouriteStore.isFavourited(props.hotel.hotelId),
);

const handleToggleFavourite = async () => {
  await favouriteStore.toggleFavourite(props.hotel.hotelId);
};

const starCount = computed(() => {
  const rating = Number(props.hotel.averageRating ?? 0);
  if (rating >= 4.5) return 5;
  if (rating >= 3.5) return 4;
  if (rating >= 2.5) return 3;
  if (rating >= 1.5) return 2;
  if (rating >= 0.5) return 1;
  return 0;
});

const breadcrumbs = computed(() => [
  { label: t("Home"), link: "/" },
  { label: t("Hotels"), link: "/hotels" },
  { label: t("Vietnam"), link: "/hotels/vietnam" },
  { label: props.hotel.name ?? t("Hotel"), link: null },
]);

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

const mainImage = computed(() => {
  const primary = props.hotel.images?.find((i) => i.isPrimary);
  return primary?.imageUrl || props.hotel.imgUrl || DEFAULT_IMAGE;
});

const thumbnails = computed(() => {
  return props.hotel.images?.filter((i) => !i.isPrimary).slice(0, 4) ?? [];
});

const ratingScore = computed(() => {
  const r = props.hotel.averageRating;
  if (!r) return "N/A";
  return typeof r === "number" ? r.toFixed(1) : parseFloat(r).toFixed(1);
});

const ratingLabel = computed(() => {
  const score = Number(props.hotel.averageRating ?? 0);
  if (score >= 4.5) return t("Excellent");
  if (score >= 4.0) return t("Very Good");
  if (score >= 3.0) return t("Good");
  return t("Fairly Good");
});

const firstFeedbackComment = computed(() => {
  const first = props.hotel.recentFeedbacks?.[0];
  if (!first) return t("No reviews yet.");
  return first.comment.length > 100
    ? first.comment.slice(0, 100) + "..."
    : first.comment;
});

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = DEFAULT_IMAGE;
};
</script>
