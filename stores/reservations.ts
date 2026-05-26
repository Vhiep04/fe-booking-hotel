import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";

export interface UserReservation {
  reservationId: number;
  bookingCode: string;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  pricePerNight: number;
  capacity: number;
  hotelId: number;
  hotelName: string;
  hotelLocation: string;
  hotelImage: string;
  cityName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  paymentMethod: string;
  paymentDate: string;
  hasFeedback: boolean;
  feedbackId: number | null;
  rating: number | null;
  comment: string | null;
}

export interface GetReservationsParams {
  status?: string;
  sort?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors?: string[] | null;
  totalCount?: number;
}

export const useReservationStore = defineStore("reservation", () => {
  const apiStore = useApiStore();

  const reservations = ref<UserReservation[]>([]);
  const selectedReservation = ref<UserReservation | null>(null);
  const totalCount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchReservations(params: GetReservationsParams = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<
        ApiResponse<UserReservation[]>
      >({
        endpoint: "/api/reservations",
        method: "GET",
        auth: true,
        params: {
          ...(params.status && { status: params.status }),
          ...(params.sort && { sort: params.sort }),
        },
      });

      if (response?.success) {
        reservations.value = response.data;
        totalCount.value = response.totalCount ?? response.data.length;
      } else {
        error.value = response?.message ?? "Failed to fetch reservations";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchReservationById(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<UserReservation>>({
        endpoint: `/api/reservations/${id}`,
        method: "GET",
        auth: true,
      });

      if (response?.success) {
        selectedReservation.value = response.data;
      } else {
        error.value = response?.message ?? "Failed to fetch reservation";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelReservation(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<null>>({
        endpoint: `/api/reservations/${id}/cancel`,
        method: "PATCH",
        auth: true,
      });

      if (response?.success) {
        // Sync local state
        if (selectedReservation.value?.reservationId === id) {
          selectedReservation.value = {
            ...selectedReservation.value,
            paymentStatus: "Cancelled",
          };
        }

        const item = reservations.value.find((r) => r.reservationId === id);
        if (item) {
          item.paymentStatus = "Cancelled";
        }
      } else {
        error.value = response?.message ?? "Failed to cancel reservation";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function clearSelectedReservation() {
    selectedReservation.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    reservations,
    selectedReservation,
    totalCount,
    isLoading,
    error,

    fetchReservations,
    fetchReservationById,
    cancelReservation,
    clearSelectedReservation,
    clearError,
  };
});
