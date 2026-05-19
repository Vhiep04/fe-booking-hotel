<template>
  <div
    v-if="cityInfo && cityInfo.data"
    class="flex flex-col md:flex-row bg-white gap-0 max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-md border border-gray-100"
  >
    <!-- Map -->
    <div class="w-full md:w-80 lg:w-96 h-56 md:h-auto shrink-0 relative">
      <MapView
        v-if="cityCoords"
        :latitude="cityCoords[0]"
        :longitude="cityCoords[1]"
        :location-name="cityData.name"
        class="w-full h-full min-h-56"
      />

      <!-- Map Fallback -->
      <div
        v-else
        class="w-full h-full min-h-56 bg-gradient-to-br from-[#e8f4fb] to-[#c8e6f5] flex flex-col items-center justify-center gap-3"
      >
        <svg
          class="w-12 h-12 text-[#07689F] opacity-50"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 6.75V15m6-6v8.25m.503-9.998 4.875 2.25M9 3l-4.875 2.25m0 0L9 7.5m-4.875-2.25v9l4.875 2.25M9 7.5l6 3m0 0 4.875-2.25M15 10.5V18.75m0-8.25L9 7.5"
          />
        </svg>
        <p class="text-[#07689F] text-sm font-medium opacity-60">
          {{ t("Map unavailable") }}
        </p>
      </div>
    </div>

    <!-- Info -->
    <div class="flex-1 p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between mb-1">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ cityData?.name }}
          </h2>
        </div>

        <div class="flex items-center gap-2 mb-4">
          <span
            class="inline-flex items-center gap-1.5 text-sm text-[#07689F] bg-[#e8f4fb] px-3 py-1 rounded-full font-medium"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            {{ hotelTotal }} {{ t("Hotel Found") }}
          </span>
        </div>

        <p class="text-gray-600 leading-relaxed text-sm">
          {{ cityData?.description }}
        </p>
      </div>
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
