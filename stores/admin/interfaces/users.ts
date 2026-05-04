export interface UserDto {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  createdAt: string;
  roles: string[];
}

export interface PaginatedUsers {
  items: UserDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string[] | null;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}

export interface CreateUserPayload {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
}
