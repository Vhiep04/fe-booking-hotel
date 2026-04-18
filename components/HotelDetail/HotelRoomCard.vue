<template>
  <Card class="mb-4 hover:shadow-lg transition-shadow">
    <template #content>
      <div class="grid grid-cols-12 gap-4">
        <!-- Room Image & Info -->
        <div class="col-span-3">
          <img
            :src="room.imgUrl"
            :alt="room.roomType"
            class="w-full h-32 object-cover rounded-lg mb-2"
          />
          <h3 class="font-bold text-lg text-gray-900">{{ room.roomType }}</h3>
          <p class="text-sm text-gray-600">
            <i class="pi pi-users text-xs mr-1"></i>
            {{ room.capacity }} {{ room.capacity > 1 ? "guests" : "guest" }}
          </p>
        </div>

        <!-- Room Facilities -->
        <div class="col-span-4">
          <div class="text-sm text-gray-600 space-y-1">
            <p class="font-semibold text-gray-700 mb-2">
              {{ t("Room Facilities") }}:
            </p>
            <div class="grid grid-cols-2 gap-1">
              <div
                v-for="facility in displayedFacilities"
                :key="facility"
                class="flex items-center gap-1"
              >
                <i class="pi pi-check text-green-600 text-xs"></i>
                <span class="text-xs">{{ facility }}</span>
              </div>
            </div>
            <button
              v-if="room.facilities.length > 10"
              class="text-blue-600 text-xs hover:underline mt-2"
              @click.stop="showAllFacilities = !showAllFacilities"
            >
              {{
                showAllFacilities
                  ? t("Show Less")
                  : `+${room.facilities.length - 10} ${t("More Facilities")}`
              }}
            </button>
          </div>
        </div>

        <!-- Price & Booking Options -->
        <template v-if="hasSearchData">
          <div class="col-span-3 border-l pl-4">
            <div class="space-y-2">
              <div
                v-if="room.facilities.includes('Free Cancellation')"
                class="flex items-center gap-1 text-green-600 text-xs"
              >
                <i class="pi pi-check-circle"></i>
                <span
                  >{{ t("Free Cancellation Before") }}
                  {{ freeCancellationDateVi }}</span
                >
              </div>
              <div
                v-if="room.facilities.includes('Breakfast Included')"
                class="flex items-center gap-1 text-green-600 text-xs"
              >
                <i class="pi pi-check-circle"></i>
                <span>{{ t("No Prepayment Pay At Property") }}</span>
              </div>
              <div class="flex items-center gap-1 text-green-600 text-xs">
                <i class="pi pi-check-circle"></i>
                <span>{{ t("Free Cancellation Refund") }}</span>
              </div>
              <div class="text-xs text-gray-600">
                <i class="pi pi-info-circle text-gray-400"></i>
                {{ t("Pay One Night Only") }}
              </div>
            </div>
          </div>

          <!-- Price & Reserve Button -->
          <div class="col-span-2 flex flex-col items-end justify-between">
            <div v-if="originalPrice" class="text-right">
              <p class="text-xs text-gray-400 line-through">
                {{ formatPrice(originalPrice) }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">
                {{ formatPrice(room.pricePerNight) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ t("Taxes And Fees Included") }}
              </p>
            </div>

            <div
              v-if="room.isAvailable"
              class="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
            >
              {{ t("Available") }}
            </div>
            <div
              v-else
              class="bg-red-50 text-red-700 px-2 py-1 rounded text-xs"
            >
              {{ t("Sold Out") }}
            </div>

            <Button
              :label="t('Reserve Now')"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 mt-2"
              :disabled="!room.isAvailable"
              @click="handleReserve"
            />
          </div>
        </template>

        <template v-else>
          <div class="col-span-5 flex items-center justify-end">
            <Button
              :label="t('Show prices')"
              icon="pi pi-tag"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2"
              @click="emit('showPrices')"
            />
          </div>
        </template>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card, Button } from "primevue";
import type { Room } from "~/stores/interface/response/roomList";
import { useSearchStore } from "~/stores/searchStore";
import dayjs from "dayjs";

const { t } = useI18n();
const searchStore = useSearchStore();

const freeCancellationDateVi = computed(() => {
  if (!searchStore.checkIn) return null;
  return dayjs(searchStore.checkIn)
    .subtract(3, "day")
    .locale("vi")
    .format("D MMMM, YYYY");
});

interface Props {
  room: Room;
  originalPrice?: number;
  hasSearchData: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  reserve: [roomId: number];
  showPrices: [];
}>();

const showAllFacilities = ref(false);

const displayedFacilities = computed(() =>
  showAllFacilities.value
    ? props.room.facilities
    : props.room.facilities.slice(0, 10),
);

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

const handleReserve = () => {
  emit("reserve", props.room.roomId);
};
</script>
