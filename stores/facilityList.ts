import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "./api";
import type {
  FacilityData,
  FacilityResponse,
} from "./interface/response/facilities";

export const useFacilityStore = defineStore("facilityListStore", () => {
  const apiStore = useApiStore();

  const namespace = "Facilities";

  const facilities = ref<FacilityData[]>([]);

  async function getFacilities() {
    try {
      const res = await apiStore.apiRequest<FacilityResponse>({
        method: "GET",
        endpoint: `/api/${namespace}`,
        auth: false,
      });

      if (res.success) {
        facilities.value = res.data;
      }
    } catch (e) {
      console.error("Get Facilities: ", e);
    }
  }

  return {
    facilities,
    getFacilities,
  };
});
