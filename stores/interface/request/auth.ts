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
