import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  ApiResponse,
  CityDto,
  CreateCityPayload,
  GetCitiesParams,
  PaginatedCities,
  UpdateCityPayload,
} from "./interfaces/cities";

export const useCitiesStore = defineStore("cities", () => {
  const apiStore = useApiStore();

  async function getCities(
    params: GetCitiesParams = {},
  ): Promise<ApiResponse<PaginatedCities>> {
    const { page = 1, pageSize = 10, search, country } = params;

    const queryParams: Record<string, string | number> = { page, pageSize };
    if (search) queryParams.search = search;
    if (country) queryParams.country = country;

    const response = await apiStore.apiRequest<ApiResponse<PaginatedCities>>({
      method: "GET",
      endpoint: "/api/admin/cities",
      params: queryParams,
      auth: true,
    });

    return response;
  }

  async function createCity(
    payload: CreateCityPayload,
  ): Promise<ApiResponse<CityDto>> {
    const response = await apiStore.apiRequest<ApiResponse<CityDto>>({
      method: "POST",
      endpoint: "/api/admin/cities",
      data: payload,
      auth: true,
    });

    return response;
  }

  async function getCityById(id: number): Promise<ApiResponse<CityDto>> {
    const response = await apiStore.apiRequest<ApiResponse<CityDto>>({
      method: "GET",
      endpoint: `/api/admin/cities/${id}`,
      auth: true,
    });

    return response;
  }

  async function updateCity(
    id: number,
    payload: UpdateCityPayload,
  ): Promise<ApiResponse<CityDto>> {
    const response = await apiStore.apiRequest<ApiResponse<CityDto>>({
      method: "PUT",
      endpoint: `/api/admin/cities/${id}`,
      data: payload,
      auth: true,
    });

    return response;
  }

  async function deleteCity(id: number): Promise<ApiResponse<boolean>> {
    const response = await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/cities/${id}`,
      auth: true,
    });

    return response;
  }

  return {
    getCities,
    createCity,
    getCityById,
    updateCity,
    deleteCity,
  };
});

export default null;
