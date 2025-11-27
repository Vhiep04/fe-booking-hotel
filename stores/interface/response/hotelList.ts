interface HotelData {
  Name: string;
  Location: string;
  Description: string;
  ImgUrl: string;

  // City info
  CityName: string;
  Country: string;

  // Pricing info
  MinPrice: number;
  MaxPrice: number;

  // Rating info
  AverageRating: DoubleRange;

  // Room availability
  TotalRooms: number;
  AvailableRooms: number;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HotelsResponse {
  success: boolean;
  message: string;
  data: HotelData;
  pagination: Pagination;
}
