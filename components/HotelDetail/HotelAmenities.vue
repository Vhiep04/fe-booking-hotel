<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-xl font-bold mb-6">Amenities</h2>

    <div
      v-if="!facilities || facilities.length === 0"
      class="text-gray-400 text-sm"
    >
      <i class="pi pi-spin pi-spinner mr-2"></i>
      Loading facilities...
    </div>

    <div v-else class="grid sm:grid-cols-2 gap-4">
      <div
        v-for="facility in facilities"
        :key="facility.facilityId"
        class="flex items-center gap-3 text-gray-700"
      >
        <i
          :class="getFacilityIcon(facility.name)"
          class="text-lg text-blue-500"
        ></i>
        <span>{{ facility.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HotelData } from "~/stores/interface/response/cityList";

interface Props {
  facilities: HotelData["popularFacilities"] | undefined | null;
}

defineProps<Props>();

const getFacilityIcon = (facilityName: string): string => {
  const iconMap: Record<string, string> = {
    WiFi: "pi pi-wifi",
    "Own Bathroom": "pi pi-home",
    Kitchen: "pi pi-building",
    "Sea View": "pi pi-eye",
    "Baby Bed": "pi pi-heart",
    Bathtub: "pi pi-home",
    "Air Conditioning": "pi pi-sun",
    Balcony: "pi pi-building",
    "Mini Bar": "pi pi-ticket",
    "Safe Box": "pi pi-lock",
    TV: "pi pi-tablet",
    "Coffee Maker": "pi pi-ticket",
    "Breakfast Included": "pi pi-calendar",
    "Free Cancellation": "pi pi-check",
    Pool: "pi pi-heart",
    "All-Inclusive": "pi pi-star",
    "Pet Friendly": "pi pi-heart",
    Gym: "pi pi-heart",
    Spa: "pi pi-heart",
    Restaurant: "pi pi-building",
  };
  return iconMap[facilityName] || "pi pi-check-circle";
};
</script>
