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
            <p class="font-semibold text-gray-700 mb-2">Tiện nghi phòng:</p>

            <!-- Display first 10 facilities -->
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

            <!-- Show more button if there are more facilities -->
            <button
              v-if="room.facilities.length > 10"
              class="text-blue-600 text-xs hover:underline mt-2"
              @click.stop="showAllFacilities = !showAllFacilities"
            >
              {{
                showAllFacilities
                  ? "Thu gọn"
                  : `+${room.facilities.length - 10} tiện nghi khác`
              }}
            </button>
          </div>
        </div>

        <!-- Price & Booking Options -->
        <div class="col-span-3 border-l pl-4">
          <div class="space-y-2">
            <!-- Free Cancellation Badge -->
            <div
              v-if="room.facilities.includes('Free Cancellation')"
              class="flex items-center gap-1 text-green-600 text-xs"
            >
              <i class="pi pi-check-circle"></i>
              <span>Hủy miễn phí trước {{ freeCancellationDateVi }}</span>
            </div>

            <!-- Breakfast Included -->
            <div
              v-if="room.facilities.includes('Breakfast Included')"
              class="flex items-center gap-1 text-green-600 text-xs"
            >
              <i class="pi pi-check-circle"></i>
              <span>Không cần thanh toán trước - thanh toán tại chỗ nghỉ</span>
            </div>

            <!-- Refund Policy -->
            <div class="flex items-center gap-1 text-green-600 text-xs">
              <i class="pi pi-check-circle"></i>
              <span
                >Miễn phí hủy trước ngày nhận phòng sẽ được hoàn tiền đầy
                đủ</span
              >
            </div>

            <!-- No Prepayment -->
            <div class="text-xs text-gray-600">
              <i class="pi pi-info-circle text-gray-400"></i>
              Chỉ cần thanh toán 1 đêm
            </div>
          </div>
        </div>

        <!-- Price & Select Button -->
        <div class="col-span-2 flex flex-col items-end justify-between">
          <!-- Strikethrough Price -->
          <div v-if="originalPrice" class="text-right">
            <p class="text-xs text-gray-400 line-through">
              {{ formatPrice(originalPrice) }}
            </p>
          </div>

          <!-- Current Price -->
          <div class="text-right">
            <p class="text-2xl font-bold text-green-600">
              {{ formatPrice(room.pricePerNight) }}
            </p>
            <p class="text-xs text-gray-500">Đã bao gồm thuế và phí</p>
          </div>

          <!-- Availability Badge -->
          <div
            v-if="room.isAvailable"
            class="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
          >
            Còn phòng
          </div>
          <div v-else class="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
            Hết phòng
          </div>

          <!-- Select Rooms Dropdown & Button -->
          <div class="flex items-center gap-2 mt-2">
            <Select
              v-model="selectedRoomCount"
              :options="roomCountOptions"
              placeholder="0"
              class="w-16"
              :disabled="!room.isAvailable"
            />
            <Button
              label="Tôi sẽ đặt"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
              :disabled="!room.isAvailable || selectedRoomCount === 0"
              @click="handleReserve"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card, Button, Select } from "primevue";
import type { Room } from "~/stores/interface/response/roomList";
import { useSearchStore } from "~/stores/searchStore";
import dayjs from "dayjs";

const searchStore = useSearchStore();

const freeCancellationDate = computed(() => {
  if (!searchStore.checkIn) return null;

  return dayjs(searchStore.checkIn).subtract(3, "day").format("D MMMM, YYYY"); // "5 tháng 1, 2026"
});

const freeCancellationDateVi = computed(() => {
  if (!searchStore.checkIn) return null;

  return dayjs(searchStore.checkIn)
    .subtract(3, "day")
    .locale("vi")
    .format("D MMMM, YYYY");
});

const canCancelFree = computed(() => {
  if (!searchStore.checkIn) return false;

  const deadline = dayjs(searchStore.checkIn).subtract(3, "day");
  return dayjs().isBefore(deadline);
});

interface Props {
  room: Room;
  originalPrice?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  reserve: [roomId: number, count: number];
}>();

const showAllFacilities = ref(false);
const selectedRoomCount = ref(0);

const roomCountOptions = [0, 1, 2, 3, 4, 5];

const displayedFacilities = computed(() => {
  if (showAllFacilities.value) {
    return props.room.facilities;
  }
  return props.room.facilities.slice(0, 10);
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const handleReserve = () => {
  if (selectedRoomCount.value > 0) {
    emit("reserve", props.room.roomId, selectedRoomCount.value);
  }
};
</script>
