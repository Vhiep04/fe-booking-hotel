<template>
  <Card
    class="group h-auto hover:cursor-pointer hover:shadow-xl transition-shadow duration-300 mb-6"
    style="overflow: hidden"
    @click="goToHotelDetail"
  >
    <template #content>
      <div class="flex gap-6 p-0">
        <!-- Left - Image Section -->
        <div class="relative w-64 shrink-0">
          <img
            :alt="hotel.name"
            :src="
              hotel.primaryImageUrl || '../assets/images/detail_hotel_1.jpg'
            "
            class="w-full h-full object-cover rounded-lg"
          />

          <button
            class="absolute top-3 left-3 rounded-full"
            :disabled="favouriteStore.isLoading"
            @click.stop="handleToggleFavourite"
          >
            <i
              :class="[
                'bg-white rounded-3xl p-1 transition-all duration-300',
                isFavourited
                  ? 'text-red-500 pi pi-heart-fill'
                  : 'text-black pi pi-heart hover:text-red-500',
              ]"
            />
          </button>

          <div class="absolute bottom-3 left-3 flex gap-1">
            <span
              v-for="(img, index) in hotel.images.slice(0, 4)"
              :key="index"
              :class="[
                'w-2 h-2 bg-white rounded-full',
                index === 0 ? 'opacity-100' : 'opacity-50',
              ]"
            ></span>
          </div>

          <div
            v-if="hotel.averageRating"
            class="absolute bottom-3 right-3 bg-gray-800 text-white px-2 py-1 rounded text-sm font-semibold"
          >
            {{ hotel.averageRating }}
          </div>
        </div>

        <!-- Right - Content Section -->
        <div class="flex-1 flex justify-between py-2">
          <!-- Middle - Hotel Info -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">
              {{ hotel.name }}
            </h2>

            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <i class="pi pi-map-marker text-sm"></i>
              <span class="text-sm">{{ hotel.location }}</span>
            </div>

            <!-- Facilities — dùng translateFacility -->
            <div
              v-if="(hotel.popularFacilities ?? []).length > 0"
              class="flex items-center gap-2 text-gray-600 mb-2"
            >
              <i class="pi pi-shopping-bag text-sm"></i>
              <span class="text-sm">
                {{
                  (hotel.popularFacilities ?? [])
                    .slice(0, 5)
                    .map((f: { name: string }) => translateFacility(f.name))
                    .join(", ")
                }}
                <span v-if="(hotel.popularFacilities ?? []).length > 5"
                  >...</span
                >
              </span>
            </div>

            <!-- Available Room Types — dùng translateRoomType -->
            <p
              v-if="
                hotel.availableRoomTypes && hotel.availableRoomTypes.length > 0
              "
              class="text-gray-700 font-medium mb-3"
            >
              {{
                hotel.availableRoomTypes
                  .map((rt: string) => translateRoomType(rt))
                  .join(", ")
              }}
            </p>

            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900">{{ t("Very Good") }}</span>
              <span class="text-gray-500 text-sm">
                {{ hotel.totalReviews }} {{ t("reviews") }}
              </span>
              <i class="pi pi-chevron-down text-sm text-gray-500"></i>
            </div>
          </div>

          <!-- Right - Price Section -->
          <div class="flex flex-col items-end justify-between pl-6">
            <div>
              <span
                class="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block"
              >
                12% {{ t("Off") }}
              </span>

              <div class="text-right mb-2">
                <span class="text-4xl font-bold text-green-600">
                  {{ formatPrice(hotel.minPricePerNight) }}
                </span>
              </div>

              <p class="text-xs text-gray-500 mb-3 text-right">
                {{ t("Includes taxes and charges") }}
              </p>
            </div>

            <Button
              :label="t('See Availability')"
              icon="pi pi-chevron-right"
              iconPos="right"
              class="bg-white text-blue-600 border-none hover:bg-blue-50 font-semibold shadow-none"
              text
              @click.stop="goToHotelDetail"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { HotelData } from "~/stores/interface/response/cityList";

const { t } = useI18n();
const router = useRouter();
const favouriteStore = useFavouriteHotelStore();
const authStore = useAuthStore();

const { translateFacility } = useFacilityTranslation();
const { translateRoomType } = useRoomTypeTranslation();

const props = defineProps<{
  hotel: HotelData;
}>();

const isFavourited = computed(() =>
  favouriteStore.isFavourited(props.hotel.hotelId),
);

async function handleToggleFavourite() {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }
  await favouriteStore.toggleFavourite(props.hotel.hotelId);
}

const formatPrice = (price: number | undefined | null): string => {
  if (price == null || isNaN(Number(price))) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

const goToHotelDetail = () => {
  router.push(`/hotels/${props.hotel.hotelId}`);
};
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
