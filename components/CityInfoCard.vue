<template>
  <div
    v-if="cityInfo && cityInfo.data"
    class="flex flex-col md:flex-row bg-gray-100 gap-6 p-6 max-w-7xl mx-auto"
  >
    <!-- Map -->
    <div
      class="w-full md:w-80 lg:w-96 h-56 md:h-72 lg:h-80 shrink-0 rounded-xl overflow-hidden shadow-md"
    >
      <MapView
        v-if="cityCoords"
        :latitude="cityCoords[0]"
        :longitude="cityCoords[1]"
        :location-name="cityData.name"
        class="w-full h-full"
      />
    </div>

    <!-- Info -->
    <div class="flex-1">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        {{ cityData?.name }}
      </h2>

      <p class="text-sm text-gray-600 mb-4">
        {{ hotelTotal }} {{ t("Hotel Found") }}
      </p>

      <p class="text-gray-700 leading-relaxed">
        {{ cityData?.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import MapView from "./shared/MapView.vue";
import type { CityResponse } from "~/stores/interface/response/cityList";
import { toRefs } from "vue";

const { t } = useI18n();

const props = defineProps<{
  cityInfo: CityResponse;
  hotelTotal?: number;
}>();

const { cityInfo, hotelTotal } = toRefs(props);

// Sort
const selectedSort = ref(null);
const sortOptions = [
  { label: "Our Top Picks For Families", value: "top" },
  { label: "Price: Low to High", value: "low" },
  { label: "Price: High to Low", value: "high" },
];

// City data
const cityData = computed(() => {
  const data = cityInfo.value?.data;
  return Array.isArray(data) ? data[0] : data;
});

const cityCoords = computed<[number, number] | null>(() => {
  const lat = cityData.value?.latitude;
  const lng = cityData.value?.longitude;
  return typeof lat === "number" && typeof lng === "number" ? [lat, lng] : null;
});
</script>
