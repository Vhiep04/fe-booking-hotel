import { defineStore } from "pinia";
import { useApiStore } from "./api";
import type { HotelListRequest } from "./interface/request/hotelList";
import type { HotelsResponse } from "./interface/response/hotelList";

export const useHotelStore = defineStore("hotelListStore", () => {
  const apiStore = useApiStore();

  const isLoading = ref(false);
  const namespace = "/Hotels";

  const hotel = ref();

  const pagination = ref({
    currentPage: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const searchStage = ref<HotelListRequest>({
    keyword: "",
    sortBy: undefined,
    pageSize: 12,
    pageNumber: 1,
  });

  async function getHotelList(params: HotelListRequest) {
    try {
      isLoading.value = true;

      const res = await apiStore.apiRequest<HotelsResponse>({
        method: "GET",
        endpoint: `${namespace}`,
        proxy: false,
        auth: false,
        params,
      });

      hotel.value = res.data;
      pagination.value = res.pagination;
    } catch (e) {
      console.log("Get Hotels: ", e);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    hotel,
    pagination,
    searchStage,
    getHotelList,
  };
});

export default null;
