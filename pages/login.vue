<template>
  <Card class="w-full max-w-3xl overflow-hidden shadow-xl">
    <template #content>
      <div class="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0">
        <!-- Left side - Image -->
        <div class="hidden lg:block lg:w-80">
          <img
            src="../assets/images/travel_photo.png"
            alt="Travel Photo"
            class="w-full h-full object-cover rounded"
          />
        </div>

        <!-- Right side - Login Form -->
        <div class="p-8 lg:p-12 flex flex-col justify-center">
          <div class="max-w-md mx-auto w-full">
            <!-- Header -->
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Login</h1>
            <p class="text-gray-600 mb-4">
              Login to access your EasySet24 account
            </p>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
              <!-- Email Field -->
              <div class="space-y-2">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <CustomInputText
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  :invalid="!!emailError"
                  :show-clear="true"
                  @clear="clearEmail"
                />
                <small v-if="emailError" class="p-error">{{
                  emailError
                }}</small>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <CustomPassword
                  id="password"
                  v-model="password"
                  placeholder="Enter your password"
                  :invalid="!!passwordError"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearPassword"
                />
                <small v-if="passwordError" class="p-error">{{
                  passwordError
                }}</small>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Checkbox v-model="rememberMe" inputId="remember" binary />
                  <label for="remember" class="ml-2 text-sm text-gray-600">
                    Remember Me
                  </label>
                </div>
                <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
                  Forgot Password?
                </a>
              </div>

              <!-- Login Button -->
              <Button
                type="submit"
                label="Login"
                class="w-full text-white mb-4"
                :loading="isLoading"
                severity="info"
              />
            </form>

            <!-- Divider -->
            <!-- <Divider align="center" type="solid">
              <p>Or</p>
            </Divider> -->

            <!-- Register Link -->
            <div class="text-center">
              <span class="text-sm text-gray-600 mb-2 mt-4"
                >Don't have an account in EasySet24 yet?
              </span>
              <br />
              <a
                @click="register"
                class="text-sm cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
              >
                Register!
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Divider from "primevue/divider";
import CustomInputText from "~/components/shared/CustomInputText.vue";
import { useRouter } from "vue-router";
import CustomPassword from "~/components/shared/CustomPassword.vue";

definePageMeta({
  layout: "auth",
});

const router = useRouter();

// Form data
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);

// Validation errors
const emailError = ref("");
const passwordError = ref("");

// Form validation
const validateForm = () => {
  emailError.value = "";
  passwordError.value = "";

  if (!email.value) {
    emailError.value = "Email is required";
    return false;
  }

  if (!email.value.includes("@")) {
    emailError.value = "Please enter a valid email";
    return false;
  }

  if (!password.value) {
    passwordError.value = "Password is required";
    return false;
  }

  if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
    return false;
  }

  return true;
};

function register() {
  router.push({ name: "register" });
}

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Login attempt:", {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });

    // Handle successful login here
    alert("Login successful!");
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

// Clear functions
const clearEmail = () => {
  email.value = "";
};

const clearPassword = () => {
  password.value = "";
};
</script>

<style scoped>
/* Custom styles for PrimeVue components */
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
</style>
