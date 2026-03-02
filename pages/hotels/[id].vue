<template>
  <div class="max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
    </div>

    <!-- Hotel Details -->
    <div v-else-if="hotel">
      <!-- Image Gallery -->
      <HotelDetailHeader
        v-if="hotel"
        :hotel="hotel"
        :is-map-open="showMap"
        @bookNow="scrollToRooms"
        @showMap="showMap = true"
      />

      <!-- <HotelImageGallery :hotel="hotel" @image-click="handleImageClick" /> -->

      <!-- Tabs Section -->
      <HotelDetailTabs :description="hotel.description" />

      <!-- Amenities & Booking Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <!-- Amenities Section -->
        <HotelAmenities
          :facilities="hotel.popularFacilities"
          class="md:col-span-2"
        />

        <!-- Booking Card -->
        <HotelBookingCard
          :location="hotel.location"
          :min-price="hotel.minPricePerNight"
          :max-price="hotel.maxPricePerNight"
          :room-types="hotel.availableRoomTypes"
          @book-now="scrollToRooms"
        />
      </div>

      <!-- Rooms Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Chọn phòng của bạn</h2>
          <div v-if="roomListData" class="text-sm text-gray-600">
            <span class="font-semibold">{{ roomListData.availableRooms }}</span>
            phòng trống
            <span class="mx-2">|</span>
            <span
              >{{ formatPrice(roomListData.minPrice) }} -
              {{ formatPrice(roomListData.maxPrice) }}</span
            >
          </div>
        </div>

        <!-- Loading Rooms -->
        <div v-if="hotelStore.isLoadingRooms" class="flex justify-center py-12">
          <i class="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
        </div>

        <!-- Rooms List -->
        <div
          v-else-if="rooms && rooms.length > 0"
          class="space-y-4"
          ref="roomsSection"
        >
          <HotelRoomCard
            v-for="room in rooms"
            :key="room.roomId"
            :room="room"
            :original-price="getOriginalPrice(room.pricePerNight)"
            @reserve="handleRoomReserve"
          />
        </div>

        <!-- No Rooms Available -->
        <div v-else class="text-center py-12">
          <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">Không có phòng nào khả dụng</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex flex-col justify-center items-center min-h-screen">
      <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <p class="text-xl text-gray-700">Hotel not found</p>
    </div>
    <!-- <div v-if="hotel" class="flex items-center text-sm text-gray-600 mt-1">
      <i class="pi pi-map-marker mr-1 text-blue-600"></i>

      <span>{{ hotel.location }}</span>

      <button
        class="ml-2 text-blue-600 hover:underline"
        @click="showMap = true"
      >
        Vị trí xuất sắc - hiển thị bản đồ
      </button>
    </div> -->
  </div>
  <HotelMapModal
    v-if="hotel"
    :open="showMap"
    :lat="lat"
    :lng="lng"
    :name="hotel.name"
    :hotel-image="hotel.images?.find((i) => i.isPrimary)?.imageUrl"
    :total-reviews="hotel.totalReviews"
    :address="hotel.location"
    :location-score="9.0"
    @close="showMap = false"
    @bookNow="scrollToRooms"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCityStore } from "~/stores/cityList";
import { useHotelStore } from "~/stores/hotelList";
import type { HotelData } from "~/stores/interface/response/cityList";
import HotelImageGallery from "~/components/HotelDetail/HotelImageGallery.vue";
import HotelDetailTabs from "~/components/HotelDetail/HotelDetailTabs.vue";
import HotelAmenities from "~/components/HotelDetail/HotelAmenities.vue";
import HotelBookingCard from "~/components/HotelDetail/HotelBookingCard.vue";
import HotelRoomCard from "~/components/HotelDetail/HotelRoomCard.vue";
import HotelMapModal from "~/components/HotelDetail/HotelMapModal.vue";

// const props = defineProps<{ hotel: HotelData }>();

const showMap = ref(false);

const lat = computed(() => hotel.value?.latitude ?? 16.0544);
const lng = computed(() => hotel.value?.longitude ?? 108.2022);

const route = useRoute();
const router = useRouter();
const cityStore = useCityStore();
const hotelStore = useHotelStore();

const hotel = ref<HotelData | null>(null);
const isLoading = ref(true);
const roomsSection = ref<HTMLElement | null>(null);

// Computed properties
const rooms = computed(() => hotelStore.currentHotelRooms);
const roomListData = computed(() => hotelStore.roomListData);

// onMounted(async () => {
//   try {
//     const hotelId = parseInt(route.params.id as string);

//     // Check if hotel exists in store
//     if (cityStore.hotels && cityStore.hotels.length > 0) {
//       const foundHotel = cityStore.hotels.find((h) => h.hotelId === hotelId);
//       if (foundHotel) {
//         hotel.value = foundHotel;
//       }
//     }

//     // If not found in store, fetch from API
//     await cityStore.fetchHotels();
//     const foundHotel = cityStore.hotels?.find((h) => h.hotelId === hotelId);
//     if (foundHotel) {
//       hotel.value = foundHotel;
//     }

//     // Fetch rooms for this hotel
//     if (hotel.value) {
//       await hotelStore.getHotelRooms(hotelId);
//     }
//   } catch (error) {
//     console.error("Error loading hotel:", error);
//   } finally {
//     isLoading.value = false;
//   }
// });

// Clean up room data when leaving page
onBeforeUnmount(() => {
  hotelStore.clearRoomData();
});

const handleImageClick = (imageIndex: number) => {
  console.log("Image clicked:", imageIndex);
  // Implement image modal/lightbox here
};

const scrollToRooms = () => {
  if (roomsSection.value) {
    roomsSection.value.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleRoomReserve = (roomId: number, count: number) => {
  console.log("Reserve room:", roomId, "count:", count);
  // Implement booking logic here
  router.push({
    path: "/booking",
    query: {
      hotelId: hotel.value?.hotelId,
      roomId: roomId,
      rooms: count,
    },
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Calculate original price (12% discount)
const getOriginalPrice = (currentPrice: number): number => {
  return Math.round(currentPrice / 0.88);
};

onMounted(async () => {
  try {
    const hotelId = parseInt(route.params.id as string);

    let foundHotel = cityStore.hotels?.find((h) => h.hotelId === hotelId);

    if (!foundHotel) {
      await cityStore.fetchHotels();
      foundHotel = cityStore.hotels?.find((h) => h.hotelId === hotelId);
    }

    // Nếu vẫn không có thì gọi getHotelById
    if (!foundHotel) {
      await hotelStore.getHotelById(hotelId);
      hotel.value = hotelStore.currentHotel as HotelData;
    } else {
      hotel.value = foundHotel;
    }

    // Fetch rooms
    if (hotel.value) {
      await hotelStore.getHotelRooms(hotelId);
    }
  } catch (error) {
    console.error("Error loading hotel:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
:deep(.p-button) {
  font-weight: 600;
}

:deep(.p-button-outlined) {
  background: transparent;
}
</style>
