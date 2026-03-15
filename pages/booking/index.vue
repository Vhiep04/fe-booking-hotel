<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Progress Bar -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-center gap-0">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
          >
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all',
                  currentStep > step.id
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : currentStep === step.id
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-gray-300 text-gray-400',
                ]"
              >
                <i v-if="currentStep > step.id" class="pi pi-check text-xs" />
                <span v-else>{{ step.id }}</span>
              </div>
              <span
                :class="[
                  'text-sm font-medium hidden sm:block',
                  currentStep >= step.id ? 'text-gray-800' : 'text-gray-400',
                ]"
                >{{ step.label }}</span
              >
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'h-px w-16 md:w-32 lg:w-48 mx-3',
                currentStep > step.id ? 'bg-blue-700' : 'bg-gray-300',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="roomStore.isLoading"
      class="flex justify-center items-center py-32"
    >
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
    </div>

    <!-- Error -->
    <div
      v-else-if="roomStore.error"
      class="flex flex-col justify-center items-center py-32"
    >
      <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <p class="text-xl text-gray-700">{{ roomStore.error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <CheckoutLeftPanel
          :hotel="hotel"
          :booking="booking"
          :price="price"
          :cancellation-policy="cancellationPolicy"
        />
        <CheckoutCenterPanel
          v-model:guest-details="guestDetails"
          v-model:special-request="specialRequest"
          v-model:arrival-time="arrivalTime"
          :booking="booking"
          :is-paying="paymentStore.isLoading"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import CheckoutLeftPanel from "~/components/Booking/CheckoutLeftPanel.vue";
import CheckoutCenterPanel from "~/components/Booking/CheckoutCenterPanel.vue";
import { useGetRoomStore } from "~/stores/getRoom";
import { usePaymentStore } from "~/stores/payments";

const route = useRoute();
const roomStore = useGetRoomStore();
const paymentStore = usePaymentStore();
const currentStep = ref(2);

const steps = [
  { id: 1, label: "Your Selection" },
  { id: 2, label: "Your Details" },
  { id: 3, label: "Finish booking" },
];

const hotelId = computed(() => Number(route.query.hotelId));
const roomId = computed(() => Number(route.query.roomId));
const roomCount = computed(() => Number(route.query.rooms) || 1);

const hotel = computed(() => {
  const r = roomStore.room;
  return {
    name: `Hotel #${r?.hotelId ?? hotelId.value}`,
    address: "",
    rating: 0,
    reviewCount: 0,
    reviewLabel: "",
    locationScore: 0,
    stars: 0,
    amenities:
      r?.facilities?.filter((f) =>
        ["WiFi", "Free Wifi", "Airport shuttle"].includes(f),
      ) ?? [],
    image: r?.imgUrl ?? "https://via.placeholder.com/400x200",
  };
});

const booking = computed(() => {
  const r = roomStore.room;
  return {
    checkIn: { date: "Sat, Mar 7, 2026", time: "2:00 PM – 12:00 AM" },
    checkOut: { date: "Sun, Mar 8, 2026", time: "12:00 AM – 12:00 PM" },
    daysAway: 5,
    nights: 1,
    rooms: roomCount.value,
    adults: r?.capacity ?? 2,
    room: {
      name: r?.roomType ?? "",
      guests: r?.capacity ?? 2,
      noSmoking: false,
      freeCancellationBefore: "March 5, 2026",
    },
  };
});

const VAT_RATE = 0.08;
const DISCOUNT_RATE = 0.4;

const price = computed(() => {
  const r = roomStore.room;
  const original = r ? Math.round(r.pricePerNight / (1 - DISCOUNT_RATE)) : 0;
  const discount = original - (r?.pricePerNight ?? 0);
  const total = r?.pricePerNight ?? 0;
  const taxes = Math.round(total * VAT_RATE);
  return {
    original,
    discount,
    discountLabel: "Early 2026 Deal",
    total,
    taxes,
    vatPercent: VAT_RATE * 100,
    currency: "VND",
  };
});

const cancellationPolicy = computed(() => ({
  freeBeforeDate: "Mar 5",
  penaltyAfter: price.value.total,
  currency: "VND",
}));

const guestDetails = ref({
  firstName: "",
  lastName: "",
  email: "",
  country: "Vietnam",
  phone: "",
});

const specialRequest = ref("");
const arrivalTime = ref("");

// ---- Payment handler ----
async function handleSubmit() {
  await paymentStore.createPayment({
    orderType: "other",
    amount: roomStore.room?.pricePerNight ?? 0,
    orderDescription: roomStore.room?.roomType ?? "Room booking",
    name: `${guestDetails.value.firstName} ${guestDetails.value.lastName}`,
  });
}

onMounted(async () => {
  if (hotelId.value && roomId.value) {
    await roomStore.fetchRoom(hotelId.value, roomId.value);
  }
});

onBeforeUnmount(() => {
  roomStore.clearRoom();
  paymentStore.clearPayment();
});
</script>
