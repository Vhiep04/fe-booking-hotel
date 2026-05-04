import { defineStore } from "pinia";
import { ref } from "vue";
import { debounce } from "lodash-es";
import { useApiStore } from "./api";
import type {
  CityListRequest,
  RoomType,
  RoomTypesResponse,
} from "./interface/request/cityList";
import type {
  CitiesResponse,
  CityData,
  CityResponse,
  HotelData,
} from "./interface/response/cityList";

export const useCityStore = defineStore(
  "cityListStore",
  () => {
    const apiStore = useApiStore();
    const isLoading = ref(false);
    const namespace = "/Cities";

    const cityCurrent = ref<CityResponse>();
    const cityRes = ref<CitiesResponse | null>(null);
    const cities = ref<CityData | null>(null);
    const hotels = ref<HotelData[] | null>(null);
    const hotelTotal = ref<number>();
    const debouncedFetchHotels = debounce(fetchHotels, 500);
    const roomTypes = ref<RoomType[]>([]);
    const isLoadingRoomTypes = ref(false);

    const filters = ref<CityListRequest>({
      keyword: "",
      cityName: "",
      minPrice: undefined,
      maxPrice: undefined,
      checkIn: undefined,
      checkOut: undefined,
      roomTypeName: "",
      facilities: [],
      sortBy: undefined,
    });

    function updateFilters(newFilters: Partial<CityListRequest>) {
      filters.value = { ...filters.value, ...newFilters };
    }

    function resetFilters() {
      filters.value = {
        keyword: "",
        cityName: "",
        minPrice: undefined,
        maxPrice: undefined,
        checkIn: undefined,
        checkOut: undefined,
        roomTypeName: "",
        facilities: [],
        sortBy: undefined,
      };
    }

    async function fetchHotels() {
      try {
        isLoading.value = true;

        const res = await apiStore.apiRequest<CitiesResponse>({
          method: "GET",
          endpoint: `${namespace}/hotels`,
          auth: false,
          params: filters.value,
        });

        cityRes.value = res;
        hotels.value = res.data.hotels;
        hotelTotal.value = res.data.totalCount;

        return res;
      } catch (e) {
        console.error("Fetch Hotels Error:", e);
        throw e;
      } finally {
        isLoading.value = false;
      }
    }

    async function getCity(name: object) {
      try {
        const res = await apiStore.apiRequest<CityResponse>({
          method: "GET",
          endpoint: `${namespace}`,
          auth: false,
          params: name,
        });

        cityCurrent.value = res;

        return res;
      } catch (e) {
        console.error("Get City Error:", e);
        throw e;
      }
    }

    async function fetchRoomTypes() {
      try {
        isLoadingRoomTypes.value = true;
        const res = await apiStore.apiRequest<RoomTypesResponse>({
          method: "GET",
          endpoint: `${namespace}/room-types`,
          auth: false,
        });
        roomTypes.value = res.data;
        return res;
      } catch (e) {
        console.error("Fetch Room Types Error:", e);
        throw e;
      } finally {
        isLoadingRoomTypes.value = false;
      }
    }

    return {
      hotelTotal,
      cityCurrent,
      cityRes,
      cities,
      hotels,
      filters,
      roomTypes,
      isLoading,

      getCity,
      updateFilters,
      resetFilters,
      fetchHotels,
      fetchRoomTypes,
      debouncedFetchHotels,
    };
  },
  {
    // config persist sessionStorage
    persist: {
      key: "cityListStore",
      storage: process.client ? sessionStorage : undefined,
      pick: [
        "cityCurrent",
        "filters",
        "hotels",
        "roomTypes",
        "cities",
        "hotelTotal",
      ],
    },
  },
);
