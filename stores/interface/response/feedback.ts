export interface Feedback {
  feedbackId: number;
  userId: string;
  userName: string;
  hotelId: number;
  hotelName: string;
  reservationId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  totalCount?: number;
}
