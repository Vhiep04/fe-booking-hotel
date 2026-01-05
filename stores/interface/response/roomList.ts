export interface Room {
  roomId: number;
  hotelId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  imgUrl: string;
  facilities: string[];
  isAvailable: boolean;
  bookedDays: number;
}

export interface RoomListData {
  hotelId: number;
  hotelName: string;
  rooms: Room[];
  totalRooms: number;
  availableRooms: number;
  minPrice: number;
  maxPrice: number;
}

export interface RoomListResponse {
  success: boolean;
  message: string;
  data: RoomListData;
}
