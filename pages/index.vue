<template>
  <div class="w-full h-full">
    <div class="w-full relative">
      <Carousel
        :value="banners"
        :numVisible="1"
        :numScroll="1"
        :circular="true"
        :autoplayInterval="5000"
        :showNavigators="false"
        :showIndicators="false"
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

      <div
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 z-10"
      >
        <p class="text-white text-7xl font-bold mb-10">
          Discover Your Trips <br />
          Worldwide !
        </p>
        <SearchForm :loading="cityStore.isLoading" @search="handleSearch" />
      </div>
    </div>
    <div class="ml-36 mr-36">
      <TrustStats />
    </div>
    <div class="flex flex-col items-start ml-36 mr-36 mt-6">
      <p class="text-2xl font-bold mb-2">
        {{ t("Explore Stays In Trending Destinations") }}
      </p>
      <p class="font-medium mb-4">{{ t("Find Hot Stays!") }}</p>
      <HotelGrid />
    </div>

    <div class="ml-36 mr-36">
      <HowItWorks />
    </div>

    <div class="ml-36 mr-36">
      <PaymentOptions />
    </div>

    <div v-if="!authStore.isAuthenticated" class="ml-36 mr-36">
      <PromoBanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchForm from "@/components/SearchForm.vue";
import Carousel from "primevue/carousel";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCityStore } from "@/stores/cityList";
import { useAuthStore } from "@/stores/auth";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.png";
import banner4 from "../assets/images/banner4.png";
import banner5 from "../assets/images/banner5.png";
import banner6 from "../assets/images/banner6.png";
import HotelGrid from "~/components/HotelGrid.vue";
import PaymentOptions from "~/components/PaymentOptions.vue";
import PromoBanner from "~/components/PromoBanner.vue";
import HowItWorks from "~/components/HowItWorks.vue";
import TrustStats from "~/components/TrustStats.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

definePageMeta({
  ssr: false,
});

useHead({
  title: t("Home"),
});

const router = useRouter();
const cityStore = useCityStore();
const authStore = useAuthStore();

const banners = ref([banner1, banner2, banner3, banner4, banner5, banner6]);

const handleSearch = async (params: {
  cityName: string;
  checkIn: string | null;
  checkOut: string | null;
  roomTypeName: string;
}) => {
  await cityStore.getCity({ name: params.cityName });

  cityStore.updateFilters({
    cityName: params.cityName,
    checkIn: params.checkIn || undefined,
    checkOut: params.checkOut || undefined,
    roomTypeName: params.roomTypeName || undefined,
  });

  await cityStore.fetchHotels();

  router.push({
    path: "/hotel-search-result",
    query: { city: params.cityName },
  });
};
</script>
