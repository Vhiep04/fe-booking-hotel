interface Facility {
  facilityId: number;
  name: string;
}

interface ImageHotel {
  isPrimary: boolean;
  displayOrder: number;
  imgUrl: string;
}

export interface HotelData {
  hotelId: number;
  name: string;
  location: string;
  description: string;
  minPricePerNight: number;
  maxPricePerNight: number;
  primaryImageUrl: string;
  images: ImageHotel[];
  availableRoomTypes: string[];
  popularFacilities: Facility[];
  averageRating?: string;
  totalReviews: number;
}

export interface CityData {
  cityId: number;
  cityName: string;
  hotels: HotelData[];
}

export interface CitiesResponse {
  success: boolean;
  message: string;
  data: CityData;
  totalCount: number;
}
