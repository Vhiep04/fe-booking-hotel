interface Facility {
  facilityId: number;
  name: string;
}

interface ImageHotel {
  isPrimary: boolean;
  displayOrder: number;
  imageUrl: string;
}

export interface Feedback {
  feedbackId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RatingDistribution {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface HotelData {
  hotelId: number;
  name: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  minPrice: number;
  maxPrice: number;
  imgUrl: string;
  primaryImageUrl?: string;
  images: ImageHotel[];
  availableRoomTypes?: string[];
  roomTypes: RoomType[];
  facilities: string[];
  averageRating?: number;
  recentFeedbacks: Feedback[];
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

interface RoomType {
  roomTypeId: number;
  typeName: string;
  pricePerNight: number;
  capacity: number;
  imgUrl: string;
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
