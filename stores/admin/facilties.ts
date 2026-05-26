import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  CreateFacilityPayload,
  FacilityDto,
  UpdateFacilityPayload,
} from "./interfaces/facility";
import type { ApiResponse } from "./interfaces/cities";

export const useFacilitiesStore = defineStore("facilities", () => {
  const apiStore = useApiStore();

  async function getAllFacilities() {
    return apiStore.apiRequest<ApiResponse<FacilityDto[]>>({
      method: "GET",
      endpoint: "/api/admin/facilities/all",
      auth: true,
    });
  }

  async function getFacilityById(id: number) {
    return apiStore.apiRequest<ApiResponse<FacilityDto>>({
      method: "GET",
      endpoint: `/api/admin/facilities/${id}`,
      auth: true,
    });
  }

  async function createFacility(payload: CreateFacilityPayload) {
    return apiStore.apiRequest<ApiResponse<FacilityDto>>({
      method: "POST",
      endpoint: "/api/admin/facilities",
      data: payload,
      auth: true,
    });
  }

  async function updateFacility(id: number, payload: UpdateFacilityPayload) {
    return apiStore.apiRequest<ApiResponse<FacilityDto>>({
      method: "PUT",
      endpoint: `/api/admin/facilities/${id}`,
      data: payload,
      auth: true,
    });
  }

  async function deleteFacility(id: number) {
    return apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/facilities/${id}`,
      auth: true,
    });
  }

  return {
    getAllFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
  };
});

export default null;
