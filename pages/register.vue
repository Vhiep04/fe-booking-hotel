<template>
  <Card class="w-full max-w-4xl overflow-hidden shadow-xl">
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

        <!-- Right side - Register Form -->
        <div class="flex flex-col justify-center py-6">
          <div class="max-w-md mx-auto w-full">
            <!-- Header -->
            <h1 class="text-xl font-bold text-gray-900 mb-1">Register</h1>
            <p class="text-sm text-gray-600 mb-3">
              Create your EasySet24 account
            </p>

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" class="space-y-2">
              <!-- Name Fields Row -->
              <div class="grid grid-cols-2 gap-3">
                <!-- First Name Field -->
                <div class="space-y-1">
                  <label
                    for="firstName"
                    class="block text-xs font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <CustomInputText
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    placeholder="First name"
                    :invalid="!!firstNameError"
                    :show-clear="true"
                    @clear="clearFirstName"
                  />
                  <small class="block min-h-[16px] text-xs text-red-500">
                    {{ firstNameError || "" }}
                  </small>
                </div>

                <!-- Last Name Field -->
                <div class="space-y-1">
                  <label
                    for="lastName"
                    class="block text-xs font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <CustomInputText
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    placeholder="Last name"
                    :invalid="!!lastNameError"
                    :show-clear="true"
                    @clear="clearLastName"
                  />
                  <small class="block min-h-[16px] text-xs text-red-500">
                    {{ lastNameError || "" }}
                  </small>
                </div>
              </div>

              <!-- Email Field -->
              <div class="space-y-1">
                <label
                  for="email"
                  class="block text-xs font-medium text-gray-700"
                  >Email</label
                >
                <CustomInputText
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  :invalid="!!emailError"
                  :show-clear="true"
                  @clear="clearEmail"
                />
                <small class="block min-h-[16px] text-xs text-red-500">
                  {{ emailError || "" }}
                </small>
              </div>

              <!-- PhoneNumber Field -->
              <div class="space-y-1">
                <label
                  for="phone"
                  class="block text-xs font-medium text-gray-700"
                  >Phone number</label
                >
                <CustomInputText
                  id="phoneNumber"
                  v-model="phoneNumber"
                  type="text"
                  placeholder="Phone number"
                  :invalid="!!phoneNumberError"
                  :show-clear="true"
                  @clear="clearPhoneNumber"
                />
                <small class="block min-h-[16px] text-xs text-red-500">
                  {{ phoneNumberError || "" }}
                </small>
              </div>

              <!-- Password Field -->
              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-xs font-medium text-gray-700"
                >
                  Password
                </label>
                <CustomPassword
                  id="password"
                  v-model="password"
                  placeholder="Password"
                  :invalid="!!passwordError"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearPassword"
                />
                <small class="block min-h-[16px] text-xs text-red-500">
                  {{ passwordError || "" }}
                </small>
              </div>

              <!-- Confirm Password Field -->
              <div class="space-y-1">
                <label
                  for="confirmPassword"
                  class="block text-xs font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <CustomPassword
                  id="confirmPassword"
                  v-model="confirmPassword"
                  placeholder="Confirm Password"
                  :invalid="!!confirmPasswordError"
                  :show-clear="true"
                  :toggle-mask="true"
                  @clear="clearConfirmPassword"
                />
                <small class="block min-h-[16px] text-xs text-red-500">
                  {{ confirmPasswordError || "" }}
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

            <!-- Login Link -->
            <div class="text-center mt-3">
              <span class="text-xs text-gray-600"
                >Already have an account?
              </span>
              <a
                @click="login"
                class="text-xs cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
              >
                Login
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
import CustomInputText from "@/components/shared/CustomInputText.vue";
import { useRouter } from "vue-router";
import CustomPassword from "~/components/shared/CustomPassword.vue";

definePageMeta({
  layout: "auth",
});

const router = useRouter();

// Form data
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeTerms = ref(false);
const isLoading = ref(false);

// Validation errors
const firstNameError = ref("");
const lastNameError = ref("");
const emailError = ref("");
const phoneNumberError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const termsError = ref("");

// Form validation
const validateForm = () => {
  // Reset errors
  firstNameError.value = "";
  lastNameError.value = "";
  emailError.value = "";
  phoneNumberError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";
  termsError.value = "";

  let isValid = true;

  // First name validation
  if (!firstName.value.trim()) {
    firstNameError.value = "First name is required";
    isValid = false;
  }

  // Last name validation
  if (!lastName.value.trim()) {
    lastNameError.value = "Last name is required";
    isValid = false;
  }

  // Email validation
  if (!email.value) {
    emailError.value = "Email is required";
    isValid = false;
  } else if (!email.value.includes("@")) {
    emailError.value = "Please enter a valid email";
    isValid = false;
  }

  // PhoneNumber validation
  if (!phoneNumber.value) {
    phoneNumberError.value = "Phone number is required";
    isValid = false;
  } else if (!/^\d{10}$/.test(phoneNumber.value)) {
    phoneNumberError.value = "Please enter a valid phone number (10 digits)";
    isValid = false;
  }

  // Password validation
  if (!password.value) {
    passwordError.value = "Password is required";
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
    isValid = false;
  }

  // Confirm password validation
  if (!confirmPassword.value) {
    confirmPasswordError.value = "Please confirm your password";
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Passwords do not match";
    isValid = false;
  }

  // Terms validation
  if (!agreeTerms.value) {
    termsError.value = "You must agree to the terms and privacy policies";
    isValid = false;
  }

  return isValid;
};

// Navigation functions
function login() {
  router.push({ name: "login" });
}

// Handle registration
const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Registration attempt:", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      password: password.value,
      agreeTerms: agreeTerms.value,
    });

    // Handle successful registration here
    alert(
      "Registration successful! Please check your email to verify your account."
    );

    // Redirect to login or dashboard
    router.push({ name: "login" });
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

// Clear functions
const clearFirstName = () => {
  firstName.value = "";
};

const clearLastName = () => {
  lastName.value = "";
};

const clearEmail = () => {
  email.value = "";
};

const clearPhoneNumber = () => {
  phoneNumber.value = "";
};

const clearPassword = () => {
  password.value = "";
};

const clearConfirmPassword = () => {
  confirmPassword.value = "";
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
