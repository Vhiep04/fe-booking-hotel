<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex">
      <div
        class="w-[370px] bg-white flex flex-col shadow-xl overflow-y-auto shrink-0"
      >
        <!-- Hotel Info -->
        <div class="p-4 border-b">
          <div class="flex gap-3">
            <img
              :src="hotelImage"
              class="w-20 h-20 object-cover rounded-lg shrink-0"
              :alt="name"
            />
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h3
                  class="font-semibold text-blue-600 text-sm leading-tight pr-2"
                >
                  {{ name }}
                </h3>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-black shrink-0 text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <div class="flex items-center gap-0.5 mt-1">
                <template v-for="i in 5" :key="i">
                  <span
                    class="text-xs"
                    :class="
                      i <= Math.round(ratingScore ?? 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                    >★</span
                  >
                </template>
              </div>

              <!-- Rating -->
              <div class="flex items-center gap-2 mt-2">
                <span
                  class="bg-blue-600 text-white text-sm font-bold px-2 py-0.5 rounded"
                >
                  {{ formattedRating }}
                </span>
                <div>
                  <p class="text-xs font-semibold">{{ ratingLabel }}</p>
                  <p class="text-xs text-gray-500">
                    {{ totalReviews }} {{ t("reviews") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address -->
          <p class="text-xs text-gray-500 mt-3">{{ address }}</p>

          <!-- Book button -->
          <button
            class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
            @click="handleBookNow"
          >
            {{ t("Reserve Now") }}
          </button>
        </div>

        <!-- Search distance -->
        <div class="p-3 border-b">
          <div
            class="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:border-blue-400 transition-colors"
          >
            <i class="pi pi-search text-gray-400 text-sm"></i>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('See distance from')"
              class="text-sm outline-none flex-1 placeholder-gray-400"
            />
          </div>
        </div>

        <div class="p-4 flex-1">
          <p class="text-sm font-semibold mb-3">
            {{ t("Top nearby attractions") }}
          </p>

          <div
            v-if="isLoadingPlaces"
            class="flex items-center gap-2 text-sm text-gray-500 py-4"
          >
            <i class="pi pi-spin pi-spinner text-blue-600"></i>
            <span>{{ t("Loading places...") }}</span>
          </div>

          <div v-else-if="displayedPlaces.length > 0" class="space-y-2">
            <div
              v-for="place in displayedPlaces"
              :key="place.name"
              class="flex justify-between items-center text-sm py-1 hover:bg-gray-50 rounded px-1 cursor-pointer transition-colors"
              @click="focusPlace(place)"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-base shrink-0">{{ place.icon }}</span>
                <span class="text-gray-700 truncate">{{ place.name }}</span>
              </div>
              <span class="text-gray-500 shrink-0 ml-3 text-xs font-medium">
                {{ place.distance }}
              </span>
            </div>
          </div>

          <div v-else class="text-sm text-gray-400 py-4 text-center">
            {{ t("No nearby places found") }}
          </div>
        </div>
      </div>

      <!-- Map -->
      <div class="flex-1 relative">
        <button
          class="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
          @click="$emit('close')"
        >
          {{ t("Close map") }}
        </button>

        <MapView
          v-if="open && isReady"
          :latitude="lat"
          :longitude="lng"
          :location-name="name"
          :zoom="15"
          class="w-full h-full"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { useI18n } from "vue-i18n";
import MapView from "../shared/MapView.vue";

const { t } = useI18n();

const props = defineProps<{
  open: boolean;
  lat: number;
  lng: number;
  name: string;
  hotelImage?: string;
  ratingScore?: number;
  totalReviews?: number;
  address?: string;
  locationScore?: number;
}>();

const emit = defineEmits(["close", "bookNow"]);

const isReady = ref(false);
const searchQuery = ref("");
const isLoadingPlaces = ref(false);

interface NearbyPlace {
  name: string;
  distance: string;
  distanceMeters: number;
  icon: string;
  type: string;
  lat: number;
  lng: number;
}

const nearbyPlaces = ref<NearbyPlace[]>([]);

const displayedPlaces = computed(() => {
  if (!searchQuery.value.trim()) return nearbyPlaces.value.slice(0, 10);
  const q = searchQuery.value.toLowerCase();
  return nearbyPlaces.value
    .filter((p) => p.name.toLowerCase().includes(q))
    .slice(0, 10);
});

const formattedRating = computed(() => {
  return props.ratingScore ? props.ratingScore.toFixed(1) : "5";
});

const ratingLabel = computed(() => {
  const score = props.ratingScore ?? 8.0;
  if (score >= 9) return t("Excellent");
  if (score >= 8) return t("Very Good");
  if (score >= 7) return t("Good");
  return t("Fairly Good");
});

const hotelImage = computed(
  () =>
    props.hotelImage ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80",
);

const getIcon = (tags: Record<string, string>): string => {
  if (tags.tourism === "beach" || tags.natural === "beach") return "🏖️";
  if (tags.tourism === "museum") return "🏛️";
  if (tags.tourism === "attraction" || tags.tourism === "viewpoint")
    return "🎯";
  if (tags.amenity === "restaurant") return "🍽️";
  if (tags.amenity === "cafe") return "☕";
  if (tags.amenity === "bar") return "🍺";
  if (tags.leisure === "park") return "🌳";
  if (tags.amenity === "hospital" || tags.amenity === "pharmacy") return "🏥";
  if (tags.amenity === "bank" || tags.amenity === "atm") return "🏦";
  if (tags.shop) return "🛍️";
  return "📍";
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): { text: string; meters: number } => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const text =
    dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(1)} km`;
  return { text, meters: dist };
};

const fetchNearbyPlaces = async (lat: number, lng: number) => {
  isLoadingPlaces.value = true;
  try {
    const radius = 3000;
    const query = `
      [out:json][timeout:10];
      (
        node["tourism"~"attraction|museum|beach|viewpoint|theme_park|zoo"](around:${radius},${lat},${lng});
        node["natural"="beach"](around:${radius},${lat},${lng});
        node["leisure"~"park|beach"](around:${radius},${lat},${lng});
        node["amenity"~"restaurant|cafe|bar"](around:${radius},${lat},${lng});
        node["historic"](around:${radius},${lat},${lng});
      );
      out body 50;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!res.ok) throw new Error("Overpass API error");

    const data = await res.json();

    const places: NearbyPlace[] = data.elements
      .filter((el: any) => el.tags?.name)
      .map((el: any) => {
        const { text, meters } = calculateDistance(lat, lng, el.lat, el.lon);
        return {
          name: el.tags["name:vi"] || el.tags.name,
          distance: text,
          distanceMeters: meters,
          icon: getIcon(el.tags),
          type:
            el.tags.tourism || el.tags.amenity || el.tags.leisure || "other",
          lat: el.lat,
          lng: el.lon,
        };
      })
      .sort(
        (a: NearbyPlace, b: NearbyPlace) => a.distanceMeters - b.distanceMeters,
      );

    const seen = new Set<string>();
    nearbyPlaces.value = places.filter((p: NearbyPlace) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
  } catch (err) {
    console.error("Failed to fetch nearby places:", err);
    nearbyPlaces.value = [
      {
        name: "Công viên Biển Đông",
        distance: "200 m",
        distanceMeters: 200,
        icon: "🌳",
        type: "park",
        lat,
        lng,
      },
      {
        name: "Bãi biển Mỹ Khê",
        distance: "350 m",
        distanceMeters: 350,
        icon: "🏖️",
        type: "beach",
        lat,
        lng,
      },
    ];
  } finally {
    isLoadingPlaces.value = false;
  }
};

const focusPlace = (place: NearbyPlace) => {
  console.log("Focus place:", place);
};

const handleBookNow = () => {
  emit("close");
  emit("bookNow");
};

watch(
  () => props.open,
  async (val) => {
    if (val) {
      isReady.value = false;
      await nextTick();
      setTimeout(() => {
        isReady.value = true;
      }, 100);

      if (props.lat && props.lng) {
        await fetchNearbyPlaces(props.lat, props.lng);
      }
    } else {
      isReady.value = false;
    }
  },
);
</script>
