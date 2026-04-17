export interface FacilityDto {
  facilityId: number;
  name: string;
}

export interface RoomTypeDto {
  roomTypeId: number;
  hotelId: number;
  hotelName: string;
  typeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imgUrl: string;
  createdAt: string;
  roomCount: number;
  facilities: FacilityDto[];
}

export interface PaginatedRoomTypes {
  items: RoomTypeDto[];
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

export interface GetRoomTypesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  hotelId?: number;
}

export interface RoomTypePayload {
  hotelId: number;
  typeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imgUrl: string;
  facilityIds: number[];
}
