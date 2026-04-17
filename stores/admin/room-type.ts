import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  ApiResponse,
  GetRoomTypesParams,
  PaginatedRoomTypes,
  RoomTypeDto,
  RoomTypePayload,
} from "./interfaces/room-type";

export const useRoomTypeStore = defineStore("roomType", () => {
  const apiStore = useApiStore();

  async function getRoomTypes(
    params: GetRoomTypesParams = {},
  ): Promise<ApiResponse<PaginatedRoomTypes>> {
    const { page = 1, pageSize = 10, search, hotelId } = params;

    const queryParams: Record<string, string | number> = { page, pageSize };
    if (search) queryParams.search = search;
    if (hotelId !== undefined) queryParams.hotelId = hotelId;

    return await apiStore.apiRequest<ApiResponse<PaginatedRoomTypes>>({
      method: "GET",
      endpoint: "/api/admin/room-types",
      params: queryParams,
      auth: true,
    });
  }

  async function getRoomTypesByHotel(
    hotelId: number,
  ): Promise<ApiResponse<RoomTypeDto[]>> {
    return await apiStore.apiRequest<ApiResponse<RoomTypeDto[]>>({
      method: "GET",
      endpoint: `/api/admin/room-types/by-hotel/${hotelId}`,
      auth: true,
    });
  }

  async function getRoomTypeById(
    id: number,
  ): Promise<ApiResponse<RoomTypeDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomTypeDto>>({
      method: "GET",
      endpoint: `/api/admin/room-types/${id}`,
      auth: true,
    });
  }

  async function createRoomType(
    payload: RoomTypePayload,
  ): Promise<ApiResponse<RoomTypeDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomTypeDto>>({
      method: "POST",
      endpoint: "/api/admin/room-types",
      data: payload,
      auth: true,
    });
  }

  async function updateRoomType(
    id: number,
    payload: RoomTypePayload,
  ): Promise<ApiResponse<RoomTypeDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomTypeDto>>({
      method: "PUT",
      endpoint: `/api/admin/room-types/${id}`,
      data: payload,
      auth: true,
    });
  }

  async function deleteRoomType(id: number): Promise<ApiResponse<boolean>> {
    return await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/room-types/${id}`,
      auth: true,
    });
  }

  return {
    getRoomTypes,
    getRoomTypesByHotel,
    getRoomTypeById,
    createRoomType,
    updateRoomType,
    deleteRoomType,
  };
});

export default null;
