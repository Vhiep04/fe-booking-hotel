import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "@/stores/api";

export interface FavouriteHotel {
  favouriteId: number;
  hotelId: number;
  hotelName: string;
  hotelLocation: string;
  hotelImgUrl: string;
  cityName: string;
  country: string;
  minPrice: number;
  maxPrice: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  totalCount?: number;
}

export const useFavouriteHotelStore = defineStore("favouriteHotel", () => {
  const apiStore = useApiStore();

  const favourites = ref<FavouriteHotel[]>([]);
  const totalCount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const favouriteHotelIds = computed(
    () => new Set(favourites.value.map((f) => f.hotelId)),
  );

  function isFavourited(hotelId: number): boolean {
    return favouriteHotelIds.value.has(hotelId);
  }

  async function fetchFavourites() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<FavouriteHotel[]>>(
        {
          endpoint: "/api/Favourites",
          method: "GET",
          auth: true,
        },
      );

      if (response?.success) {
        favourites.value = response.data;
        totalCount.value = response.totalCount ?? response.data.length;
      } else {
        error.value = response?.message ?? "Failed to fetch favourites";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function addFavourite(hotelId: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<FavouriteHotel>>({
        endpoint: "/api/Favourites",
        method: "POST",
        auth: true,
        data: { hotelId },
      });

      if (response?.success) {
        const exists = favourites.value.some((f) => f.hotelId === hotelId);
        if (!exists) {
          favourites.value.push(response.data);
          totalCount.value += 1;
        }
      } else {
        error.value = response?.message ?? "Failed to add favourite";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeFavourite(favouriteId: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<null>>({
        endpoint: `/api/Favourites/${favouriteId}`,
        method: "DELETE",
        auth: true,
      });

      if (response?.success) {
        favourites.value = favourites.value.filter(
          (f) => f.favouriteId !== favouriteId,
        );
        totalCount.value = Math.max(0, totalCount.value - 1);
      } else {
        error.value = response?.message ?? "Failed to remove favourite";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  // Convenient for heart/bookmark buttons — no need to check state in component

  async function toggleFavourite(hotelId: number) {
    const existing = favourites.value.find((f) => f.hotelId === hotelId);
    if (existing) {
      return removeFavourite(existing.favouriteId);
    } else {
      return addFavourite(hotelId);
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    favourites,
    totalCount,
    isLoading,
    error,

    favouriteHotelIds,
    isFavourited,

    fetchFavourites,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearError,
  };
});
