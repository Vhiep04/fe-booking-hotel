export interface FacilityDto {
  facilityId: number;
  name: string;
}

export interface RoomDto {
  roomId: number;
  hotelId: number;
  hotelName: string;
  roomNumber: string;
  status: string;
  roomTypeId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  imgUrl: string;
  facilities: FacilityDto[];
}

export interface PaginatedRooms {
  items: RoomDto[];
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

export interface GetRoomsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  hotelId?: number;
  roomType?: string;
}

export interface RoomPayload {
  hotelId: number;
  roomTypeId: number;
  roomNumber: string;
  status: string;
}

export interface BulkCreateRoomPayload {
  hotelId: number;
  roomTypeId: number;
  roomNumbers: string[];
  status?: string;
}
