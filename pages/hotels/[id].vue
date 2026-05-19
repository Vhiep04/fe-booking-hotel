<template>
  <div class="max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
    </div>

    <div v-else-if="hotel">
      <HotelDetailHeader
        v-if="hotel"
        :hotel="hotel"
        :is-map-open="showMap"
        @bookNow="scrollToRooms"
        @showMap="showMap = true"
      />

      <HotelDetailTabs
        :description="hotel.description"
        :facilities="hotel.facilities"
      />

      <div ref="searchFormSection" class="mb-6 space-y-2">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ t("Availability") }}
        </h2>
        <div class="text-red-500 flex items-center gap-2">
          <i class="pi pi-exclamation-circle"></i>
          <p>
            {{
              t("Select dates to see this property's availability and prices")
            }}
          </p>
        </div>
        <SearchForm
          :loading="isSearching"
          :hide-location="true"
          @search="handleSearch"
          @getCity="handleGetCity"
        />
      </div>

      <Dialog
        v-model:visible="showDatesDialog"
        :modal="true"
        :closable="false"
        :draggable="false"
        :style="{ width: '420px' }"
        pt:root:class="rounded-xl shadow-xl"
        pt:header:class="pb-0"
        pt:content:class="pt-3 pb-5 px-6"
        :header="t('Notice')"
        @hide="onDialogHide"
      >
        <p class="text-sm text-gray-700 leading-relaxed">
          {{
            t(
              "To see available rooms and prices please enter your check-in and check-out dates.",
            )
          }}
        </p>

        <template #footer>
          <div class="flex justify-end px-4 pb-4">
            <Button :label="t('OK')" text @click="showDatesDialog = false" />
          </div>
        </template>
      </Dialog>

      <div class="">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ t("Choose Your Room") }}
          </h2>
          <div
            v-if="roomListData && hasSearchData"
            class="text-sm text-gray-600"
          >
            <span class="font-semibold">{{ roomListData.availableRooms }}</span>
            {{ t("Availability") }}
          </div>
        </div>

        <div v-if="hotelStore.isLoadingRooms" class="flex justify-center py-12">
          <i class="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
        </div>

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
            :has-search-data="hasSearchData"
            @reserve="handleRoomReserve"
            @showPrices="scrollToSearchForm"
          />
        </div>

        <div v-else class="text-center py-12">
          <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">
            {{ t("No Rooms Available") }}
          </p>
        </div>
      </div>

      <HotelFeedbacks :hotel="hotel" />

      <HotelFeedbackForm
        v-if="hotel"
        :hotel-id="hotel.hotelId"
        :existing-feedback="myHotelFeedback"
        :can-leave-feedback="canLeaveFeedback"
        :reservation-id="completedReservation?.reservationId"
        @feedback-submitted="handleFeedbackChange"
        @feedback-deleted="handleFeedbackChange"
      />
    </div>

    <div v-else class="flex flex-col justify-center items-center min-h-screen">
      <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <p class="text-xl text-gray-700">
        {{ t("Hotel Not Found") }}
      </p>
    </div>
  </div>

  <HotelMapModal
    v-if="hotel"
    :open="showMap"
    :lat="lat"
    :lng="lng"
    :name="hotel.name"
    :hotel-image="hotel.imgUrl"
    :rating-score="hotel.averageRating"
    :total-reviews="hotel.totalReviews"
    :address="hotel.location"
    @close="showMap = false"
    @bookNow="scrollToRooms"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCityStore } from "~/stores/cityList";
import { useHotelStore } from "~/stores/hotelList";
import type { HotelData } from "~/stores/interface/response/cityList";
import HotelDetailTabs from "~/components/HotelDetail/HotelDetailTabs.vue";
import HotelRoomCard from "~/components/HotelDetail/HotelRoomCard.vue";
import HotelMapModal from "~/components/HotelDetail/HotelMapModal.vue";
import HotelFeedbacks from "~/components/HotelDetail/HotelFeedbacks.vue";
import HotelFeedbackForm from "~/components/HotelDetail/HotelFeedbackForm.vue";
import { useSearchStore } from "~/stores/searchStore";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const { t } = useI18n();
const hotel = ref<HotelData | null>(null);

