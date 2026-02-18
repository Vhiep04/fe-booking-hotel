<template>
  <div class="relative h-full w-full">
    <div
      ref="mapContainer"
      class="h-full w-full rounded-lg overflow-hidden shadow-lg"
    ></div>

    <!-- Toggle Map Button -->
    <button
      @click="toggleMapType"
      class="absolute top-3 right-3 z-[1000] bg-white px-3 py-2 rounded-lg shadow text-sm font-medium hover:bg-gray-100"
    >
      {{ isSatellite ? "Map" : "Satellite" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import "leaflet/dist/leaflet.css";

interface Props {
  latitude: number;
  longitude: number;
  locationName?: string;
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  locationName: "Location",
  zoom: 12,
});

const { $L } = useNuxtApp();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

// Layers
let normalLayer: L.TileLayer | null = null;
let satelliteLayer: L.TileLayer | null = null;
let labelLayer: L.TileLayer | null = null;

const isSatellite = ref(false);

// Marker icons
const redIcon = $L.icon({
  iconUrl: "icons/leaf-red.png",
  shadowUrl: "icons/leaf-shadow.png",
  iconSize: [38, 95],
  shadowSize: [50, 64],
  shadowAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const greenIcon = $L.icon({
  iconUrl: "icons/leaf-green.png",
  shadowUrl: "icons/leaf-shadow.png",
  iconSize: [38, 95],
  shadowSize: [50, 64],
  shadowAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const initMap = () => {
  if (!mapContainer.value) return;

  if (map) {
    map.remove();
    map = null;
  }

  const coords: [number, number] = [props.latitude, props.longitude];

  map = $L.map(mapContainer.value, {
    center: coords,
    zoom: props.zoom,
  });

  // Normal map layer
  normalLayer = $L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 19 },
  );

  // Satellite layer
  satelliteLayer = $L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19 },
  );

  // Label overlay layer
  labelLayer = $L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  );

  normalLayer.addTo(map);

  marker = $L.marker(coords, { icon: redIcon }).addTo(map);
  marker.bindPopup(`<b>${props.locationName}</b>`).openPopup();
};

const toggleMapType = () => {
  if (!map || !normalLayer || !satelliteLayer || !labelLayer || !marker) return;

  if (isSatellite.value) {
    // Switch to normal map
    map.removeLayer(satelliteLayer);
    map.removeLayer(labelLayer);
    normalLayer.addTo(map);
    marker.setIcon(redIcon);
  } else {
    // Switch to satellite
    map.removeLayer(normalLayer);
    satelliteLayer.addTo(map);
    labelLayer.addTo(map);
    marker.setIcon(greenIcon);
  }

  isSatellite.value = !isSatellite.value;
};

onMounted(() => nextTick(initMap));

watch(
  () => [props.latitude, props.longitude],
  () => nextTick(initMap),
  { deep: true },
);

onBeforeUnmount(() => {
  if (map) map.remove();
});
</script>

<style scoped>
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}
</style>
