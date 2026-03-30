export interface LoginData {
  token: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  phoneNumber: string;
  expiration: string;
}
interface registerData {
  email: string;
  expiresIn: string;
}

export interface LoginResponseData {
  success: boolean;
  message: string;
  data: LoginData;
}
export interface RegisterResponseData {
  success: boolean;
  message: string;
  data: registerData;
}

export interface SendOtpResponseData {
  success: boolean;
  message: string;
}
export interface ResendOtpResponseData {
  success: boolean;
  message: string;
}
