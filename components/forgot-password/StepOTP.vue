<template>
  <div class="space-y-5 animate-fadeIn">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      We've sent a verification code to
      <strong>{{ email }}</strong>
      <span v-if="expiresIn" class="block mt-1 text-amber-500 font-medium">
        <i class="pi pi-clock text-xs mr-1" />Expires in {{ expiresIn }}
      </span>
    </p>

    <div>
      <label
        for="otp"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Enter OTP Code
      </label>
      <div class="flex justify-center">
        <InputOtp
          id="otp"
          v-model="localOtp"
          type="text"
          :length="6"
          integerOnly
          :disabled="loading"
          :class="{ 'p-invalid': submitted && !localOtp }"
          @keyup.enter="submit"
        />
      </div>
      <small
        v-if="submitted && !localOtp"
        class="p-error text-red-500 block mt-1"
      >
        OTP is required
      </small>
    </div>

    <div class="flex gap-3">
      <Button
        label="Back"
        icon="pi pi-arrow-left"
        severity="secondary"
        :disabled="loading"
        class="flex-1 py-3"
        @click="$emit('back')"
      />
      <Button
        label="Verify OTP"
        icon="pi pi-check"
        :loading="loading"
        class="flex-1 py-3"
        @click="submit"
      />
    </div>

    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      Didn't receive OTP?
      <button
        type="button"
        :disabled="resendCountdown > 0 || loading"
        class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium disabled:text-gray-400 disabled:cursor-not-allowed ml-1"
        @click="$emit('resend')"
      >
        <span v-if="resendCountdown === 0">Resend OTP</span>
        <span v-else>Resend in {{ resendCountdown }}s</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { InputOtp } from "primevue";

const props = defineProps<{
  email: string;
  expiresIn: string;
  resendCountdown: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [otp: string];
  back: [];
  resend: [];
}>();

const localOtp = ref("");
const submitted = ref(false);

watch(
  () => props.email,
  () => {
    localOtp.value = "";
    submitted.value = false;
  },
);

function submit() {
  submitted.value = true;
  if (!localOtp.value) return;
  emit("submit", localOtp.value);
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
