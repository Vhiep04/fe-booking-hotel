<template>
  <div
    v-if="cityInfo && cityInfo.data"
    class="flex bg-gray-100 gap-6 p-6 max-w-7xl mx-auto"
  >
    <!-- Map Section -->
    <div class="w-[383px] h-[393px] flex-shrink-0">
      <MapView
        v-if="cityCoords"
        :latitude="cityCoords[0]"
        :longitude="cityCoords[1]"
        :location-name="cityData.name"
      />
    </div>

    <!-- Content Section -->
    <div class="flex-1">
      <!-- <div class="mb-6">
        <Dropdown
          v-model="selectedSort"
          :options="sortOptions"
          optionLabel="label"
          placeholder="Sort By : Our Top Picks For Families"
          class="w-full md:w-80 border-2 border-gray-300 rounded-lg"
        />
      </div> -->

      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        {{ cityData?.name }}
      </h2>

      <p class="text-sm text-gray-600 mb-4">
        {{ hotelTotal }} Properties Found
      </p>

      <p class="text-gray-700 leading-relaxed">
        {{ cityData?.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from "primevue/dropdown";
import MapView from "./shared/MapView.vue";
import type { CityResponse } from "~/stores/interface/response/cityList";
import { toRefs } from "vue";

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
