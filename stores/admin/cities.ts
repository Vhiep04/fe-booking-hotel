import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  ApiResponse,
  CityDto,
  CityImageDto,
  CreateCityPayload,
  GetCitiesParams,
  PaginatedCities,
  UpdateCityPayload,
} from "./interfaces/cities";

export interface AddCityImagePayload {
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  description: string;
}

export const useCitiesStore = defineStore("cities", () => {
  const apiStore = useApiStore();

  async function getCities(
    params: GetCitiesParams = {},
  ): Promise<ApiResponse<PaginatedCities>> {
    const { page = 1, pageSize = 10, search, country } = params;

    const queryParams: Record<string, string | number> = { page, pageSize };
    if (search) queryParams.search = search;
    if (country) queryParams.country = country;

    return await apiStore.apiRequest<ApiResponse<PaginatedCities>>({
      method: "GET",
      endpoint: "/api/admin/cities",
      params: queryParams,
      auth: true,
    });
  }

  async function createCity(
    payload: CreateCityPayload,
  ): Promise<ApiResponse<CityDto>> {
    return await apiStore.apiRequest<ApiResponse<CityDto>>({
      method: "POST",
      endpoint: "/api/admin/cities",
      data: payload,
      auth: true,
    });
  }

  async function getCityById(id: number): Promise<ApiResponse<CityDto>> {
    return await apiStore.apiRequest<ApiResponse<CityDto>>({
      method: "GET",
      endpoint: `/api/admin/cities/${id}`,
      auth: true,
    });
  }

  async function updateCity(
    id: number,
    payload: UpdateCityPayload,
  ): Promise<ApiResponse<CityDto>> {
    return await apiStore.apiRequest<ApiResponse<CityDto>>({
      method: "PUT",
      endpoint: `/api/admin/cities/${id}`,
      data: payload,
      auth: true,
    });
  }

  async function deleteCity(id: number): Promise<ApiResponse<boolean>> {
    return await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/cities/${id}`,
      auth: true,
    });
  }

  async function getCountries(): Promise<ApiResponse<string[]>> {
    return await apiStore.apiRequest<ApiResponse<string[]>>({
      method: "GET",
      endpoint: "/api/admin/cities/countries",
      auth: true,
    });
  }

  async function addCityImage(
    cityId: number,
    payload: AddCityImagePayload,
  ): Promise<ApiResponse<CityImageDto>> {
    return await apiStore.apiRequest<ApiResponse<CityImageDto>>({
      method: "POST",
      endpoint: `/api/admin/cities/${cityId}/images`,
      data: payload,
      auth: true,
    });
  }

  async function deleteCityImage(
    cityId: number,
    imageId: number,
  ): Promise<ApiResponse<boolean>> {
    return await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/cities/${cityId}/images/${imageId}`,
      auth: true,
    });
  }

  return {
    getCities,
    createCity,
    getCityById,
    updateCity,
    deleteCity,
    getCountries,
    addCityImage,
    deleteCityImage,
  };
});

export default null;
