import { useApiStore } from "./api";
import type { FacilityResponse } from "./interface/response/facilities";

export const useFacilityStore = defineStore("facilityListStore", () => {
  const apiStore = useApiStore();

  const namespace = "/Facilities";

  const facilities = ref();

  async function getFacility() {
    try {
      const res = await apiStore.apiRequest<FacilityResponse>({
        method: "GET",
        endpoint: `${namespace}`,
        auth: false,
      });

      if (res.success) {
        facilities.value = res.data;
      }
    } catch (e) {
      console.log("Get Facilities: ", e);
    }
  }

  return {
    facilities,
    getFacility,
  };
});
