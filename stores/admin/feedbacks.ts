import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  AdminFeedbackDto,
  ApiResponse,
  GetFeedbacksParams,
  PaginatedFeedbacks,
  UpdateFeedbackPayload,
} from "./interfaces/feedbacks";

export const useAdminFeedbackStore = defineStore("adminFeedback", () => {
  const apiStore = useApiStore();

  async function getFeedbacks(
    params: GetFeedbacksParams = {},
  ): Promise<ApiResponse<PaginatedFeedbacks>> {
    const { page = 1, pageSize = 10, search, hotelId, rating } = params;

    const queryParams: Record<string, string | number> = { page, pageSize };
    if (search) queryParams.search = search;
    if (hotelId !== undefined) queryParams.hotelId = hotelId;
    if (rating !== undefined) queryParams.rating = rating;

    return await apiStore.apiRequest<ApiResponse<PaginatedFeedbacks>>({
      method: "GET",
      endpoint: "/api/admin/feedbacks",
      params: queryParams,
      auth: true,
    });
  }

  async function getFeedbackById(
    id: number,
  ): Promise<ApiResponse<AdminFeedbackDto>> {
    return await apiStore.apiRequest<ApiResponse<AdminFeedbackDto>>({
      method: "GET",
      endpoint: `/api/admin/feedbacks/${id}`,
      auth: true,
    });
  }

  async function updateFeedback(
    id: number,
    payload: UpdateFeedbackPayload,
  ): Promise<ApiResponse<AdminFeedbackDto>> {
    return await apiStore.apiRequest<ApiResponse<AdminFeedbackDto>>({
      method: "PUT",
      endpoint: `/api/admin/feedbacks/${id}`,
      data: payload,
      auth: true,
    });
  }

  async function deleteFeedback(id: number): Promise<ApiResponse<boolean>> {
    return await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/feedbacks/${id}`,
      auth: true,
    });
  }

  return {
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
  };
});

export default null;
