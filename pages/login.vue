<template>
  <Card class="w-full max-w-3xl overflow-hidden shadow-2xl">
    <template #content>
      <div class="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0">
        <!-- Left side - Image -->
        <div class="hidden lg:block lg:w-80">
          <img
            src="../assets/images/travel_photo.png"
            :alt="t('Travel Photo')"
            class="w-full h-full object-cover rounded"
          />
        </div>

        <!-- Right side - Login Form -->
        <div class="p-8 lg:p-12 flex flex-col justify-center">
          <div class="max-w-md mx-auto w-full">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ t("Login") }}
            </h1>
            <p class="text-gray-600 mb-4">
              {{ t("Login to access your EasySet24 account") }}
            </p>

            <form @submit.prevent="handleLogin">
              <div class="space-y-2">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <CustomInputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  :placeholder="t('Enter your email')"
                  :invalid="!!emailError"
                  :show-clear="true"
                  @clear="clearEmail"
                />
                <small class="block min-h-5 text-red-500">{{
                  emailError || ""
                }}</small>
              </div>

              <div class="space-y-2">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >{{ t("Password") }}</label
                >
                <CustomPassword
                  id="password"
                  v-model="form.password"
                  :placeholder="t('Enter your password')"
                  :invalid="!!passwordError"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearPassword"
                />
                <small class="block min-h-5 text-red-500">{{
                  passwordError || ""
                }}</small>
              </div>

              <div class="flex items-center justify-end">
                <a
                  href="/forgot-password"
                  class="text-sm text-blue-600 hover:text-blue-500"
                >
                  {{ t("Forgot Password?") }}
                </a>
              </div>

              <Button
                type="submit"
                :label="t('Login')"
                class="w-full text-white mb-4 mt-4"
                :loading="isLoading"
                severity="info"
              />
            </form>

            <Divider align="center" type="solid">
              <span class="text-sm text-gray-400 px-2">{{ t("Or") }}</span>
            </Divider>

            <!-- Google Login Button -->
            <button
              type="button"
              class="google-btn w-full flex items-center justify-center gap-3 mt-3 mb-4"
              :disabled="authStore.googleLoginRequesting"
              @click="handleGoogleLogin"
            >
              <span
                v-if="authStore.googleLoginRequesting"
                class="google-spinner"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="text-sm font-medium text-gray-700">
                {{
                  authStore.googleLoginRequesting
                    ? t("Signing in...")
                    : t("Sign in with Google")
                }}
              </span>
            </button>

            <div class="text-center">
              <span class="text-sm text-gray-600 mb-2 mt-4">{{
                t("Don't have an EasySet24 account yet?")
              }}</span>
              <br />
              <NuxtLink
                to="/register"
                class="text-sm cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
              >
                {{ t("Register!") }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import Divider from "primevue/divider";
import CustomInputText from "~/components/shared/CustomInputText.vue";
import { useRouter } from "vue-router";
import CustomPassword from "~/components/shared/CustomPassword.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const { t } = useI18n();

useHead({
  title: t("Login"),
  script: [
    { src: "https://accounts.google.com/gsi/client", async: true, defer: true },
  ],
});

let toast: ReturnType<typeof useToast> | null = null;

definePageMeta({ layout: "auth" });

const router = useRouter();
const authStore = useAuthStore();

const form = ref({ email: "", password: "" });
const rememberMe = ref(false);
const isLoading = ref(false);
const emailError = ref("");
const passwordError = ref("");

const validateForm = () => {
  emailError.value = "";
  passwordError.value = "";

  if (!form.value.email) {
    emailError.value = t("Email is required");
    return false;
  }
  if (!form.value.email.includes("@")) {
    emailError.value = t("Please enter a valid email");
    return false;
  }
  if (!form.value.password) {
    passwordError.value = t("Password is required");
    return false;
  }
  if (form.value.password.length < 6) {
    passwordError.value = t("Password must be at least 6 characters");
    return false;
  }
  return true;
};

const redirectAfterLogin = () => {
  if (authStore.isAdmin || authStore.isManager) {
    router.push({ path: "/admin" });
  } else {
    router.push({ path: "/" });
  }
};

const handleLogin = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  try {
    const res = await authStore.userLogin({
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
      rememberMe: rememberMe.value,
    });

    if (res.success) {
      toast?.add({
        severity: "success",
        summary: t("Success"),
        detail: res.message,
        life: 3000,
      });
      if (authStore.isAuthenticated) redirectAfterLogin();
    }
  } catch (error: any) {
    console.error("Login error:", error);
    let errorMessage = t("Invalid email or password");
    if (error?.data) {
      errorMessage = error.data.message || errorMessage;
      if (error.data.requiresVerification) {
        toast?.add({
          severity: "error",
          summary: t("Email Verification Required"),
          detail: error.data.message,
          life: 5000,
        });
        return;
      }
    }
    toast?.add({
      severity: "error",
      summary: t("Error"),
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  // @ts-ignore
  if (typeof google === "undefined") {
    toast?.add({
      severity: "error",
      summary: t("Error"),
      detail: t("Google login is not available. Please try again."),
      life: 3000,
    });
    return;
  }
  // @ts-ignore
  const client = google.accounts.oauth2.initCodeClient({
    client_id: useRuntimeConfig().public.googleClientId,
    scope: "openid email profile",
    ux_mode: "popup",
    callback: async (response: any) => {
      try {
        const res = await authStore.loginWithGoogleCode(response.code);
        if (res?.success) {
          toast?.add({
            severity: "success",
            summary: t("Success"),
            detail: t("Google login successful!"),
            life: 3000,
          });
          redirectAfterLogin();
        }
      } catch (error: any) {
        const errorMessage = error?.data?.message || t("Google login failed.");
        toast?.add({
          severity: "error",
          summary: t("Error"),
          detail: errorMessage,
          life: 3000,
        });
      }
    },
  });
  client.requestCode();
};

const clearEmail = () => {
  form.value.email = "";
  emailError.value = "";
};
const clearPassword = () => {
  form.value.password = "";
  passwordError.value = "";
};

onMounted(() => {
  toast = useToast();
});
</script>

<style scoped>
:deep(.p-card) {
  border-radius: 12px;
  border: none;
}
:deep(.p-card-content) {
  padding: 0;
}
:deep(.p-inputtext) {
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
}
:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
:deep(.p-password input) {
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  width: 100%;
}
:deep(.p-password:not(.p-disabled).p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
:deep(.p-button:hover) {
  background: #2563eb;
}
:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
  border: 1px solid #d1d5db;
}
:deep(.p-invalid) {
  border-color: #ef4444 !important;
}
:deep(.p-error) {
  color: #ef4444;
  font-size: 0.875rem;
}
.google-btn {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}
.google-btn:hover:not(:disabled) {
  background: #f9fafb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.google-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-top-color: #4285f4;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
