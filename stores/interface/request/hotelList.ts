import type { SortBy } from "./../../../interface/common";

export interface HotelListRequest {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortBy;
}
