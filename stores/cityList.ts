import { defineStore } from "pinia";
import { ref } from "vue";
import { debounce } from "lodash-es";
import { useApiStore } from "./api";
import type { CityListRequest } from "./interface/request/cityList";
import type {
  CitiesResponse,
  CityData,
  HotelData,
} from "./interface/response/cityList";

export const useCityStore = defineStore("cityListStore", () => {
  const apiStore = useApiStore();

  const isLoading = ref(false);
  const namespace = "/Cities";

  // Response data
  const cityRes = ref<CitiesResponse | null>(null);
  const cities = ref<CityData | null>(null);
  const hotels = ref<HotelData[] | null>(null);

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
      cities.value = res.data;
      hotels.value = res.data.hotels;

      return res;
    } catch (e) {
      console.error("Fetch Hotels Error:", e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  const debouncedFetchHotels = debounce(fetchHotels, 500);

  return {
    cityRes,
    cities,
    hotels,
    filters,
    isLoading,

    updateFilters,
    resetFilters,
    fetchHotels,
    debouncedFetchHotels,
  };
});

export default null;
