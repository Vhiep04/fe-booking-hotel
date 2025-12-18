<template>
  <div class="h-full mt-6 ml-36 mr-36 space-y-8">
    <div class="text">
      <p class="text-[#07689F] font-bold text-2xl mb-2">
        Where is your Next Dream Place?
      </p>
      <p class="text-[#07689F]">
        Find exclusive Genius rewards in every corner of the world!
      </p>
    </div>
    <SearchForm @get-city="getCity" />

    <CityInfoCard
      v-if="cityInfo"
      :city-info="cityInfo"
      :hotel-total="hotelTotal"
    />

    <div class="grid grid-cols-[25%_75%] items-start mt-6">
      <FilterSearchResult />
      <HotelCardDetail />
    </div>
  </div>
</template>

<script setup lang="ts">
import CityInfoCard from "@/components/CityInfoCard.vue";
import FilterSearchResult from "@/components/FilterSearchResult.vue";
import HotelCardDetail from "@/components/HotelCardDetail.vue";
import SearchForm from "@/components/SearchForm.vue";
import { useCityStore } from "#imports";
import { useRoute } from "vue-router";

const cityStore = useCityStore();
const route = useRoute();

// Dùng computed để tự động lấy data từ store
const cityInfo = computed(() => cityStore.cityCurrent);
const hotelTotal = computed(() => cityStore.hotelTotal);
console.log("hotelTotal", hotelTotal);

type GetCity = {
  name: string;
};

const getCity = async (name: GetCity) => {
  await cityStore.getCity(name);
};

onMounted(async () => {
  const cityName = route.query.city as string;

  if (cityName && !cityStore.cityCurrent) {
    await cityStore.getCity({ name: cityName });
  }
});
</script>
