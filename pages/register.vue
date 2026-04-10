<template>
  <Card class="w-full max-w-4xl overflow-hidden shadow-xl">
    <template #content>
      <div class="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0">
        <div class="hidden lg:block lg:w-80">
          <img
            src="../assets/images/travel_photo.png"
            alt="Travel Photo"
            class="w-full h-full object-cover rounded"
          />
        </div>

        <div class="flex flex-col justify-center py-6">
          <div class="max-w-md mx-auto w-full">
            <h1 class="text-xl font-bold text-gray-900 mb-1">Register</h1>
            <p class="text-sm text-gray-600 mb-3">
              Create your EasySet24 account
            </p>

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" class="space-y-2">
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <CustomInputText
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    placeholder="First name"
                    :invalid="!!formErrors.firstName"
                    :show-clear="true"
                    @clear="clearField('firstName')"
                  />
                  <small class="block min-h-4 text-xs text-red-500">
                    {{ formErrors.firstName || "" }}
                  </small>
                </div>

                <div class="space-y-1">
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <CustomInputText
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    placeholder="Last name"
                    :invalid="!!formErrors.lastName"
                    :show-clear="true"
                    @clear="clearField('lastName')"
                  />
                  <small class="block min-h-4 text-xs text-red-500">
                    {{ formErrors.lastName || "" }}
                  </small>
                </div>
              </div>

              <div class="space-y-1">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <CustomInputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  :invalid="!!formErrors.email"
                  :show-clear="true"
                  @clear="clearField('email')"
                />
                <small class="block min-h-4 text-xs text-red-500">
                  {{ formErrors.email || "" }}
                </small>
              </div>

              <div class="space-y-1">
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <CustomInputText
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  type="text"
                  placeholder="Phone number"
                  :invalid="!!formErrors.phoneNumber"
                  :show-clear="true"
                  @clear="clearField('phoneNumber')"
                />
                <small class="block min-h-4 text-xs text-red-500">
                  {{ formErrors.phoneNumber || "" }}
                </small>
              </div>

              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <CustomPassword
                  id="password"
                  v-model="form.password"
                  placeholder="Password"
                  :invalid="!!formErrors.password"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearField('password')"
                />
                <small class="block min-h-4 text-xs text-red-500">
                  {{ formErrors.password || "" }}
                </small>
              </div>

              <div class="space-y-1">
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <CustomPassword
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  placeholder="Confirm Password"
                  :invalid="!!formErrors.confirmPassword"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearField('confirmPassword')"
                />
                <small class="block min-h-4 text-xs text-red-500">
                  {{ formErrors.confirmPassword || "" }}
                </small>
              </div>

              <Button
                type="submit"
                label="Register Now"
                class="w-full text-white mt-3"
                :loading="isLoading"
                severity="info"
              />
            </form>

            <div class="text-center mt-3">
              <span class="text-sm text-gray-600">
                Already have an account?
              </span>
              <a
                @click="login"
                class="text-sm cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Dialog
    v-model:visible="visible"
    modal
    header="Verify Email"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Message
    </span>
    <div class="flex justify-center items-center gap-4 mb-4">
      <InputOtp :length="6" v-model="otpCode" integerOnly />
    </div>
    <div class="mb-5 mt-5">
      <p>
        DO you received OTP?
        <u
          @click="resendOtpCode"
          class="text-blue-500 hover:text-blue-800 hover:cursor-pointer"
          >Resend OTP</u
        >
      </p>
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
      ></Button>
      <Button type="button" label="Confirm" @click="sendOtpCode"></Button>
    </div>
  </Dialog>
  <Toast />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import CustomInputText from "@/components/shared/CustomInputText.vue";
import { useRouter } from "vue-router";
import CustomPassword from "~/components/shared/CustomPassword.vue";
import { useAuthStore } from "@/stores/auth";
import { Dialog, InputOtp, Toast } from "primevue";
import { useToast } from "primevue/usetoast";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: t("Register"),
});

let toast: ReturnType<typeof useToast> | null = null;

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();
const visible = ref(false);
const otpCode = ref();
const router = useRouter();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const formErrors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);

const resetErrors = () => {
  Object.keys(formErrors).forEach((key) => {
    formErrors[key as keyof typeof formErrors] = "";
  });
};

const validateForm = (): boolean => {
  resetErrors();
  let isValid = true;

  if (!form.firstName.trim()) {
    formErrors.firstName = "First name is required";
    isValid = false;
  }

  if (!form.lastName.trim()) {
    formErrors.lastName = "Last name is required";
    isValid = false;
  }

  if (!form.email) {
    formErrors.email = "Email is required";
    isValid = false;
  } else if (!form.email.includes("@")) {
    formErrors.email = "Please enter a valid email";
    isValid = false;
  }

  if (!form.phoneNumber) {
    formErrors.phoneNumber = "Phone number is required";
    isValid = false;
  } else if (!/^\d{10}$/.test(form.phoneNumber)) {
    formErrors.phoneNumber = "Please enter a valid phone number (10 digits)";
    isValid = false;
  }

  if (!form.password) {
    formErrors.password = "Password is required";
    isValid = false;
  } else if (form.password.length < 6) {
    formErrors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  if (!form.confirmPassword) {
    formErrors.confirmPassword = "Please confirm your password";
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    formErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  return isValid;
};

const clearField = (fieldName: keyof typeof form) => {
  form[fieldName] = "";
  formErrors[fieldName] = "";
};

const login = () => {
  router.push({ name: "login" });
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const response = await authStore.userRegister({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phoneNumber: form.phoneNumber.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    if (response?.success) {
      toast?.add({
        severity: "success",
        summary: "Message",
        detail: response?.message,
        life: 5000,
      });
      visible.value = true;
    } else {
      toast?.add({
        severity: "error",
        summary: "Message",
        detail: response?.message,
        life: 5000,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    isLoading.value = false;
  }
};

const sendOtpCode = async () => {
  const res = await authStore.sendOtpVerify({
    otpCode: otpCode.value,
    email: form.email.trim().toLowerCase(),
  });
  isLoading.value = true;
  try {
    if (res?.success) {
      visible.value = false;
      toast?.add({
        severity: "success",
        summary: "Message",
        detail: res?.message,
        life: 3000,
      });
      router.push({ path: "/login" });
    } else {
      toast?.add({
        severity: "error",
        summary: "Message",
        detail: res?.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Send otp error:", error);
    let errorMessage = "An unexpected error occurred";
    if (error) {
      errorMessage = res?.message || errorMessage;
      toast?.add({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const resendOtpCode = async () => {
  isLoading.value = true;
  try {
    const res = await authStore.resendOtpVerify({
      email: form.email.trim().toLowerCase(),
    });
    if (res?.success) {
      toast?.add({
        severity: "success",
        summary: "Message",
        detail: res?.message,
        life: 3000,
      });
    } else {
      toast?.add({
        severity: "error",
        summary: "Message",
        detail: res?.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Send otp error:", error);
  } finally {
    isLoading.value = false;
  }
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
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.p-password input) {
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  width: 100%;
  font-size: 0.875rem;
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

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight) {
  background: #3b82f6;
  border-color: #3b82f6;
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-error) {
  color: #ef4444;
  font-size: 0.875rem;
}
</style>
