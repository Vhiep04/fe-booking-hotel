import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import type {
  AdminFacilityResponse,
  AdminFacilityRequest,
  AdminPagedResult,
  AdminApiResponse,
} from "@/types/admin";

export const useFacilityStore = defineStore("facility", () => {
  const apiStore = useApiStore();

  const getFacilities = (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params?.search) query.append("search", params.search);

    return apiStore.apiRequest<
      AdminApiResponse<AdminPagedResult<AdminFacilityResponse>>
    >({
      endpoint: `/api/admin/facilities?${query.toString()}`,
      method: "GET",
      auth: true,
    });
  };

  const getAllFacilities = () => {
    return apiStore.apiRequest<AdminApiResponse<AdminFacilityResponse[]>>({
      endpoint: "/api/admin/facilities/all",
      method: "GET",
      auth: true,
    });
  };

  const getFacilityById = (id: number) => {
    return apiStore.apiRequest<AdminApiResponse<AdminFacilityResponse>>({
      endpoint: `/api/admin/facilities/${id}`,
      method: "GET",
      auth: true,
    });
  };

  const createFacility = (data: AdminFacilityRequest) => {
    return apiStore.apiRequest<AdminApiResponse<AdminFacilityResponse>>({
      endpoint: "/api/admin/facilities",
      method: "POST",
      data: data,
      auth: true,
    });
  };

  const updateFacility = (id: number, data: AdminFacilityRequest) => {
    return apiStore.apiRequest<AdminApiResponse<AdminFacilityResponse>>({
      endpoint: `/api/admin/facilities/${id}`,
      method: "PUT",
      data: data,
      auth: true,
    });
  };

  const deleteFacility = (id: number) => {
    return apiStore.apiRequest<AdminApiResponse<void>>({
      endpoint: `/api/admin/facilities/${id}`,
      method: "DELETE",
      auth: true,
    });
  };

  return {
    getFacilities,
    getAllFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
  };
});