const showDatesDialog = ref(false);
const currentHostname = computed(() =>
  typeof window !== "undefined" ? window.location.hostname : "",
);

useHead({
  title: computed(() => (hotel.value ? hotel.value.name : t("Loading..."))),
});

const showMap = ref(false);
const isSearching = ref(false);
const hasSearchData = ref(false);

const lat = computed(() => hotel.value?.latitude ?? 16.0544);
const lng = computed(() => hotel.value?.longitude ?? 108.2022);

const route = useRoute();
const router = useRouter();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const feedbackStore = useFeedbackStore();
const searchStore = useSearchStore();
const bookingStore = useReservationStore();
const favouriteStore = useFavouriteHotelStore();

const isLoading = ref(true);
const roomsSection = ref<HTMLElement | null>(null);
const searchFormSection = ref<HTMLElement | null>(null);

const myHotelFeedback = computed(
  () =>
    feedbackStore.myFeedbacks.find((f) => f.hotelId === hotel.value?.hotelId) ??
    null,
);

const handleFeedbackChange = async () => {
  const hotelId = parseInt(route.params.id as string);
  await Promise.all([
    hotelStore.getHotelById(hotelId),
    feedbackStore.fetchMyFeedbacks(),
  ]);
  hotel.value = hotelStore.currentHotel as HotelData;
};

const rooms = computed(() => hotelStore.currentHotelRooms);
const roomListData = computed(() => hotelStore.roomListData);

const canLeaveFeedback = computed(() => {
  if (!hotel.value) return false;
  return bookingStore.reservations.some(
    (r) =>
      r.hotelId === hotel.value!.hotelId && r.paymentStatus === "Completed",
  );
});

const completedReservation = computed(() =>
  bookingStore.reservations.find(
    (r) =>
      r.hotelId === hotel.value?.hotelId && r.paymentStatus === "Completed",
  ),
);

const scrollToRooms = () => {
  if (roomsSection.value) {
    roomsSection.value.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const targetScrollY = ref(0);

const scrollToSearchForm = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  if (searchFormSection.value) {
    const top =
      searchFormSection.value.getBoundingClientRect().top + window.scrollY - 80;
    targetScrollY.value = top;
    window.scrollTo({ top, behavior: "smooth" });
  }

  nextTick(() => {
    showDatesDialog.value = true;
  });
};

const onDialogHide = () => {
  setTimeout(() => {
    window.scrollTo({ top: targetScrollY.value, behavior: "instant" });
  }, 50);
};

const handleSearch = async (params: {
  cityName: string;
  checkIn: string;
  checkOut: string;
  roomTypeName: string;
}) => {
  isSearching.value = true;
  try {
    const hotelId = parseInt(route.params.id as string);
    hasSearchData.value = true;
    await hotelStore.getHotelRooms(
      hotelId,
      params.checkIn,
      params.checkOut,
      params.roomTypeName,
    );
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    isSearching.value = false;
  }
};

const handleGetCity = (params: { name: string }) => {
  cityStore.getCity(params);
};

const handleRoomReserve = (roomId: number) => {
  const hotelId = hotel.value?.hotelId;
  if (!hotelId) return;

  searchStore.setPendingBooking(hotelId, roomId);
  router.push({
    path: "/booking",
    query: { hotelId, roomId },
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getOriginalPrice = (currentPrice: number): number => {
  return Math.round(currentPrice / 0.88);
};

onMounted(async () => {
  try {
    const hotelId = parseInt(route.params.id as string);
    const searchStore = useSearchStore();

    if (searchStore.checkIn && searchStore.checkOut) {
      hasSearchData.value = true;
    }

    await hotelStore.getHotelById(hotelId);
    hotel.value = hotelStore.currentHotel as HotelData;

    if (hotel.value) {
      const checkIn = searchStore.checkInDateOnly ?? undefined;
      const checkOut = searchStore.checkOutDateOnly ?? undefined;
      await Promise.all([
        hotelStore.getHotelRooms(hotelId, checkIn, checkOut),
        // feedbackStore.fetchMyFeedbacks(),
        // bookingStore.fetchReservations(),
        // favouriteStore.fetchFavourites(),
      ]);
    }
  } catch (error) {
    console.error("Error loading hotel:", error);
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  hotelStore.clearRoomData();
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
