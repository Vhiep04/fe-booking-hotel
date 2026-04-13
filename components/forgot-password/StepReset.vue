<template>
  <div class="space-y-5 animate-fadeIn">
    <!-- Password -->
    <div>
      <label class="block text-sm font-medium mb-2"> New Password </label>

      <Password
        v-model="newPassword"
        toggleMask
        :feedback="true"
        class="w-full"
        inputClass="w-full"
        panelClass="custom-password-panel"
        :appendTo="'self'"
        :class="{ 'p-invalid': submitted && !newPassword }"
      >
        <template #footer>
          <div class="mt-2">
            <div class="h-2 w-full bg-gray-200 rounded">
              <div
                class="h-2 rounded transition-all duration-300"
                :class="strengthBarClass"
                :style="{ width: strengthWidth }"
              ></div>
            </div>
          </div>
        </template>
      </Password>

      <!-- Required -->
      <small
        v-if="submitted && !newPassword"
        class="text-red-500 text-xs mt-1 block"
      >
        Password is required
      </small>

      <!-- Rule fail -->
      <small
        v-else-if="submitted && newPassword && !isValid"
        class="text-red-500 text-xs mt-1 block"
      >
        Password must include uppercase, lowercase, number, special character
        and be at least 6 characters
      </small>
    </div>

    <div class="w-full">
      <label class="block text-sm font-medium mb-2"> Confirm Password </label>

      <Password
        v-model="confirmPassword"
        :feedback="false"
        toggleMask
        class="w-full"
        inputClass="w-full"
        :class="{
          'p-invalid': submitted && (!confirmPassword || passwordMismatch),
        }"
      />

      <small
        v-if="submitted && !confirmPassword"
        class="text-red-500 text-xs mt-1 block"
      >
        Confirm password is required
      </small>

      <small
        v-else-if="submitted && passwordMismatch"
        class="text-red-500 text-xs mt-1 block"
      >
        Passwords do not match
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
        label="Reset Password"
        icon="pi pi-check"
        :loading="loading"
        class="flex-1 py-3"
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Password from "primevue/password";
import Button from "primevue/button";

const props = defineProps<{ loading: boolean }>();
const emit = defineEmits(["submit", "back"]);

const submitted = ref(false);

function submit() {
  submitted.value = true;

  if (!newPassword.value) return;
  if (!confirmPassword.value) return;
  if (!isValid.value) return;
  if (passwordMismatch.value) return;

  emit("submit", {
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  });
}
const newPassword = ref("");
const confirmPassword = ref("");

const rules = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /\d/,
  special: /[^A-Za-z\d]/,
  length: /^.{6,}$/,
};

const check = (regex: RegExp) => regex.test(newPassword.value);

const score = computed(() => {
  let s = 0;
  if (check(rules.upper)) s++;
  if (check(rules.lower)) s++;
  if (check(rules.number)) s++;
  if (check(rules.special)) s++;
  if (check(rules.length)) s++;
  return s;
});

const strengthWidth = computed(() => {
  return `${(score.value / 5) * 100}%`;
});

const strengthBarClass = computed(() => {
  if (score.value <= 2) return "bg-red-500";
  if (score.value <= 4) return "bg-yellow-500";
  return "bg-green-500";
});

const passwordMismatch = computed(
  () => confirmPassword.value && newPassword.value !== confirmPassword.value,
);

const isValid = computed(() => score.value === 5);

const canSubmit = computed(() => isValid.value && !passwordMismatch.value);
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

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

/* Đảm bảo component wrapper rộng 100% */
:deep(.p-password) {
  width: 100%;
}

/* Ẩn các thành phần mặc định của PrimeVue bên trong Panel */
:deep(.p-password-meter),
:deep(.p-password-info) {
  display: none !important;
}

/* Tùy chỉnh panel nếu cần */
:deep(.p-password-panel) {
  min-width: 100%;
}
</style>
