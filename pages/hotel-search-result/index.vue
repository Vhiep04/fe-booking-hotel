<template>
  <div class="h-full mt-6 ml-36 mr-36 space-y-8">
    <div class="text">
      <p class="text-[#07689F] font-bold text-2xl mb-2">
        {{ t("Where is your Next Dream Place?") }}
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
        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-20 px-6 text-center"
        >
          <!-- Illustration -->
          <div class="relative mb-6">
            <div
              class="w-24 h-24 bg-[#e8f4fb] rounded-full flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-[#07689F]"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 21 12 3l9.75 18H2.25z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v4m0 4h.01"
                />
              </svg>
            </div>
            <!-- Decorative dots -->
            <span
              class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-80"
            />
            <span
              class="absolute -bottom-1 -left-2 w-2 h-2 bg-[#07689F] rounded-full opacity-40"
            />
          </div>

          <h3 class="text-xl font-bold text-gray-800 mb-2">
            {{ t("No hotels found") }}
          </h3>
          <p class="text-gray-500 text-sm max-w-xs leading-relaxed">
            {{
              t(
                "We couldn't find any hotels matching your search. Try adjusting your dates, location, or filters.",
              )
            }}
          </p>

          <!-- Suggestions -->
          <div class="mt-6 flex flex-wrap gap-2 justify-center">
            <span
              v-for="tip in [
                t('Try different dates'),
                t('Broaden location'),
                t('Remove filters'),
              ]"
              :key="tip"
              class="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200"
            >
              {{ tip }}
            </span>
          </div>
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
