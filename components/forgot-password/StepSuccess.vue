<template>
  <div class="space-y-6 animate-fadeIn">
    <div class="text-center">
      <div
        class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4 flex items-center justify-center"
      >
        <i class="pi pi-check text-4xl text-green-600" />
      </div>
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Password Reset Successful
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        Your password has been reset successfully. You can now log in with your
        new password.
      </p>
    </div>

    <Button
      label="Back to Login"
      icon="pi pi-sign-in"
      class="w-full py-3 text-base"
      @click="$emit('login')"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineEmits<{ login: [] }>();
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
