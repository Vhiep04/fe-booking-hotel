<template>
  <div class="flex flex-col items-center w-full">
    <div
      ref="gridRef"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      <HotelCard
        v-for="item in hotel"
        :key="item.hotelId"
        :hotel-id="item.hotelId"
        :img-url="item.imgUrl"
        :city-name="item.cityName"
        :location="item.location"
        :description="item.description"
      />
    </div>

    <div class="mt-10 flex justify-center">
      <Paginator
        :rows="12"
        :total-records="pagination.totalCount"
        :first="(pagination.currentPage - 1) * pagination.pageSize"
        @page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Paginator from "primevue/paginator";

import HotelCard from "./HotelCard.vue";

const hotelStore = useHotelStore();
const favouriteStore = useFavouriteHotelStore();

const gridRef = ref<HTMLElement>();

const hotel = computed(() => hotelStore.hotel);
const pagination = computed(() => hotelStore.pagination);

const onPageChange = (e: any) => {
  const newPage = e.page + 1;
  hotelStore.searchStage.pageNumber = newPage;
  hotelStore.getHotelList(hotelStore.searchStage);

  gridRef.value?.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
};

onMounted(() => {
  hotelStore.getHotelList(hotelStore.searchStage);

  // Fetch favourites so isFavourited() works correctly in every HotelCard
  if (favouriteStore.favourites.length === 0) {
    favouriteStore.fetchFavourites();
  }
});
</script>
