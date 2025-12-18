<template>
  <div
    v-if="cityInfo && cityInfo.data"
    class="flex bg-gray-100 gap-6 p-6 max-w-7xl mx-auto"
  >
    <!-- Map Section -->
    <div class="w-[383px] h-[393px] flex-shrink-0">
      <div
        ref="mapContainer"
        class="h-[80%] rounded-lg overflow-hidden shadow-lg"
      ></div>
    </div>

    <!-- Content Section -->
    <div class="flex-1">
      <!-- Sort By Dropdown -->
      <div class="mb-6">
        <Dropdown
          v-model="selectedSort"
          :options="sortOptions"
          optionLabel="label"
          placeholder="Sort By : Our Top Picks For Families"
          class="w-full md:w-80 border-2 border-gray-300 rounded-lg"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <span>Sort By : {{ slotProps.value.label }}</span>
            </div>
            <span v-else class="text-gray-600">
              Sort By : Our Top Picks For Families
            </span>
          </template>
        </Dropdown>
      </div>

      <!-- Location Card -->
      <div class="rounded-lg">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ cityData.name }}
        </h2>

        <p class="text-sm text-gray-600 mb-4">
          {{ hotelTotal }} Properties Found
        </p>

        <div class="text-gray-700 leading-relaxed">
          <p class="mb-2">
            {{ cityData.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import "leaflet/dist/leaflet.css";
import Dropdown from "primevue/dropdown";
import type { CityResponse } from "~/stores/interface/response/cityList";
import { toRefs } from "vue";

const props = defineProps<{
  cityInfo: CityResponse;
  hotelTotal?: number;
}>();

const { cityInfo, hotelTotal } = toRefs(props);

const { $L } = useNuxtApp();
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

const selectedSort = ref(null);
const sortOptions = ref([
  { label: "Our Top Picks For Families", value: "top-picks" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Guest Rating", value: "rating" },
  { label: "Distance from City Center", value: "distance" },
]);

var greenIcon = $L.icon({
  iconUrl: "icons/leaf-red.png",
  shadowUrl: "icons/leaf-shadow.png",

  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const cityData = Array.isArray(cityInfo.value.data)
  ? cityInfo.value.data[0]
  : cityInfo.value.data;

const cityCoords = computed<[number, number] | null>(() => {
  if (!cityInfo.value) {
    console.log("cityInfo.value is null/undefined");
    return null;
  }

  // const cityData = Array.isArray(cityInfo.value.data)
  //   ? cityInfo.value.data[0]
  //   : cityInfo.value.data;

  console.log("cityData:", cityData);

  if (!cityData) {
    console.log("cityData is null/undefined");
    return null;
  }

  const lat = cityData.latitude;
  const lng = cityData.longitude;

  console.log("lat:", lat, "lng:", lng);

  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    isNaN(lat) ||
    isNaN(lng)
  ) {
    console.log("Invalid coordinates");
    return null;
  }

  return [lat, lng];
});

const initMap = () => {
  if (map) {
    map.remove();
    map = null;
    marker = null;
  }

  const coords = cityCoords.value;

  if (!mapContainer.value || !coords || !$L) {
    console.warn("Cannot initialize map:", {
      hasContainer: !!mapContainer.value,
      hasCoords: !!coords,
      hasLeaflet: !!$L,
    });
    return;
  }

  try {
    console.log("Initializing map with coords:", coords);

    map = $L.map(mapContainer.value, {
      center: coords,
      zoom: 12,
    });

    $L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Lấy tên city
    const cityData = Array.isArray(cityInfo.value.data)
      ? cityInfo.value.data[0]
      : cityInfo.value.data;

    marker = $L.marker(coords, { icon: greenIcon }).addTo(map);
    marker.bindPopup(`<b>${cityData.name || "Unknown City"}</b>`).openPopup();

    console.log("Map initialized successfully");
  } catch (error) {
    console.error("Error initializing map:", error);
  }
};

onMounted(() => {
  console.log("Component mounted");
  nextTick(() => {
    if (cityInfo.value?.data) {
      initMap();
    }
  });
});

watch(
  () => cityInfo.value,
  (newVal) => {
    console.log("cityInfo changed:", newVal);
    if (newVal?.data) {
      nextTick(() => {
        initMap();
      });
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
:deep(.p-dropdown) {
  border-radius: 0.5rem;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #3b82f6;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 0;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
}
</style>
