<template>
  <section class="py-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      {{ t("Why choose us?") }}
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="item in items"
        :key="item.titleKey"
        class="bg-gray-50 rounded-xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow duration-200"
      >
        <div class="w-16 h-16 flex items-center justify-center">
          <img
            :src="item.img"
            :alt="t(item.titleKey)"
            class="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3 class="font-bold text-gray-900 text-base leading-snug mb-2">
            {{ t(item.titleKey) }}
          </h3>
          <p class="text-gray-500 text-base leading-relaxed">
            {{ t(item.descKey) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const items = [
  {
    img: "/FreeCancellation.png",
    titleKey: "Book now, pay at the property",
    descKey: "Free cancellation on most rooms",
  },
  {
    img: "/Reviews.png",
    titleKey: "Over 300 million reviews from guests",
    descKey: "Read trusted information from travelers like you",
  },
  {
    img: "/TripsGlobe.png",
    titleKey: "Over 2 million accommodations worldwide",
    descKey: "Hotels, guest houses, apartments and many more...",
  },
  {
    img: "/CustomerSupport.png",
    titleKey: "Reliable customer service, available 24/7",
    descKey: "We are always ready to help you",
  },
];
</script>
