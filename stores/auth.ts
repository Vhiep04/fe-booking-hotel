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
  LoginData,
  LoginResponseData,
  RegisterResponseData,
  SendOtpResponseData,
} from "./interface/response/auth";
import type { UserInfoResponse } from "./interface/response/getUserInfo";
import { ref } from "vue";
import { ROLE_CLAIM } from "~/constants/auth";

const namespace = "/Auth";

export const useAuthStore = defineStore("auth", () => {
  const apiStore = useApiStore();

  const token = ref("");
  const jwtPayload = ref<CustomJwtPayload | null>(null);
  const isAuthenticated = ref(false);
  const userInfo = ref<UserInfoResponse | null>(null);

  const userLoginRequesting = ref(false);
  const userRegisterRequesting = ref(false);
  const userSendOtpCode = ref(false);
  const reSendOtpCode = ref(false);

  const isAdmin = computed(() => {
    const role = jwtPayload.value?.[ROLE_CLAIM];
    if (!role) return false;
    return Array.isArray(role) ? role.includes("Admin") : role === "Admin";
  });

  const isManager = computed(() => {
    const role = jwtPayload.value?.[ROLE_CLAIM];
    if (!role) return false;
    return Array.isArray(role) ? role.includes("Manager") : role === "Manager";
  });

  const isAdminOrManager = computed(() => isAdmin.value || isManager.value);

  function initAuthFromCookie() {
    const savedToken = getCookie("token");

    if (savedToken) {
      try {
        const decoded = new authResponse.AuthToken(savedToken).deserialize();
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp > now) {
          token.value = savedToken;
          jwtPayload.value = decoded;
          isAuthenticated.value = true;
        } else {
          deleteCookie("token");
        }
      } catch (e) {
        console.error("Invalid token:", e);
        deleteCookie("token");
      }
    }
  }

  async function fetchUserInfo() {
    try {
      const res = await apiStore.apiRequest<{
        success: boolean;
        data: UserInfoResponse;
      }>({
        method: "GET",
        endpoint: `${namespace}/me`,
        auth: true,
        proxy: false,
      });

      userInfo.value = res.data;
    } catch (e) {
      console.error("fetchUserInfo error:", e);
    }
  }

  function userLoginSuccess(data: LoginData) {
    token.value = data.token;
    jwtPayload.value = new authResponse.AuthToken(data.token).deserialize();
    isAuthenticated.value = true;

    const expiresDate = new Date(data.expiration);

    setCookie("token", data.token, {
      expires: expiresDate,
      path: "/",
      sameSite: "Lax",
    });
  }

  async function userLogin({ email, password }: RequestLoginPayload) {
    try {
      userLoginRequesting.value = true;

      const response = await apiStore.apiRequest<{
        success: boolean;
        message: string;
        data: LoginData;
      }>({
        method: "POST",
        endpoint: `${namespace}/login`,
        data: { email, password },
        proxy: false,
        auth: false,
      });

      if (response.success && response.data) {
        userLoginSuccess(response.data);
        await fetchUserInfo();
        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (e: any) {
      console.error("Login error:", e);
      throw e;
    } finally {
      userLoginRequesting.value = false;
    }
  }

  async function userRegister(payload: RequestRegisterPayload) {
    try {
      userRegisterRequesting.value = true;

      const response = await apiStore.apiRequest<RegisterResponseData>({
        method: "POST",
        endpoint: `${namespace}/register`,
        data: new authRequest.UserRegister(payload).serialize(),
        proxy: false,
        auth: false,
      });

      return response;
    } catch (e) {
      throw e;
    } finally {
      userRegisterRequesting.value = false;
    }
  }

  async function sendOtpVerify({ email, otpCode }: RequestOtpVerify) {
    try {
      userSendOtpCode.value = true;

      return await apiStore.apiRequest<SendOtpResponseData>({
        method: "POST",
        endpoint: `${namespace}/verify-otp`,
        proxy: false,
        auth: false,
        data: { email, otpCode },
      });
    } finally {
      userSendOtpCode.value = false;
    }
  }

  async function resendOtpVerify({ email }: RequestResendOtpVerify) {
    try {
      reSendOtpCode.value = true;

      return await apiStore.apiRequest<SendOtpResponseData>({
        method: "POST",
        endpoint: `${namespace}/resend-otp`,
        proxy: false,
        auth: false,
        data: { email },
      });
    } finally {
      reSendOtpCode.value = false;
    }
  }

  function userLogout() {
    token.value = "";
    jwtPayload.value = null;
    isAuthenticated.value = false;
    userInfo.value = null;
    deleteCookie("token");
  }

  return {
    token,
    isAuthenticated,
    userInfo,
    isAdmin,
    isManager,
    isAdminOrManager,
    userLoginRequesting,
    userRegisterRequesting,
    initAuthFromCookie,
    fetchUserInfo,
    userLogin,
    userRegister,
    userLogout,
    sendOtpVerify,
    resendOtpVerify,
  };
});
