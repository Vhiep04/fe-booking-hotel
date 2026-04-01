export interface UserInfoResponse {
  fullName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl: string;
  email: string;
  userId: string;
  phoneNumber: string;
  birthDate?: Date;
}
