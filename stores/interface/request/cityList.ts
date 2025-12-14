import type { SortBy } from "./../../../interface/common";

export interface CityListRequest {
  keyword?: string;
  cityName?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
  checkIn?: string;
  checkOut?: string;
  bedType?: string;
  facilities?: string[];
}
