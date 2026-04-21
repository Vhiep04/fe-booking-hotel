export interface FacilityData {
  facilityId: number;
  name: string;
}

export interface FacilityResponse {
  success: boolean;
  message: string;
  data: FacilityData[];
  errors: string[] | null;
}
