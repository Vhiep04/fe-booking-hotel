export interface Payment {
  paymentId: number;
  reservationId: number;
  paymentMethod: string;
  amount: number;
  paymentDate: string;
  status: string;
}

export interface Reservation {
  reservationId: number;
  userId: string;
  userEmail: string;
  userName: string;
  roomId: number;
  roomType: string;
  hotelName: string;
  cityName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  payments: Payment[];
}

export interface PaginatedReservations {
  items: Reservation[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetReservationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  hotelId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}
