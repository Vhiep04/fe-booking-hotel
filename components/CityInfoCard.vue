<template>
  <div class="flex bg-gray-100 gap-6 p-6 max-w-7xl mx-auto">
    <!-- Map Section -->
    <div class="w-[383px] h-[393px] flex-shrink-0">
      <div class="mb-3">
        <input
          v-model="searchQuery"
          @keyup.enter="searchLocation"
          type="text"
          placeholder="Search location..."
          class="w-full px-3 py-2 border rounded-lg shadow bg-white"
        />
      </div>
      <div
        ref="mapContainer"
        class="w-full h-full rounded-lg overflow-hidden shadow-lg"
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
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Gothenburg</h2>

        <p class="text-sm text-gray-600 mb-4">120 Properties Found</p>

        <div class="text-gray-700 leading-relaxed">
          <p class="mb-2">
            Travel Professionals Dedicated To Simplifying Your Travel Experience
            By Curating Flight And Accommodation Services On A User-Friendly
            Platform. Committed To Quality And Assurance.
            <a
              href="#"
              class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              Find More Here ...
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const { $L } = useNuxtApp();
import "leaflet/dist/leaflet.css";
import Dropdown from "primevue/dropdown";

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;
const searchQuery = ref("");

const selectedSort = ref(null);
const sortOptions = ref([
  { label: "Our Top Picks For Families", value: "top-picks" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Guest Rating", value: "rating" },
  { label: "Distance from City Center", value: "distance" },
]);

// Tọa độ Gothenburg
const gothenburgCoords: [number, number] = [57.7089, 11.9746];

// Search function
const searchLocation = async () => {
  if (!searchQuery.value.trim()) return;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    searchQuery.value
  )}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0) {
    alert("Không tìm thấy địa điểm!");
    return;
  }

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  // Move map
  map?.setView([lat, lon], 14);

  // Move marker
  if (marker) marker.remove();
  marker = $L.marker([lat, lon]).addTo(map);

  marker.bindPopup(`<b>${searchQuery.value}</b>`).openPopup();
};

onMounted(() => {
  if (mapContainer.value) {
    // Khởi tạo map
    map = $L.map(mapContainer.value, {
      center: gothenburgCoords,
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // Thêm tile layer (bản đồ nền)
    $L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Tạo custom icon
    const customIcon = $L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative">
          <div class="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Thêm marker
    const marker = $L.marker(gothenburgCoords, { icon: customIcon }).addTo(map);

    // Thêm popup
    marker.bindPopup(`
      <div class="text-center">
        <h3 class="font-bold text-lg">Gothenburg</h3>
        <p class="text-sm text-gray-600">120 Properties Available</p>
      </div>
    `);

    // Mở popup ngay khi load
    // marker.openPopup();
  }
});

// Cleanup khi component unmount
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

/* Custom marker styles */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

/* Leaflet popup customization */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 0;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
}
</style>
