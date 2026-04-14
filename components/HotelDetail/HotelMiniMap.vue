<template>
  <div
    class="border rounded-lg overflow-hidden cursor-pointer group relative"
    style="position: relative; z-index: 0"
    @click="$emit('click')"
  >
    <div
      ref="miniMapContainer"
      class="w-full"
      style="height: 160px; position: relative; z-index: 0"
    ></div>

    <div
      class="absolute bottom-0 left-0 right-0 bg-blue-600 group-hover:bg-blue-700 text-white text-center text-sm font-semibold py-2 transition-colors"
      style="z-index: 1"
    >
      Hiển thị trên bản đồ
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import "leaflet/dist/leaflet.css";

const props = defineProps<{
  lat: number;
  lng: number;
  name: string;
  hidden?: boolean;
}>();

defineEmits(["click"]);

const { $L } = useNuxtApp();
const miniMapContainer = ref<HTMLElement | null>(null);
let miniMap: any = null;

const makeIcon = () =>
  $L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const initMiniMap = async () => {
  if (!miniMapContainer.value) return;

  if (miniMap) {
    miniMap.remove();
    miniMap = null;
  }

  const coords: [number, number] = [props.lat, props.lng];

  miniMap = $L.map(miniMapContainer.value, {
    center: coords,
    zoom: 15,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    keyboard: false,
    attributionControl: false,
  });

  $L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(miniMap);

  $L.marker(coords, { icon: makeIcon() }).addTo(miniMap);

  await nextTick();
  miniMap.invalidateSize();
};

const destroyMiniMap = () => {
  if (miniMap) {
    miniMap.remove();
    miniMap = null;
  }
};

watch(
  () => props.hidden,
  async (isHidden) => {
    if (isHidden) {
      destroyMiniMap();
    } else {
      await nextTick();
      initMiniMap();
    }
  },
);

onMounted(() => nextTick(initMiniMap));
onBeforeUnmount(() => destroyMiniMap());
</script>

<style scoped>
:deep(.leaflet-control-attribution) {
  display: none;
}

:deep(.leaflet-pane),
:deep(.leaflet-top),
:deep(.leaflet-bottom) {
  z-index: 1 !important;
  position: absolute;
}

:deep(.leaflet-map-pane) {
  z-index: 1 !important;
}
</style>
