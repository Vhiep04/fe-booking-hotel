import type { SortBy } from "./../../../interface/common";

export interface CityListRequest {
  keyword?: string;
  cityName?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
  checkInDate?: Date;
  checkOutDate?: Date;
  bedType?: string;
  facilities?: string[];
}
