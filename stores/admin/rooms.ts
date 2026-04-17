import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  ApiResponse,
  BulkCreateRoomPayload,
  GetRoomsParams,
  PaginatedRooms,
  RoomDto,
  RoomPayload,
} from "./interfaces/rooms";

export const useRoomStore = defineStore("room", () => {
  const apiStore = useApiStore();

  async function getRooms(
    params: GetRoomsParams = {},
  ): Promise<ApiResponse<PaginatedRooms>> {
    const { page = 1, pageSize = 10, search, hotelId, roomType } = params;

    const queryParams: Record<string, string | number> = { page, pageSize };
    if (search) queryParams.search = search;
    if (hotelId !== undefined) queryParams.hotelId = hotelId;
    if (roomType) queryParams.roomType = roomType;

    return await apiStore.apiRequest<ApiResponse<PaginatedRooms>>({
      method: "GET",
      endpoint: "/api/admin/rooms",
      params: queryParams,
      auth: true,
    });
  }

  async function getRoomById(id: number): Promise<ApiResponse<RoomDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomDto>>({
      method: "GET",
      endpoint: `/api/admin/rooms/${id}`,
      auth: true,
    });
  }

  async function getRoomsByHotel(
    hotelId: number,
  ): Promise<ApiResponse<RoomDto[]>> {
    return await apiStore.apiRequest<ApiResponse<RoomDto[]>>({
      method: "GET",
      endpoint: `/api/admin/rooms/by-hotel/${hotelId}`,
      auth: true,
    });
  }

  async function createRoom(
    payload: RoomPayload,
  ): Promise<ApiResponse<RoomDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomDto>>({
      method: "POST",
      endpoint: "/api/admin/rooms",
      data: payload,
      auth: true,
    });
  }

  async function bulkCreateRooms(
    payload: BulkCreateRoomPayload,
  ): Promise<ApiResponse<RoomDto[]>> {
    return await apiStore.apiRequest<ApiResponse<RoomDto[]>>({
      method: "POST",
      endpoint: "/api/admin/rooms/bulk",
      data: payload,
      auth: true,
    });
  }

  async function updateRoom(
    id: number,
    payload: RoomPayload,
  ): Promise<ApiResponse<RoomDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomDto>>({
      method: "PUT",
      endpoint: `/api/admin/rooms/${id}`,
      data: payload,
      auth: true,
    });
  }

  async function deleteRoom(id: number): Promise<ApiResponse<boolean>> {
    return await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/api/admin/rooms/${id}`,
      auth: true,
    });
  }

  async function updateRoomStatus(
    id: number,
    status: string,
  ): Promise<ApiResponse<RoomDto>> {
    return await apiStore.apiRequest<ApiResponse<RoomDto>>({
      method: "PATCH",
      endpoint: `/api/admin/rooms/${id}/status`,
      data: { status },
      auth: true,
    });
  }

  return {
    getRooms,
    getRoomById,
    getRoomsByHotel,
    createRoom,
    bulkCreateRooms,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
  };
});

export default null;
