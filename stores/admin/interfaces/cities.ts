export interface CityImageDto {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  description: string;
}

export interface CityDto {
  cityId: number;
  name: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
  hotelCount: number;
  images: CityImageDto[];
}

export interface PaginatedCities {
  items: CityDto[];
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

export interface GetCitiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  country?: string;
}

export interface CreateCityPayload {
  name: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface UpdateCityPayload {
  name: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
}
