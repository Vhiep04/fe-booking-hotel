import { defineStore } from "pinia";
import { ref } from "vue";
import { debounce } from "lodash-es";
import { useApiStore } from "./api";
import type { CityListRequest } from "./interface/request/cityList";
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

    // Response data
    const cityCurrent = ref<CityResponse>();
    const cityRes = ref<CitiesResponse | null>(null);
    const cities = ref<CityData | null>(null);
    const hotels = ref<HotelData[] | null>(null);
    const hotelTotal = ref<number>();

    const filters = ref<CityListRequest>({
      keyword: "",
      cityName: "",
      minPrice: undefined,
      maxPrice: undefined,
      checkIn: undefined,
      checkOut: undefined,
      bedType: "",
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
        bedType: "",
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

    const debouncedFetchHotels = debounce(fetchHotels, 500);

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

    return {
      hotelTotal,
      cityCurrent,
      cityRes,
      cities,
      hotels,
      filters,
      isLoading,

      getCity,
      updateFilters,
      resetFilters,
      fetchHotels,
      debouncedFetchHotels,
    };
  },
  {
    // config persist localStorage
    persist: {
      key: "cityListStore",
      storage: process.client ? localStorage : undefined,
      pick: ["cityCurrent", "filters", "hotels", "cities", "hotelTotal"],
    },
  }
);
