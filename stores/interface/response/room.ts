export interface RoomDetail {
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
