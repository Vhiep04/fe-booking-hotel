import { defineStore } from "pinia";
import { setCookie, deleteCookie, getCookie } from "../utils/storageHelper";
import { useApiStore } from "./api";
import { auth as authRequest } from "./entity/request";
import { auth as authResponse } from "./entity/response";
import type { CustomJwtPayload } from "../interface/jwtPayload";
import type {
  RequestLoginPayload,
  RequestOtpVerify,
  RequestRegisterPayload,
  RequestResendOtpVerify,
} from "./interface/request/auth";
import type {
  LoginResponseData,
  RegisterResponseData,
  SendOtpResponseData,
} from "./interface/response/auth";
import { ref } from "vue";

const namespace = "/Auth";

export const useAuthStore = defineStore("auth", () => {
  const apiStore = useApiStore();

  const token = ref("");
  const jwtPayload = ref<CustomJwtPayload | null>(null);
  const isAuthenticated = ref(false);
  const userLoginRequesting = ref(false);
  const userRegisterRequesting = ref(false);
  const userSendOtpCode = ref(false);
  const reSendOtpCode = ref(false);

  // FIX: Thêm function để init auth state từ cookie
  function initAuthFromCookie() {
    const savedToken = getCookie("token");
    if (savedToken) {
      try {
        const decoded = new authResponse.AuthToken(savedToken).deserialize();

        // Check token còn hạn không
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp > now) {
          token.value = savedToken;
          jwtPayload.value = decoded;
          isAuthenticated.value = true;
          console.log("Auth restored from cookie");
        } else {
          // Token hết hạn, xóa cookie
          deleteCookie("token");
          console.log("Token expired, cleared cookie");
        }
      } catch (e) {
        console.error("Invalid token in cookie:", e);
        deleteCookie("token");
      }
    }
  }

  function userLoginSuccess(data: LoginResponseData) {
    token.value = data.token;
    jwtPayload.value = new authResponse.AuthToken(data.token).deserialize();
    isAuthenticated.value = true;

    const expiresDate = new Date(data.expiration);

    setCookie("token", data.token, {
      expires: expiresDate,
      path: "/",
      sameSite: "Lax",
    });

    console.log("Login successful, token saved");
  }

  function userLoginFailed(e: Error) {
    console.log(e);
  }

  function userRegisterSuccess(data: RegisterResponseData) {
    console.log("Registration successful:", data);
  }

  function userRegisterFailed(e: Error) {
    console.error("Registration failed:", e);
  }

  async function userRegister({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
  }: RequestRegisterPayload) {
    try {
      userRegisterRequesting.value = true;
      const response = await apiStore.apiRequest<RegisterResponseData>({
        method: "POST",
        endpoint: `${namespace}/register`,
        data: new authRequest.UserRegister({
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
          confirmPassword,
        }).serialize(),
        proxy: false,
        auth: false,
      });

      userRegisterSuccess(response.data);
      return response;
    } catch (e) {
      userRegisterFailed(new Error(JSON.stringify(e)));
      throw e;
    } finally {
      userRegisterRequesting.value = false;
    }
  }

  async function sendOtpVerify({ email, otpCode }: RequestOtpVerify) {
    try {
      userSendOtpCode.value = true;
      const res = await apiStore.apiRequest<SendOtpResponseData>({
        method: "POST",
        endpoint: `${namespace}/verify-otp`,
        proxy: false,
        auth: false,
        data: {
          email,
          otpCode,
        },
      });
      return res;
    } catch (e) {
      console.log("verify otp-failed: ", e);
    } finally {
      userRegisterRequesting.value = false;
    }
  }

  async function resendOtpVerify({ email }: RequestResendOtpVerify) {
    try {
      reSendOtpCode.value = true;
      const res = await apiStore.apiRequest<SendOtpResponseData>({
        method: "POST",
        endpoint: `${namespace}/resend-otp`,
        proxy: false,
        auth: false,
        data: {
          email,
        },
      });
      return res;
    } catch (e) {
      console.log("resend verify-otp failed: ", e);
    } finally {
      reSendOtpCode.value = false;
    }
  }

  async function userLogin({
    email,
    password,
    rememberMe,
  }: RequestLoginPayload) {
    try {
      userLoginRequesting.value = true;
      const response = await apiStore.apiRequest<{
        success: boolean;
        message: string;
        data: LoginResponseData;
      }>({
        method: "POST",
        endpoint: `${namespace}/login`,
        data: {
          email,
          password,
        },
        proxy: false,
        auth: false,
      });

      if (response.success && response.data) {
        userLoginSuccess(response.data);
        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (e: any) {
      console.error("Login error:", e);
      userLoginFailed(new Error(e.message || "Login failed"));
      throw e;
    } finally {
      userLoginRequesting.value = false;
    }
  }

  function userLogout() {
    token.value = "";
    jwtPayload.value = null;
    isAuthenticated.value = false;
    deleteCookie("token");
  }

  return {
    token,
    isAuthenticated,
    userLoginRequesting,
    userRegisterRequesting,
    initAuthFromCookie, // Export function mới
    userLogin,
    userRegister,
    userLogout,
    sendOtpVerify,
    resendOtpVerify,
  };
});

export default null;
