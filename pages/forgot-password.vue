<template>
  <div class="relative w-full max-w-md">
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div
        class="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-10 text-center"
      >
        <div
          class="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm"
        >
          <i
            :class="[
              'text-4xl text-white',
              step === 1
                ? 'pi pi-envelope'
                : step === 2
                  ? 'pi pi-shield'
                  : step === 3
                    ? 'pi pi-lock'
                    : 'pi pi-check-circle',
            ]"
          />
        </div>
        <h1 class="text-2xl font-bold text-white mb-1">Reset Password</h1>
        <p class="text-blue-100 text-sm">
          <span v-if="step === 1">Enter your email address</span>
          <span v-else-if="step === 2">Verify your OTP code</span>
          <span v-else-if="step === 3">Set your new password</span>
          <span v-else>Password reset successful</span>
        </p>
      </div>

      <div class="px-8 pt-6 pb-4">
        <div class="flex gap-2">
          <div
            v-for="n in 4"
            :key="n"
            :class="[
              'h-1 flex-1 rounded-full transition-all duration-500',
              n <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700',
            ]"
          />
        </div>
      </div>

      <div class="px-8">
        <Message
          v-if="localError"
          severity="error"
          :closable="false"
          class="mb-4"
        >
          {{ localError }}
        </Message>
        <Message
          v-if="successMessage"
          severity="success"
          :closable="false"
          class="mb-4"
        >
          {{ successMessage }}
        </Message>
      </div>

      <div class="px-8 pb-8">
        <StepEmail
          v-if="step === 1"
          :loading="store.isLoading"
          @submit="handleSendOtp"
        />
        <StepOTP
          v-else-if="step === 2"
          :email="store.email"
          :expires-in="store.expiresIn"
          :resend-countdown="resendCountdown"
          :loading="store.isLoading"
          @submit="handleVerifyOtp"
          @back="goBack"
          @resend="handleResendOtp"
        />
        <StepReset
          v-else-if="step === 3"
          :loading="store.isLoading"
          @submit="handleResetPassword"
          @back="goBack"
        />
        <StepSuccess v-else @login="goToLogin" />
      </div>
    </div>

    <div class="text-center mt-6">
      <NuxtLink
        to="/login"
        class="text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-2"
      >
        <i class="pi pi-arrow-left text-sm" />
        Back to login
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Message from "primevue/message";
import StepEmail from "~/components/forgot-password/StepEmail.vue";
import StepOTP from "~/components/forgot-password/StepOTP.vue";
import StepReset from "~/components/forgot-password/StepReset.vue";
import StepSuccess from "~/components/forgot-password/StepSuccess.vue";

const { t } = useI18n();
useHead({ title: t("Forgot Password") });
definePageMeta({ layout: "auth" });

const store = useForgotPasswordStore();

const step = ref(1);
const successMessage = ref("");
const localError = ref("");
const resendCountdown = ref(0);

function clearMessages() {
  store.clearError();
  successMessage.value = "";
  localError.value = "";
}

function startResendCountdown() {
  resendCountdown.value = 60;
  const interval = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value === 0) clearInterval(interval);
  }, 1000);
}

async function handleSendOtp(email: string) {
  clearMessages();
  const res = await store.forgotPassword({ email });

  if (res?.success) {
    successMessage.value = "OTP sent to your email";
    step.value = 2;
    startResendCountdown();
  }
}

async function handleVerifyOtp(otp: string) {
  clearMessages();
  const res = await store.verifyResetOtp({ email: store.email, otpCode: otp });

  if (res?.success) {
    successMessage.value = "OTP verified successfully";
    step.value = 3;
  }
}

async function handleResendOtp() {
  clearMessages();
  const res = await store.forgotPassword({ email: store.email });
  if (res?.success) {
    successMessage.value = "OTP resent to your email";
    startResendCountdown();
  }
}

async function handleResetPassword(payload: {
  newPassword: string;
  confirmPassword: string;
}) {
  clearMessages();
  if (payload.newPassword.length < 8) {
    localError.value = "Password must be at least 8 characters long";
    return;
  }
  const res = await store.resetPassword({
    email: store.email,
    resetToken: store.resetToken,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
  if (res?.success) step.value = 4;
}

function goBack() {
  clearMessages();
  if (step.value > 1) step.value--;
}

function goToLogin() {
  store.clearFlowState();
  navigateTo("/login");
}

onUnmounted(() => store.clearFlowState());
</script>
