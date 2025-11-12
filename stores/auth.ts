import { defineStore } from "pinia";
import { setCookie, deleteCookie } from "../utils/storageHelper";
import { useApiStore } from "./api";
import { auth as authRequest } from "./entity/request";
import { auth as authResponse } from "./entity/response";
import type { CustomJwtPayload } from "../interface/jwtPayload";
import type {
  RequestLoginPayload,
  RequestRegisterPayload,
} from "./interface/request/auth";
import type {
  LoginResponseData,
  RegisterResponseData,
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

  function userLoginSuccess(data: LoginResponseData) {
    token.value = data.token;
    jwtPayload.value = new authResponse.AuthToken(data.token).deserialize();
    isAuthenticated.value = true;
    setCookie("token", data.token, {
      expires: new Date(jwtPayload.value.exp),
    });
  }

  function userLoginFailed(e: Error) {
    console.log(e);
  }

  function userRegisterSuccess(data: RegisterResponseData) {
    console.log("Registration successful:", data);
    // Nếu API trả về token luôn sau khi register, có thể tự động login
    // if (data.token) {
    //   userLoginSuccess(data);
    // }
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

  async function userLogin({
    email,
    password,
    rememberMe,
  }: RequestLoginPayload) {
    try {
      userLoginRequesting.value = true;
      const response = await apiStore.apiRequest<LoginResponseData>({
        method: "POST",
        endpoint: `${namespace}/login`,
        data: new authRequest.UserLogin({
          email,
          password,
        }).serialize(),
        proxy: false,
        auth: false,
      });

      userLoginSuccess(response.data);
      return response;
    } catch (e) {
      userLoginFailed(new Error(JSON.stringify(e)));
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
    userLogin,
    userRegister,
    userLogout,
  };
});

export default null;
