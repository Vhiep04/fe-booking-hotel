<template>
  <section class="max-w-6xl mx-auto px-4 md:px-8 py-12">
    <div class="text-center mb-10">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        {{ t("Book in just 4 steps") }}
      </h2>
      <p class="text-gray-500 text-base">
        {{ t("No complicated process — find and book your stay in minutes") }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      <div
        class="hidden lg:block absolute top-8 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px bg-linear-to-r from-[#07689F]/20 via-[#07689F]/40 to-[#07689F]/20 z-0"
      />

      <div
        v-for="(step, index) in steps"
        :key="index"
        class="relative z-10 flex flex-col items-center text-center group"
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
          :class="step.bgClass"
        >
          <i :class="[step.icon, 'text-3xl', step.iconClass]" />
        </div>

        <div
          class="absolute top-0 left-1/2 translate-x-1/2 -translate-y-1 w-5 h-5 rounded-full bg-[#07689F] text-white text-xs font-bold flex items-center justify-center"
        >
          {{ index + 1 }}
        </div>

        <h3 class="font-bold text-gray-900 mb-2 text-base">
          {{ t(step.titleKey) }}
        </h3>
        <p class="text-gray-500 text-sm leading-relaxed max-w-40">
          {{ t(step.descKey) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const steps = [
  {
    icon: "pi pi-search",
    iconClass: "text-[#07689F]",
    bgClass: "bg-[#E8F4FB]",
    titleKey: "Search destination",
    descKey: "Enter city, check-in & check-out dates to get started",
  },
  {
    icon: "pi pi-building",
    iconClass: "text-amber-500",
    bgClass: "bg-amber-50",
    titleKey: "Choose a hotel",
    descKey: "Browse results, filter by price, rating, and amenities",
  },
  {
    icon: "pi pi-home",
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    titleKey: "Pick your room",
    descKey: "Compare room types and see real-time availability",
  },
  {
    icon: "pi pi-check-circle",
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
    titleKey: "Confirm & pay",
    descKey: "Pay online now or at the property — your choice!",
  },
];
</script>
