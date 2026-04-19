<template>
  <div class="lg:w-96 shrink-0 space-y-4">
    <!-- Hotel Info Card -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <img
        :src="hotel.image"
        :alt="hotel.name"
        class="w-full h-40 object-cover"
      />
      <div class="p-4">
        <div class="flex gap-0.5 mb-1">
          <i
            v-for="n in hotel.stars"
            :key="n"
            class="pi pi-star-fill text-yellow-400 text-xs"
          />
        </div>
        <h3 class="font-bold text-gray-900 text-sm leading-snug mb-2">
          {{ hotel.name }}
        </h3>
        <p class="text-sm text-gray-500 mb-2">{{ hotel.address }}</p>
        <p class="text-sm text-green-600 font-medium mb-2">
          {{ t("Great Location") }} — {{ hotel.locationScore }}
        </p>
        <div class="flex items-center gap-2 mb-3">
          <span
            class="bg-blue-700 text-white text-sm font-bold px-1.5 py-0.5 rounded"
            >{{ hotel.rating }}</span
          >
          <span class="text-sm text-gray-600"
            >{{ hotel.reviewLabel }} · {{ hotel.reviewCount }}
            {{ t("reviews") }}</span
          >
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-gray-600">
          <span
            v-for="amenity in hotel.amenities"
            :key="amenity"
            class="flex items-center gap-1"
          >
            <i
              :class="
                amenity.toLowerCase().includes('wifi')
                  ? 'pi pi-wifi'
                  : 'pi pi-car'
              "
              class="text-gray-500 text-xs"
            />
            {{ amenity }}
          </span>
        </div>
      </div>

      <!-- Booking Details -->
      <div class="border-t border-gray-200 p-4">
        <h4 class="font-bold text-gray-900 mb-3">
          {{ t("Your booking details") }}
        </h4>
        <div class="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p class="text-xs text-gray-500 mb-0.5">{{ t("Check-in") }}</p>
            <p class="font-bold text-sm text-gray-900">
              {{ booking.checkIn.date }}
            </p>
            <p class="text-xs text-gray-500">{{ booking.checkIn.time }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-0.5">{{ t("Check-out") }}</p>
            <p class="font-bold text-sm text-gray-900">
              {{ booking.checkOut.date }}
            </p>
            <p class="text-xs text-gray-500">{{ booking.checkOut.time }}</p>
          </div>
        </div>
        <div
          class="flex items-center gap-1.5 text-orange-600 text-sm font-medium mb-3"
        >
          <i class="pi pi-clock" />
          {{ t("Just {n} days away!", { n: booking.daysAway }) }}
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">{{ t("You selected") }}</p>
          <p class="font-bold text-sm text-gray-900">
            {{
              t("{nights} night, {rooms} room for {adults} adults", {
                nights: booking.nights,
                rooms: booking.rooms,
                adults: booking.adults,
              })
            }}
          </p>
          <p class="text-sm text-gray-600 mt-1">1 x {{ booking.room.name }}</p>
          <a href="#" class="text-blue-600 text-sm mt-1 inline-block">
            {{ t("Change your selection") }}
          </a>
        </div>
      </div>
    </div>

    <!-- Price Summary Card -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <h4 class="font-bold text-gray-900 mb-4">
        {{ t("Your price summary") }}
      </h4>
      <div class="space-y-2 mb-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-700">{{ t("Original price") }}</span>
          <span class="text-gray-700">{{ fmt(price.original) }}</span>
        </div>
        <div class="flex justify-between text-sm gap-4">
          <div>
            <p class="text-gray-700">{{ price.discountLabel }}</p>
            <p class="text-xs text-gray-500">
              {{
                t(
                  "This property is offering a discount on stays between Jan 1 and Apr 1 2026.",
                )
              }}
            </p>
          </div>
          <span class="text-gray-700 shrink-0"
            >- {{ fmt(price.discount) }}</span
          >
        </div>
      </div>
      <div class="bg-blue-50 rounded-lg p-3">
        <div class="flex justify-between items-center">
          <span class="font-bold text-gray-900 text-lg">{{ t("Total") }}</span>
          <div class="text-right">
            <p class="text-gray-400 line-through text-sm">
              {{ fmt(price.original) }}
            </p>
            <p class="font-bold text-gray-900 text-xl">
              {{ fmt(price.total) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ t("Includes taxes and fees") }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-500">
        <div
          class="flex items-center gap-1 cursor-pointer"
          @click="showVat = !showVat"
        >
          <i class="pi pi-credit-card text-gray-400" />
          {{
            t("Includes {amount} in taxes and fees", {
              amount: fmt(price.taxes),
            })
          }}
        </div>
        <div v-if="showVat" class="mt-2 flex justify-between">
          <span>{{ price.vatPercent }}% VAT</span>
          <span>{{ fmt(price.taxes) }}</span>
        </div>
        <button
          v-if="showVat"
          class="text-blue-600 mt-1"
          @click="showVat = false"
        >
          {{ t("Hide details") }}
        </button>
      </div>
    </div>

    <!-- Cancellation Policy Card -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <h4 class="font-bold text-gray-900 mb-3">
        {{ t("How much will it cost to cancel?") }}
      </h4>
      <div class="space-y-2 text-sm">
        <div>
          <span class="text-green-600 font-medium">
            {{
              t("Free cancellation before {date}", {
                date: cancellationPolicy.freeBeforeDate,
              })
            }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">
            {{
              t("After 12:00 AM on {date}", {
                date: cancellationPolicy.freeBeforeDate,
              })
            }}
          </span>
          <span class="text-gray-900 font-medium">{{
            fmt(cancellationPolicy.penaltyAfter)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { t } = useI18n();

const props = defineProps<{
  hotel: {
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    reviewLabel: string;
    locationScore: number;
    stars: number;
    amenities: string[];
    image: string;
  };
  booking: {
    checkIn: { date: string; time: string };
    checkOut: { date: string; time: string };
    daysAway: number;
    nights: number;
    rooms: number;
    adults: number;
    room: { name: string };
  };
  price: {
    original: number;
    discount: number;
    discountLabel: string;
    total: number;
    taxes: number;
    vatPercent: number;
    currency: string;
  };
  cancellationPolicy: {
    freeBeforeDate: string;
    penaltyAfter: number;
    currency: string;
  };
}>();

const showVat = ref(false);

const fmt = (amount: number) =>
  `${props.price.currency} ${amount.toLocaleString("vi-VN")}`;
</script>
