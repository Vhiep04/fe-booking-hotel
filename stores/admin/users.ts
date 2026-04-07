import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  ApiResponse,
  CreateUserPayload,
  GetUsersParams,
  PaginatedUsers,
  UpdateUserPayload,
  UserDto,
} from "./interfaces/users";

export const useUsersStore = defineStore("users", () => {
  const apiStore = useApiStore();

  async function getUsers(
    params: GetUsersParams = {},
  ): Promise<ApiResponse<PaginatedUsers>> {
    const { page = 1, pageSize = 10, search, role } = params;

    const queryParams: Record<string, string | number> = { page, pageSize };
    if (search) queryParams.search = search;
    if (role) queryParams.role = role;

    const response = await apiStore.apiRequest<ApiResponse<PaginatedUsers>>({
      method: "GET",
      endpoint: "/admin/users",
      params: queryParams,
      auth: true,
    });

    return response;
  }

  async function createUser(
    payload: CreateUserPayload,
  ): Promise<ApiResponse<UserDto>> {
    const response = await apiStore.apiRequest<ApiResponse<UserDto>>({
      method: "POST",
      endpoint: "/admin/users",
      data: payload,
      auth: true,
    });

    return response;
  }

  async function getUserById(id: string): Promise<ApiResponse<UserDto>> {
    const response = await apiStore.apiRequest<ApiResponse<UserDto>>({
      method: "GET",
      endpoint: `/admin/users/${id}`,
      auth: true,
    });

    return response;
  }

  async function updateUser(
    id: string,
    payload: UpdateUserPayload,
  ): Promise<ApiResponse<UserDto>> {
    const response = await apiStore.apiRequest<ApiResponse<UserDto>>({
      method: "PUT",
      endpoint: `/admin/users/${id}`,
      data: payload,
      auth: true,
    });

    return response;
  }

  async function deleteUser(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiStore.apiRequest<ApiResponse<boolean>>({
      method: "DELETE",
      endpoint: `/admin/users/${id}`,
      auth: true,
    });

    return response;
  }

  return {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
  };
});

export default null;
