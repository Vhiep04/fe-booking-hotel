import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import type {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyResetOtpPayload,
} from "./interface/request/auth";
import type {
  ForgotPasswordResponseData,
  ResetPasswordResponseData,
  VerifyResetOtpResponseData,
} from "./interface/response/auth";

export const useForgotPasswordStore = defineStore("forgotPassword", () => {
  const apiStore = useApiStore();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const email = ref<string>("");
  const resetToken = ref<string>("");
  const expiresIn = ref<string>("");

  async function forgotPassword(payload: ForgotPasswordPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ForgotPasswordResponseData>({
        endpoint: "/api/Auth/forgot-password",
        method: "POST",
        data: payload,
      });

      if (response?.success) {
        email.value = payload.email;
        expiresIn.value = response.data?.expiresIn ?? "";
      } else {
        error.value = response?.message ?? "Failed to send OTP";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function verifyResetOtp(payload: VerifyResetOtpPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<VerifyResetOtpResponseData>({
        endpoint: "/api/Auth/verify-reset-otp",
        method: "POST",
        data: payload,
      });

      if (response?.success) {
        resetToken.value = response.data?.resetToken ?? "";
        expiresIn.value = response.data?.expiresIn ?? "";
      } else {
        error.value = response?.message ?? "OTP verification failed";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<ResetPasswordResponseData>({
        endpoint: "/api/Auth/reset-password",
        method: "POST",
        data: payload,
      });

      if (response?.success) {
        clearFlowState();
      } else {
        error.value = response?.message ?? "Failed to reset password";
      }

      return response;
    } catch (e: any) {
      error.value = e?.message ?? "An error occurred";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function clearFlowState() {
    email.value = "";
    resetToken.value = "";
    expiresIn.value = "";
  }

  function clearError() {
    error.value = null;
  }

  return {
    isLoading,
    error,
    email,
    resetToken,
    expiresIn,

    forgotPassword,
    verifyResetOtp,
    resetPassword,
    clearFlowState,
    clearError,
  };
});
