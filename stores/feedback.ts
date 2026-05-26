import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import type { ApiResponse, Feedback } from "./interface/response/feedback";
import type {
  CreateFeedbackPayload,
  UpdateFeedbackPayload,
} from "./interface/request/feedback";

export const useFeedbackStore = defineStore("feedback", () => {
  const apiStore = useApiStore();

  const myFeedbacks = ref<Feedback[]>([]);
  const totalCount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMyFeedbacks() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<Feedback[]>>({
        endpoint: "/api/feedbacks/my",
        method: "GET",
        auth: true,
      });

      if (response?.success) {
        myFeedbacks.value = response.data;
        totalCount.value = response.totalCount ?? response.data.length;
      } else {
        error.value = response?.message ?? "Failed to fetch feedbacks";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function createFeedback(payload: CreateFeedbackPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<Feedback>>({
        endpoint: "/api/feedbacks",
        method: "POST",
        auth: true,
        data: payload,
      });

      if (response?.success) {
        myFeedbacks.value.unshift(response.data);
        totalCount.value += 1;
      } else {
        error.value = response?.message ?? "Failed to create feedback";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateFeedback(id: number, payload: UpdateFeedbackPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<Feedback>>({
        endpoint: `/api/feedbacks/${id}`,
        method: "PUT",
        auth: true,
        data: payload,
      });

      if (response?.success) {
        const index = myFeedbacks.value.findIndex((f) => f.feedbackId === id);
        if (index !== -1) {
          myFeedbacks.value[index] = response.data;
        }
      } else {
        error.value = response?.message ?? "Failed to update feedback";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteFeedback(id: number) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ApiResponse<null>>({
        endpoint: `/api/feedbacks/${id}`,
        method: "DELETE",
        auth: true,
      });

      if (response?.success) {
        myFeedbacks.value = myFeedbacks.value.filter(
          (f) => f.feedbackId !== id,
        );
        totalCount.value = Math.max(0, totalCount.value - 1);
      } else {
        error.value = response?.message ?? "Failed to delete feedback";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    myFeedbacks,
    totalCount,
    isLoading,
    error,

    fetchMyFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    clearError,
  };
});
