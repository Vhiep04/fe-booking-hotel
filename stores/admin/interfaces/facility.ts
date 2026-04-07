export interface FacilityDto {
  facilityId: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}

export interface CreateFacilityPayload {
  name: string;
}

export interface UpdateFacilityPayload {
  name: string;
}
