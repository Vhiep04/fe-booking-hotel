interface Facility {
  facilityId: number;
  name: string;
}

interface ImageHotel {
  isPrimary: boolean;
  displayOrder: number;
  imageUrl: string;
}

export interface HotelData {
  hotelId: number;
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
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
}

export interface CitiesResponseData {
  hotels: HotelData[];
  totalCount: number;
}

export interface CitiesResponse {
  success: boolean;
  message: string;
  data: CitiesResponseData;
}

export interface City {
  cityId: number;
  name: string;
  country: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface CityResponse {
  success: boolean;
  message: string;
  data: City;
  searchTerm: string;
  totalCount: number;
}
