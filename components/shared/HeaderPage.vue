<template>
  <header class="bg-gray-100 px-10 py-2">
    <div class="flex items-center justify-between">
      <!-- Logo Section -->
      <div class="flex items-center space-x-6">
        <img src="../../assets/images/logo_easyset24.svg" alt="" />
        <i
          v-if="!storeOfAuth.isAuthenticated"
          class="pi pi-question-circle cursor-pointer"
          style="font-size: 1.2rem"
        ></i>

        <img
          v-if="!storeOfAuth.isAuthenticated"
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
        >
          <template #icon>
            <i class="pi pi-search" style="font-size: 1rem"></i>
          </template>
        </CustomInputText>
      </div>

      <!-- Authenticated User Section -->
      <div
        v-if="storeOfAuth.isAuthenticated"
        class="flex items-center space-x-5"
      >
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

        <!-- User Profile -->
        <button
          @click="toggleUserMenu"
          class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Avatar
            :image="userAvatar"
            shape="circle"
            size="large"
            class="border-2 border-gray-200"
          />
          <div class="text-left">
            <div class="text-sm font-semibold text-blue-600">Your Account</div>
            <div class="text-xs text-gray-600">{{ userName }}</div>
          </div>
        </button>
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
import { Button, Avatar } from "primevue";
import CustomInputText from "./CustomInputText.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const storeOfAuth = useAuthStore();

const search = ref("");

// User data - lấy từ store
const userName = computed(() => storeOfAuth.user?.name || "Anna Carina");
const userAvatar = computed(
  () => storeOfAuth.user?.avatar || "../assets/images/avt.jpg"
);

const clearSearch = () => {
  search.value = "";
};

function login() {
  router.push({ name: "login" });
}

function register() {
  router.push({ name: "register" });
}

function toggleUserMenu() {
  // Handle user menu toggle
  console.log("Toggle user menu");
}
</script>

<style scoped></style>
