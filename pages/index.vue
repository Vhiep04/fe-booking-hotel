<template>
  <div class="w-full h-full">
    <!-- Banner Carousel with Search Form Overlay -->
    <div class="w-full relative">
      <Carousel
        :value="banners"
        :numVisible="1"
        :numScroll="1"
        :circular="true"
        :autoplayInterval="5000"
        :showNavigators="false"
      >
        <template #item="slotProps">
          <div class="w-full">
            <img
              :src="slotProps.data"
              alt="banner"
              class="w-full h-[500px] object-cover"
            />
          </div>
        </template>
      </Carousel>

      <!-- Search Form Overlay - Đặt NGOÀI Carousel -->
      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 z-10"
      >
        <p class="text-white text-7xl font-bold mb-10">
          Discover Your Trips <br />
          Worldwide !
        </p>
        <SearchForm />
      </div>
    </div>
    <div class="flex flex-col items-start ml-36 mt-6">
      <p class="text-2xl font-bold mb-2">
        Explore Stays In Trending Destinations
      </p>
      <p class="font-medium mb-4">Find Hot Stays!</p>
      <HotelCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchForm from "@/components/SearchForm.vue";
import Carousel from "primevue/carousel";
import { ref } from "vue";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.png";
import banner4 from "../assets/images/banner4.png";
import banner5 from "../assets/images/banner5.png";
import banner6 from "../assets/images/banner6.png";
import HotelCard from "~/components/HotelCard.vue";

definePageMeta({
  ssr: false,
});

const banners = ref([banner1, banner2, banner3, banner4, banner5, banner6]);
</script>

<style>
@reference "tailwindcss";
:deep(.p-carousel-indicator button) {
  @apply bg-white/50 w-2 h-2 rounded-full;
}

:deep(.p-carousel-indicator.p-highlight button) {
  @apply bg-white w-8;
}

:deep(.p-carousel-indicators) {
  @apply pb-4;
}
</style>
