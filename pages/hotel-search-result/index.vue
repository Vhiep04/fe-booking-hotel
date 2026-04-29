<template>
  <div class="h-full mt-6 ml-36 mr-36 space-y-8">
    <div class="text">
      <p class="text-[#07689F] font-bold text-2xl mb-2">
        {{ t("Where is your Next Dream Place?") }}
      </p>
      <p class="text-[#07689F]">
        {{ t("Find exclusive Genius rewards in every corner of the world!") }}
      </p>
    </div>

    <SearchForm
      :loading="cityStore.isLoading"
      @search="handleSearch"
      @get-city="getCity"
    />

    <CityInfoCard
      v-if="cityInfo"
      :city-info="cityInfo"
      :hotel-total="hotelTotal"
    />

    <div class="grid grid-cols-[25%_75%] items-start mt-6">
      <FacilityHotel @filter-change="handleFilterChange" />

      <div class="space-y-4">
        <!-- Loading State -->
        <template v-if="cityStore.isLoading">
          <HotelCardSkeleton v-for="i in 3" :key="i" />
        </template>

        <!-- Hotels List -->
        <template v-else-if="hotels && hotels.length > 0">
          <HotelCardDetail
            v-for="hotel in hotels"
            :key="hotel.hotelId"
            :hotel="hotel"
          />
        </template>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500 text-lg">{{ t("No hotels found") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CityInfoCard from "@/components/CityInfoCard.vue";
import SearchForm from "@/components/SearchForm.vue";
import { useCityStore } from "#imports";
import { useRoute } from "vue-router";
import HotelCardDetail from "~/components/HotelCardDetail.vue";
import HotelCardSkeleton from "~/components/shared/HotelCardSkeleton.vue";
import FacilityHotel from "~/components/FacilityHotel.vue";

const { t } = useI18n();

useHead({ title: t("Hotel Search Results") });

const cityStore = useCityStore();
const route = useRoute();

const cityInfo = computed(() => cityStore.cityCurrent);
const hotelTotal = computed(() => cityStore.hotelTotal);
const hotels = computed(() => cityStore.hotels);

type GetCity = { name: string };
type SearchParams = {
  cityName: string;
  checkIn: string | null;
  checkOut: string | null;
  roomTypeName: string;
};
type FilterParams = {
  minPrice?: number;
  maxPrice?: number;
  facilities: number[];
};

const handleSearch = async (params: SearchParams) => {
  cityStore.updateFilters({
    cityName: params.cityName.trim(),
    checkIn: params.checkIn || undefined,
    checkOut: params.checkOut || undefined,
    roomTypeName: params.roomTypeName,
  });
  await cityStore.fetchHotels();
};

const getCity = async (params: GetCity) => {
  await cityStore.getCity(params);
};

const handleFilterChange = async (filters: FilterParams) => {
  cityStore.updateFilters({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    facilities: filters.facilities,
  });
  await cityStore.debouncedFetchHotels();
};

onMounted(async () => {
  const cityName = route.query.city as string;
  if (cityName && !cityStore.cityCurrent) {
    await cityStore.getCity({ name: cityName.trim() });
  }
});
</script>
