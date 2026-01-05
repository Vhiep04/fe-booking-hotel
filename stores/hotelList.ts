import { defineStore } from "pinia";
import { useApiStore } from "./api";
import type { HotelListRequest } from "./interface/request/hotelList";
import type { HotelsResponse } from "./interface/response/hotelList";
import type { Room, RoomListResponse } from "./interface/response/roomList";

export const useHotelStore = defineStore("hotelListStore", () => {
  const apiStore = useApiStore();

  const isLoading = ref(false);
  const isLoadingRooms = ref(false);
  const namespace = "/Hotels";

  const hotel = ref();
  const currentHotelRooms = ref<Room[]>([]);
  const roomListData = ref<RoomListResponse["data"] | null>(null);

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

  async function getHotelRooms(hotelId: number) {
    try {
      isLoadingRooms.value = true;

      const res = await apiStore.apiRequest<RoomListResponse>({
        method: "GET",
        endpoint: `${namespace}/${hotelId}/rooms`,
        proxy: false,
        auth: false,
      });

      if (res.success) {
        roomListData.value = res.data;
        currentHotelRooms.value = res.data.rooms;
      }

      return res;
    } catch (e) {
      console.error("Get Hotel Rooms Error:", e);
      throw e;
    } finally {
      isLoadingRooms.value = false;
    }
  }

  function clearRoomData() {
    currentHotelRooms.value = [];
    roomListData.value = null;
  }

  return {
    hotel,
    pagination,
    searchStage,
    currentHotelRooms,
    roomListData,
    isLoading,
    isLoadingRooms,

    getHotelList,
    getHotelRooms,
    clearRoomData,
  };
});
