export interface RequestLoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface RequestRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface RequestOtpVerify {
  email: string;
  otpCode: string;
}
export interface RequestResendOtpVerify {
  email: string;
}
