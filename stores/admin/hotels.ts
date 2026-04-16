import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import type {
  AddImagePayload,
  GetHotelsParams,
  Hotel,
  HotelImage,
  HotelPayload,
  PaginatedHotels,
} from "./interfaces/hotels";
import type { ApiResponse } from "./interfaces/cities";

export const useAdminHotelStore = defineStore("adminHotel", () => {
  const apiStore = useApiStore();

  const hotels = ref<PaginatedHotels | null>(null);
  const selectedHotel = ref<Hotel | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchHotels(params: GetHotelsParams = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<PaginatedHotels>>({
        endpoint: "/admin/hotels",
        method: "GET",
        auth: true,
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          ...(params.search && { search: params.search }),
          ...(params.cityId !== undefined && { cityId: params.cityId }),
        },
      });

      if (response?.success) {
        hotels.value = response.data;
      } else {
        error.value = response?.message ?? "Failed to fetch hotels";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchHotelById(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<Hotel>>({
        endpoint: `/admin/hotels/${id}`,
        method: "GET",
        auth: true,
      });

      if (response?.success) {
        selectedHotel.value = response.data;
      } else {
        error.value = response?.message ?? "Failed to fetch hotel";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function createHotel(payload: HotelPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<Hotel>>({
        endpoint: "/admin/hotels",
        method: "POST",
        auth: true,
        data: payload,
      });

      if (response?.success) {
        if (hotels.value) {
          hotels.value.items.unshift(response.data);
          hotels.value.totalCount += 1;
        }
      } else {
        error.value = response?.message ?? "Failed to create hotel";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateHotel(id: number, payload: HotelPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<Hotel>>({
        endpoint: `/admin/hotels/${id}`,
        method: "PUT",
        auth: true,
        data: payload,
      });

      if (response?.success) {
        if (selectedHotel.value?.hotelId === id) {
          selectedHotel.value = response.data;
        }
        if (hotels.value) {
          const index = hotels.value.items.findIndex((h) => h.hotelId === id);
          if (index !== -1) hotels.value.items[index] = response.data;
        }
      } else {
        error.value = response?.message ?? "Failed to update hotel";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteHotel(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<boolean>>({
        endpoint: `/admin/hotels/${id}`,
        method: "DELETE",
        auth: true,
      });

      if (response?.success) {
        if (hotels.value) {
          hotels.value.items = hotels.value.items.filter(
            (h) => h.hotelId !== id,
          );
          hotels.value.totalCount = Math.max(0, hotels.value.totalCount - 1);
        }
        if (selectedHotel.value?.hotelId === id) {
          selectedHotel.value = null;
        }
      } else {
        error.value = response?.message ?? "Failed to delete hotel";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function addHotelImage(hotelId: number, payload: AddImagePayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<HotelImage>>({
        endpoint: `/admin/hotels/${hotelId}/images`,
        method: "POST",
        auth: true,
        data: payload,
      });

      if (response?.success) {
        if (selectedHotel.value?.hotelId === hotelId) {
          selectedHotel.value.images.push(response.data);
        }
        const item = hotels.value?.items.find((h) => h.hotelId === hotelId);
        if (item) item.images.push(response.data);
      } else {
        error.value = response?.message ?? "Failed to add image";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteHotelImage(hotelId: number, imageId: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<boolean>>({
        endpoint: `/admin/hotels/${hotelId}/images/${imageId}`,
        method: "DELETE",
        auth: true,
      });

      if (response?.success) {
        const removeImage = (images: HotelImage[]) =>
          images.filter((img) => img.imageId !== imageId);

        if (selectedHotel.value?.hotelId === hotelId) {
          selectedHotel.value.images = removeImage(selectedHotel.value.images);
        }
        const item = hotels.value?.items.find((h) => h.hotelId === hotelId);
        if (item) item.images = removeImage(item.images);
      } else {
        error.value = response?.message ?? "Failed to delete image";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function setPrimaryImage(hotelId: number, imageId: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<boolean>>({
        endpoint: `/admin/hotels/${hotelId}/images/${imageId}/set-primary`,
        method: "POST",
        auth: true,
      });

      if (response?.success) {
        const updatePrimary = (images: HotelImage[]) =>
          images.map((img) => ({ ...img, isPrimary: img.imageId === imageId }));

        if (selectedHotel.value?.hotelId === hotelId) {
          selectedHotel.value.images = updatePrimary(
            selectedHotel.value.images,
          );
        }
        const item = hotels.value?.items.find((h) => h.hotelId === hotelId);
        if (item) item.images = updatePrimary(item.images);
      } else {
        error.value = response?.message ?? "Failed to set primary image";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function reorderHotelImages(hotelId: number, imageIds: number[]) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<boolean>>({
        endpoint: `/admin/hotels/${hotelId}/images/reorder`,
        method: "POST",
        auth: true,
        data: imageIds,
      });

      if (!response?.success) {
        error.value = response?.message ?? "Failed to reorder images";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function clearSelectedHotel() {
    selectedHotel.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    hotels,
    selectedHotel,
    isLoading,
    error,

    fetchHotels,
    fetchHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    addHotelImage,
    deleteHotelImage,
    setPrimaryImage,
    reorderHotelImages,
    clearSelectedHotel,
    clearError,
  };
});
