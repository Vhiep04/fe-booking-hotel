export interface HotelImage {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  description: string;
}

export interface Hotel {
  hotelId: number;
  cityId: number;
  cityName: string;
  name: string;
  location: string;
  description: string;
  imgUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  roomCount: number;
  averageRating: number | null;
  feedbackCount: number;
  images: HotelImage[];
}

export interface PaginatedHotels {
  items: Hotel[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetHotelsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  cityId?: number;
}

export interface HotelPayload {
  cityId: number;
  name: string;
  location: string;
  description: string;
  imgUrl: string;
  latitude: number;
  longitude: number;
}

export interface AddImagePayload {
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  description: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}
