<template>
  <div class="space-y-5 animate-fadeIn">
    <div>
      <label
        for="email"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Email Address
      </label>
      <IconField class="w-full">
        <InputIcon class="pi pi-envelope" />
        <InputText
          id="email"
          v-model="localEmail"
          type="email"
          placeholder="you@example.com"
          class="w-full"
          :disabled="loading"
          :class="{ 'p-invalid': submitted && !localEmail }"
          @keyup.enter="submit"
        />
      </IconField>
      <small
        v-if="submitted && !localEmail"
        class="p-error text-red-500 block mt-1"
      >
        Email is required
      </small>
    </div>

    <Button
      label="Send OTP"
      icon="pi pi-send"
      :loading="loading"
      class="w-full py-3 text-base"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";

const props = defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [email: string];
}>();

const localEmail = ref("");
const submitted = ref(false);

function submit() {
  submitted.value = true;
  if (!localEmail.value) return;
  emit("submit", localEmail.value);
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
