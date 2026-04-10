import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import type {
  GetReservationsParams,
  PaginatedReservations,
  Reservation,
} from "./admin/interfaces/reservations";
import type { ApiResponse } from "./admin/interfaces/cities";

export const useReservationsStore = defineStore("reservations", () => {
  const apiStore = useApiStore();

  const reservations = ref<PaginatedReservations | null>(null);
  const selectedReservation = ref<Reservation | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchReservations(params: GetReservationsParams = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<
        ApiResponse<PaginatedReservations>
      >({
        endpoint: "/admin/reservations",
        method: "GET",
        auth: true,
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          ...(params.search && { search: params.search }),
          ...(params.status && { status: params.status }),
          ...(params.hotelId !== undefined && { hotelId: params.hotelId }),
          ...(params.fromDate && { fromDate: params.fromDate }),
          ...(params.toDate && { toDate: params.toDate }),
        },
      });

      if (response?.success) {
        reservations.value = response.data;
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
      const response = await apiStore.apiRequest<ApiResponse<Reservation>>({
        endpoint: `/admin/reservations/${id}`,
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

  async function updateReservationStatus(id: number, paymentStatus: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<boolean>>({
        endpoint: `/admin/reservations/${id}/status`,
        method: "PATCH",
        auth: true,
        data: { paymentStatus },
      });

      if (response?.success) {
        if (selectedReservation.value?.reservationId === id) {
          selectedReservation.value = {
            ...selectedReservation.value,
            paymentStatus,
          };
        }

        const item = reservations.value?.items.find(
          (r) => r.reservationId === id,
        );
        if (item) {
          item.paymentStatus = paymentStatus;
        }
      } else {
        error.value = response?.message ?? "Failed to update status";
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
    isLoading,
    error,

    fetchReservations,
    fetchReservationById,
    updateReservationStatus,
    clearSelectedReservation,
    clearError,
  };
});
