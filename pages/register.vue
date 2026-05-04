<template>
  <Card class="w-full max-w-4xl overflow-hidden shadow-xl">
    <template #content>
      <div class="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0">
        <div class="hidden lg:block lg:w-80">
          <img
            src="../assets/images/travel_photo.png"
            :alt="t('Travel photo')"
            class="w-full h-full object-cover rounded"
          />
        </div>

        <div class="flex flex-col justify-center py-6">
          <div class="max-w-md mx-auto w-full">
            <h1 class="text-xl font-bold text-gray-900 mb-1">
              {{ t("Register") }}
            </h1>
            <p class="text-sm text-gray-600 mb-3">
              {{ t("Create your EasySet24 account") }}
            </p>

            <form @submit.prevent="handleRegister" class="space-y-2">
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700">{{
                    t("First name")
                  }}</label>
                  <CustomInputText
                    v-model="form.firstName"
                    type="text"
                    :placeholder="t('Enter first name')"
                    :invalid="!!formErrors.firstName"
                    :show-clear="true"
                    @clear="clearField('firstName')"
                  />
                  <small class="block min-h-4 text-xs text-red-500">{{
                    formErrors.firstName || ""
                  }}</small>
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700">{{
                    t("Last name")
                  }}</label>
                  <CustomInputText
                    v-model="form.lastName"
                    type="text"
                    :placeholder="t('Enter last name')"
                    :invalid="!!formErrors.lastName"
                    :show-clear="true"
                    @clear="clearField('lastName')"
                  />
                  <small class="block min-h-4 text-xs text-red-500">{{
                    formErrors.lastName || ""
                  }}</small>
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <CustomInputText
                  v-model="form.email"
                  type="email"
                  :placeholder="t('Enter email')"
                  :invalid="!!formErrors.email"
                  :show-clear="true"
                  @clear="clearField('email')"
                />
                <small class="block min-h-4 text-xs text-red-500">{{
                  formErrors.email || ""
                }}</small>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">{{
                  t("Phone number")
                }}</label>
                <CustomInputText
                  v-model="form.phoneNumber"
                  type="text"
                  :placeholder="t('Enter phone number')"
                  :invalid="!!formErrors.phoneNumber"
                  :show-clear="true"
                  @clear="clearField('phoneNumber')"
                />
                <small class="block min-h-4 text-xs text-red-500">{{
                  formErrors.phoneNumber || ""
                }}</small>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">{{
                  t("Password")
                }}</label>
                <CustomPassword
                  v-model="form.password"
                  :placeholder="t('Enter password')"
                  :invalid="!!formErrors.password"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearField('password')"
                />
                <small class="block min-h-4 text-xs text-red-500">{{
                  formErrors.password || ""
                }}</small>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">{{
                  t("Confirm password")
                }}</label>
                <CustomPassword
                  v-model="form.confirmPassword"
                  :placeholder="t('Re-enter password')"
                  :invalid="!!formErrors.confirmPassword"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearField('confirmPassword')"
                />
                <small class="block min-h-4 text-xs text-red-500">{{
                  formErrors.confirmPassword || ""
                }}</small>
              </div>

              <Button
                type="submit"
                :label="t('Register now')"
                class="w-full text-white mt-3"
                :loading="isLoading"
                severity="info"
              />
            </form>

            <div class="text-center mt-3 flex justify-center gap-2">
              <span class="text-sm text-gray-600"
                >{{ t("Already have an account?") }}
              </span>
              <a
                @click="login"
                class="text-sm cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
              >
                {{ t("Sign in") }}
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
    :header="t('Email Verification')"
    :style="{ width: '25rem' }"
  >
    <span class="block mb-8">{{
      t("Enter the OTP code sent to your email")
    }}</span>

    <div class="flex justify-center items-center gap-4 mb-4">
      <InputOtp :length="6" v-model="otpCode" integerOnly />
    </div>

    <div class="mb-5 mt-5">
      <p>
        {{ t("Didn't receive the OTP?") }}
        <u
          @click="resendOtpCode"
          class="text-blue-500 hover:text-blue-800 hover:cursor-pointer"
        >
          {{ t("Resend OTP") }}
        </u>
      </p>
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        :label="t('Cancel')"
        severity="secondary"
        @click="visible = false"
      />
      <Button type="button" :label="t('Confirm')" @click="sendOtpCode" />
    </div>
  </Dialog>

  <Toast />
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import CustomInputText from "@/components/shared/CustomInputText.vue";
import { useRouter } from "vue-router";
import CustomPassword from "~/components/shared/CustomPassword.vue";
import { useAuthStore } from "@/stores/auth";
import { Dialog, InputOtp, Toast } from "primevue";
import { useToast } from "primevue/usetoast";

let toast: ReturnType<typeof useToast> | null = null;

definePageMeta({ layout: "auth" });

const { t } = useI18n();

useHead({ title: t("Register") });

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
    formErrors.firstName = t("First name is required");
    isValid = false;
  }
  if (!form.lastName.trim()) {
    formErrors.lastName = t("Last name is required");
    isValid = false;
  }
  if (!form.email) {
    formErrors.email = t("Email is required");
    isValid = false;
  } else if (!form.email.includes("@")) {
    formErrors.email = t("Invalid email");
    isValid = false;
  }
  if (!form.phoneNumber) {
    formErrors.phoneNumber = t("Phone number is required");
    isValid = false;
  } else if (!/^\d{10}$/.test(form.phoneNumber)) {
    formErrors.phoneNumber = t("Phone number must be 10 digits");
    isValid = false;
  }
  if (!form.password) {
    formErrors.password = t("Password is required");
    isValid = false;
  } else if (form.password.length < 6) {
    formErrors.password = t("Password must be at least 6 characters");
    isValid = false;
  }
  if (!form.confirmPassword) {
    formErrors.confirmPassword = t("Please confirm your password");
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    formErrors.confirmPassword = t("Passwords do not match");
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
        summary: t("Notice"),
        detail: response?.message,
        life: 5000,
      });
      visible.value = true;
    } else {
      toast?.add({
        severity: "error",
        summary: t("Notice"),
        detail: response?.message,
        life: 5000,
      });
    }
  } catch (error) {
    console.error("Register error:", error);
  } finally {
    isLoading.value = false;
  }
};

const sendOtpCode = async () => {
  isLoading.value = true;
  try {
    const res = await authStore.sendOtpVerify({
      otpCode: otpCode.value,
      email: form.email.trim().toLowerCase(),
    });
    if (res?.success) {
      visible.value = false;
      toast?.add({
        severity: "success",
        summary: t("Notice"),
        detail: res?.message,
        life: 3000,
      });
      router.push({ path: "/login" });
    } else {
      toast?.add({
        severity: "error",
        summary: t("Notice"),
        detail: res?.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("OTP verify error:", error);
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
        summary: t("Notice"),
        detail: res?.message,
        life: 3000,
      });
    } else {
      toast?.add({
        severity: "error",
        summary: t("Notice"),
        detail: res?.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  toast = useToast();
});
</script>
