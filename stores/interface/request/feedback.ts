export interface CreateFeedbackPayload {
  hotelId: number;
  reservationId: number;
  rating: number;
  comment: string;
}

export interface UpdateFeedbackPayload {
  rating: number;
  comment: string;
}
