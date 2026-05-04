export interface AdminFeedbackDto {
  feedbackId: number;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  hotelId: number;
  hotelName: string;
  reservationId: number | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaginatedFeedbacks {
  items: AdminFeedbackDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}

export interface GetFeedbacksParams {
  page?: number;
  pageSize?: number;
  search?: string;
  hotelId?: number;
  rating?: number;
}

export interface UpdateFeedbackPayload {
  rating: number;
  comment: string;
}
