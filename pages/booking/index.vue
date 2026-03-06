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
              >
                {{ step.label }}
              </span>
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

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CheckoutLeftPanel from "~/components/Booking/CheckoutLeftPanel.vue";
import CheckoutCenterPanel from "~/components/Booking/CheckoutCenterPanel.vue";

const currentStep = ref(2);

const steps = [
  { id: 1, label: "Your Selection" },
  { id: 2, label: "Your Details" },
  { id: 3, label: "Finish booking" },
];

const hotel = ref({
  name: "SAM Hotel and Apartment Danang - 150m to the beach & 200m to An Thuong area",
  address: "Lô 49 Trần Bạch Đằng, 550000 Danang, Vietnam",
  rating: 7.7,
  reviewCount: 41,
  reviewLabel: "Good",
  locationScore: 8.9,
  stars: 3,
  amenities: ["Free Wifi", "Airport shuttle"],
  image: "https://via.placeholder.com/400x200?text=SAM+Hotel",
});

const booking = ref({
  checkIn: { date: "Sat, Mar 7, 2026", time: "2:00 PM – 12:00 AM" },
  checkOut: { date: "Sun, Mar 8, 2026", time: "12:00 AM – 12:00 PM" },
  daysAway: 5,
  nights: 1,
  rooms: 1,
  adults: 2,
  room: {
    name: "King Suite with Balcony",
    guests: 2,
    noSmoking: true,
    freeCancellationBefore: "March 5, 2026",
  },
});

const price = ref({
  original: 1100000,
  discount: 440000,
  discountLabel: "Early 2026 Deal",
  total: 660000,
  taxes: 48889,
  vatPercent: 8,
  currency: "VND",
});

const cancellationPolicy = ref({
  freeBeforeDate: "Mar 5",
  penaltyAfter: 660000,
  currency: "VND",
});

const guestDetails = ref({
  firstName: "Ngo",
  lastName: "Hiep",
  email: "hiep.ngo@sotatek.com",
  country: "Vietnam",
  phone: "",
});

const specialRequest = ref("");
const arrivalTime = ref("");
</script>
