<template>
  <div class="relative h-full w-full" style="isolation: isolate">
    <div
      ref="mapContainer"
      class="h-full w-full rounded-lg overflow-hidden shadow-lg"
    ></div>

    <button
      @click="toggleMapType"
      class="absolute top-3 right-3 z-1000 bg-white px-3 py-2 rounded-lg shadow text-sm font-medium hover:bg-gray-100"
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

let normalLayer: L.TileLayer | null = null;
let satelliteLayer: L.TileLayer | null = null;
let labelLayer: L.TileLayer | null = null;

const isSatellite = ref(false);

const greenIcon = $L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = $L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#ef4444"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40],
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
    map.removeLayer(satelliteLayer);
    map.removeLayer(labelLayer);
    normalLayer.addTo(map);
    marker.setIcon(greenIcon);
  } else {
    map.removeLayer(normalLayer);
    satelliteLayer.addTo(map);
    labelLayer.addTo(map);
    marker.setIcon(redIcon);
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
