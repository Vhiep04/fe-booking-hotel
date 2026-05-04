interface HotelData {
  Name: string;
  Location: string;
  Description: string;
  ImgUrl: string;
  CityName: string;
  Country: string;
  MinPrice: number;
  MaxPrice: number;
  AverageRating: DoubleRange;
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
