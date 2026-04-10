<template>
  <header class="bg-gray-100 px-10 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <img src="../../assets/images/logo_easyset24.svg" alt="" />
        <i
          v-if="!authStore.isAuthenticated"
          class="pi pi-question-circle cursor-pointer"
          style="font-size: 1.2rem"
        ></i>

        <button
          v-if="!authStore.isAuthenticated"
          @click="toggleLangPanel"
          class="hover:opacity-80 transition-opacity"
        >
          <img :src="currentFlag" alt="Language" class="w-8 h-6" />
        </button>

        <OverlayPanel ref="langPanel" class="lang-overlay">
          <ul class="min-w-40">
            <li
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img :src="lang.flag" class="w-6 h-4" />
              <span class="text-sm">{{ lang.label }}</span>

              <i
                v-if="locale === lang.code"
                class="pi pi-check text-blue-600 ml-auto"
              ></i>
            </li>
          </ul>
        </OverlayPanel>
      </div>

      <!-- <div class="flex items-center">
        <CustomInputText
          id="search_global"
          v-model="search"
          type="text"
          placeholder="Search"
          :show-clear="true"
          @clear="clearSearch"
          width="50rem"
          class="bg-white rounded-2xl"
        >
          <template #icon>
            <i class="pi pi-search" style="font-size: 1rem"></i>
          </template>
        </CustomInputText>
      </div> -->

      <div v-if="authStore.isAuthenticated" class="flex items-center space-x-5">
        <button
          @click="toggleLangPanel"
          class="hover:opacity-80 transition-opacity"
        >
          <img :src="currentFlag" alt="Language" class="w-8 h-6" />
        </button>

        <OverlayPanel ref="langPanel" class="p-0">
          <ul class="min-w-40">
            <li
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img :src="lang.flag" class="w-6 h-4" />
              <span class="text-sm">{{ lang.label }}</span>

              <i
                v-if="locale === lang.code"
                class="pi pi-check text-blue-600 ml-auto"
              ></i>
            </li>
          </ul>
        </OverlayPanel>

        <button class="text-gray-700 hover:text-blue-600 transition-colors">
          <i class="pi pi-dollar" style="font-size: 1.2rem"></i>
        </button>

        <button class="text-gray-700 hover:text-blue-600 transition-colors">
          <i class="pi pi-question-circle" style="font-size: 1.2rem"></i>
        </button>

        <button
          class="text-gray-700 hover:text-red-600 transition-colors relative"
        >
          <i class="pi pi-heart" style="font-size: 1.2rem"></i>
        </button>

        <button class="text-gray-700 hover:text-blue-600 transition-colors">
          <i class="pi pi-phone" style="font-size: 1.2rem"></i>
        </button>

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

      <div
        v-if="!authStore.isAuthenticated"
        class="flex items-center space-x-3"
      >
        <Button
          @click="login"
          :label="t('Sign in')"
          size="normal"
          severity="info"
          raised
          class="w-[150px] ring-offset-2 dark:ring-offset-surface-900 transition-all"
        />
        <Button
          @click="register"
          :label="t('Register')"
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserProfile from "../UserProfile.vue";
import { useAuthStore } from "@/stores/auth";
import type { UserInfoResponse } from "~/stores/interface/response/getUserInfo";
import { Button } from "primevue";
import OverlayPanel from "primevue/overlaypanel";
import { useI18n } from "vue-i18n";
import enFlag from "@/assets/images/england-flag.svg";
import viFlag from "@/assets/images/vietnam-flag.svg";

const { t } = useI18n();

const currentFlag = computed(() => {
  return locale.value === "vi" ? viFlag : enFlag;
});

const { locale, setLocale } = useI18n();
type LocaleCode = "en" | "vi";

const langPanel = ref();

const languages: {
  code: LocaleCode;
  label: string;
  flag: string;
}[] = [
  { code: "en", label: "English", flag: enFlag },
  { code: "vi", label: "Tiếng Việt", flag: viFlag },
];

const toggleLangPanel = (event: Event) => {
  langPanel.value.toggle(event);
};

const changeLanguage = async (code: LocaleCode) => {
  if (locale.value !== code) {
    await setLocale(code);
  }
  langPanel.value.hide();
};

const router = useRouter();
const authStore = useAuthStore();

const search = ref("");

const userData = reactive<UserInfoResponse>({
  fullName: "",
  avatarUrl: "",
  email: "",
  phoneNumber: "",
  birthDate: undefined,
  firstName: "",
  lastName: "",
  userId: "",
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

function handleSignOut() {
  authStore.userLogout();
  router.push({ name: "login" });
}

onMounted(async () => {
  authStore.initAuthFromCookie();

  if (authStore.isAuthenticated) {
    await authStore.fetchUserInfo();
    const user = authStore.userInfo;
    if (user) {
      userData.fullName = user.fullName;
      userData.email = user.email;
      userData.avatarUrl = user.avatarUrl;
      userData.phoneNumber = user.phoneNumber;
    }
  }
});
</script>

<style scoped>
.lang-overlay {
  padding: 0 !important;
}

.lang-overlay .p-overlaypanel-content {
  padding: 0 !important;
}
</style>
