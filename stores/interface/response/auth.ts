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

export interface ForgotPasswordData {
  expiresIn: string;
}

export interface VerifyResetOtpData {
  email: string;
  resetToken: string;
  expiresIn: string;
}

export interface ForgotPasswordResponseData {
  success: boolean;
  message: string;
  data: ForgotPasswordData;
}

export interface VerifyResetOtpResponseData {
  success: boolean;
  message: string;
  data: VerifyResetOtpData;
}

export interface ResetPasswordResponseData {
  success: boolean;
  message: string;
}
