<template>
  <header class="bg-gray-100 px-10 py-2">
    <div class="flex items-center justify-between">
      <!-- Logo Section -->
      <div class="flex items-center space-x-6">
        <img src="../../assets/images/logo_easyset24.svg" alt="" />
        <i
          v-if="!authStore.isAuthenticated"
          class="pi pi-question-circle cursor-pointer"
          style="font-size: 1.2rem"
        ></i>

        <img
          v-if="!authStore.isAuthenticated"
          src="../../assets/images/england-flag.svg"
          alt=""
        />
      </div>

      <div class="flex items-center">
        <CustomInputText
          id="search_global"
          v-model="search"
          type="text"
          placeholder="Search"
          :show-clear="true"
          @clear="clearSearch"
          width="50rem"
          class="bg-white"
        >
          <template #icon>
            <i class="pi pi-search" style="font-size: 1rem"></i>
          </template>
        </CustomInputText>
      </div>

      <!-- Authenticated User Section -->
      <div v-if="authStore.isAuthenticated" class="flex items-center space-x-5">
        <!-- Language Flag -->
        <button class="hover:opacity-80 transition-opacity">
          <img
            src="../../assets/images/england-flag.svg"
            alt="Language"
            class="w-8 h-6"
          />
        </button>

        <!-- Currency -->
        <button class="text-gray-700 hover:text-blue-600 transition-colors">
          <i class="pi pi-dollar" style="font-size: 1.2rem"></i>
        </button>

        <!-- Help/Support -->
        <button class="text-gray-700 hover:text-blue-600 transition-colors">
          <i class="pi pi-question-circle" style="font-size: 1.2rem"></i>
        </button>

        <!-- Favorites/Wishlist -->
        <button
          class="text-gray-700 hover:text-red-600 transition-colors relative"
        >
          <i class="pi pi-heart" style="font-size: 1.2rem"></i>
        </button>

        <!-- Phone/Contact -->
        <button class="text-gray-700 hover:text-blue-600 transition-colors">
          <i class="pi pi-phone" style="font-size: 1.2rem"></i>
        </button>

        <!-- User Profile Component -->
        <UserProfile
          :full-name="userData.fullName"
          :email="userData.email"
          :avatar-url="userData.avatarUrl"
          @my-account="handleMyAccount"
          @payments="handlePayments"
          @settings="handleSettings"
          @support="handleSupport"
          @sign-out="handleSignOut"
        />
      </div>

      <!-- Guest User Section -->
      <div v-else class="flex items-center space-x-3">
        <Button
          @click="login"
          label="Sign in"
          size="normal"
          severity="info"
          raised
          class="w-[150px] ring-offset-2 dark:ring-offset-surface-900 transition-all"
        />
        <Button
          @click="register"
          label="Register"
          size="normal"
          severity="info"
          raised
          class="w-[150px] ring-offset-2 dark:ring-offset-surface-900 transition-all"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CustomInputText from "./CustomInputText.vue";
import UserProfile from "../UserProfile.vue";
import { useApiStore } from "@/stores/api";
import { useAuthStore } from "@/stores/auth";
import { getCookie, deleteCookie } from "@/utils/storageHelper";
import type { UserInfoResponse } from "~/stores/interface/response/getUserInfo";

const router = useRouter();
const apiStore = useApiStore();
const authStore = useAuthStore();

const search = ref("");
const namespace = "/Auth";

const userData = reactive<UserInfoResponse>({
  fullName: "",
  avatarUrl: "",
  email: "",
  phoneNumber: "",
  birthDate: undefined,
});

const clearSearch = () => {
  search.value = "";
};

function login() {
  router.push({ name: "login" });
}

function register() {
  router.push({ name: "register" });
}

// Handle user menu actions
const handleMyAccount = () => {
  router.push({ name: "my-account" });
};

const handlePayments = () => {
  router.push({ name: "payments" });
};

const handleSettings = () => {
  router.push({ name: "settings" });
};

const handleSupport = () => {
  router.push({ name: "support" });
};

const handleSignOut = () => {
  // Clear auth state
  authStore.token = "";
  authStore.isAuthenticated = false;

  // Remove cookie
  deleteCookie("token");

  // Clear user data
  userData.fullName = "";
  userData.avatarUrl = "";
  userData.email = "";
  userData.phoneNumber = "";
  userData.birthDate = undefined;

  // Redirect to home or login
  router.push({ name: "login" });
};

const getUserInfo = async () => {
  try {
    const res = await apiStore.apiRequest<{
      success: boolean;
      data: UserInfoResponse;
    }>({
      method: "GET",
      endpoint: `${namespace}/me`,
      auth: true,
      proxy: false,
    });

    const payload = res.data;

    userData.fullName = payload.fullName;
    userData.avatarUrl = payload.avatarUrl ?? "";
    userData.email = payload.email ?? "";
    userData.phoneNumber = payload.phoneNumber ?? "";
    userData.birthDate = payload.birthDate ?? undefined;

    console.log("User info loaded:", userData);
  } catch (e) {
    console.error("getUserInfo error:", e);
  }
};

// Check authentication trước khi gọi API
onMounted(() => {
  const token = getCookie("token");

  if (token) {
    authStore.token = token;
    authStore.isAuthenticated = true;
    void getUserInfo();
  }
});

// Watch auth state để load user info khi login
watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    if (newVal) {
      void getUserInfo();
    } else {
      userData.fullName = "";
      userData.avatarUrl = "";
      userData.email = "";
      userData.phoneNumber = "";
      userData.birthDate = undefined;
    }
  }
);
</script>

<style scoped></style>
