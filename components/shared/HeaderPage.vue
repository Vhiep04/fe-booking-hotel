<template>
  <header
    class="bg-white border-b border-gray-200 px-6 h-[300] z-50 sticky top-0"
  >
    <div class="flex items-center justify-between h-20 gap-6">
      <!-- Logo -->
      <div class="flex items-center shrink-0">
        <img
          src="../../assets/images/logo_easyset24.svg"
          alt="Logo"
          class="h-12"
        />
      </div>

      <!-- Nav items (center) -->
      <nav class="flex items-center gap-1 flex-1 justify-center">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="px-5 py-2 rounded-full text-base text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors whitespace-nowrap"
          active-class="!bg-[#07689F] !text-white font-medium"
        >
          {{ t(item.name) }}
        </NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Language -->
        <div class="relative overflow-visible" ref="langWrapper">
          <button
            @click="toggleLangPanel"
            class="hover:opacity-80 transition-opacity"
          >
            <img
              :src="currentFlag"
              alt="Language"
              class="w-9 h-6 rounded-sm object-contain"
            />
          </button>

          <!-- Language Dropdown -->
          <div
            v-if="showLangPanel"
            class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            <ul class="min-w-45 py-1">
              <li
                v-for="lang in languages"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                class="flex items-center rounded-xl gap-3 px-4 py-2 h-14 cursor-pointer hover:bg-gray-100"
              >
                <img :src="lang.flag" class="w-7 h-6 rounded-sm object-fit" />
                <span class="text-sm">{{ lang.label }}</span>
                <i
                  v-if="locale === lang.code"
                  class="pi pi-check text-blue-600 ml-auto"
                ></i>
              </li>
            </ul>
          </div>
        </div>

        <template v-if="authStore.isAuthenticated">
          <!-- Notifications -->
          <div class="relative overflow-visible" ref="notificationsWrapper">
            <button
              class="w-12 h-12 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors relative"
              @click="toggleNotifications"
            >
              <i class="pi pi-bell" style="font-size: 1.1rem"></i>
              <span
                v-if="notificationCount > 0"
                class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium"
              >
                {{ notificationCount > 9 ? "9+" : notificationCount }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            >
              <div
                class="p-3 flex items-center justify-between border-b border-gray-100"
              >
                <h4 class="font-semibold m-0 text-sm">
                  {{ t("Notifications") }}
                </h4>
                <button
                  v-if="notificationCount > 0"
                  class="text-xs text-blue-600 hover:underline"
                  @click="handleMarkAllRead"
                >
                  {{ t("Mark all as read") }}
                </button>
              </div>

              <div v-if="notificationStore.loading" class="text-center py-6">
                <i class="pi pi-spin pi-spinner text-gray-400"></i>
              </div>

              <div v-else class="overflow-y-auto max-h-120 w-100 p-2">
                <div
                  v-for="n in notifications"
                  :key="n.id"
                  @click="handleClickNotification(n.id)"
                  class="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
                  :class="{ 'bg-blue-50': !n.isRead }"
                >
                  <div class="flex items-start gap-2">
                    <i
                      :class="[
                        getNotificationIcon(n.type),
                        getNotificationColor(n.type),
                      ]"
                      style="font-size: 1rem; margin-top: 2px"
                    ></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium m-0 leading-snug">
                        {{ n.title }}
                      </p>
                      <p class="text-xs text-gray-500 m-0 mt-1 leading-snug">
                        {{ n.message }}
                      </p>
                      <p class="text-xs text-gray-400 m-0 mt-1">
                        {{ formatTimeAgo(n.createdAt) }}
                      </p>
                    </div>
                    <span
                      v-if="!n.isRead"
                      class="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1"
                    />
                  </div>
                </div>

                <div
                  v-if="notifications.length === 0"
                  class="text-center py-6 text-gray-400 text-sm"
                >
                  {{ t("No notifications") }}
                </div>
              </div>
            </div>
          </div>

          <UserProfile
            :full-name="userData.fullName"
            :email="userData.email"
            :avatar-url="userData.avatarUrl"
            :is-admin="false"
            @my-account="handleMyAccount"
            @payments="handlePayments"
            @settings="handleSettings"
            @support="handleSupport"
            @sign-out="handleSignOut"
          />
        </template>

        <template v-else>
          <Button
            @click="login"
            :label="t('Sign in')"
            size="small"
            severity="secondary"
            outlined
          />
          <Button
            @click="register"
            :label="t('Register')"
            size="small"
            severity="info"
            raised
          />
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import UserProfile from "../UserProfile.vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { Button } from "primevue";
import { useI18n } from "vue-i18n";
import enFlag from "@/assets/images/england-flag.svg";
import viFlag from "@/assets/images/vietnam-flag.svg";

const { t, locale, setLocale } = useI18n();
type LocaleCode = "en" | "vi";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const navItems = [
  { name: "Home", path: "/" },
  { name: "My reservation", path: "/reservation" },
  { name: "My favourite hotel", path: "/favourite-hotels" },
  { name: "My reviews", path: "/feedback" },
];
const languages: { code: LocaleCode; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: enFlag },
  { code: "vi", label: "Tiếng Việt", flag: viFlag },
];
const currentFlag = computed(() => (locale.value === "vi" ? viFlag : enFlag));

// Language panel
const showLangPanel = ref(false);
const langWrapper = ref<HTMLElement | null>(null);

const toggleLangPanel = () => {
  showLangPanel.value = !showLangPanel.value;
};
const changeLanguage = async (code: LocaleCode) => {
  if (locale.value !== code) await setLocale(code);
  showLangPanel.value = false;
};

onClickOutside(langWrapper, () => {
  showLangPanel.value = false;
});

// Notifications
const showNotifications = ref(false);
const notificationsWrapper = ref<HTMLElement | null>(null);
const { init: initHub, stop: stopHub } = useNotificationHub();

const notifications = computed(() => notificationStore.notifications);
const notificationCount = computed(() => notificationStore.unreadCount);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

onClickOutside(notificationsWrapper, () => {
  showNotifications.value = false;
});

const handleMarkAllRead = async () => {
  await notificationStore.markAllRead();
};

const handleClickNotification = async (id: number) => {
  await notificationStore.markOneRead(id);
};

function getNotificationIcon(type: string): string {
  const map: Record<string, string> = {
    NewBooking: "pi pi-calendar-plus",
    BookingConfirmed: "pi pi-check-circle",
    BookingRejected: "pi pi-times-circle",
    BookingCancelled: "pi pi-ban",
    BookingCompleted: "pi pi-star",
    PaymentSuccess: "pi pi-credit-card",
    PaymentFailed: "pi pi-exclamation-circle",
    NewUser: "pi pi-user-plus",
  };
  return map[type] ?? "pi pi-bell";
}

function getNotificationColor(type: string): string {
  const map: Record<string, string> = {
    NewBooking: "text-blue-500",
    BookingConfirmed: "text-green-500",
    BookingRejected: "text-red-500",
    BookingCancelled: "text-orange-500",
    BookingCompleted: "text-purple-500",
    PaymentSuccess: "text-green-600",
    PaymentFailed: "text-red-600",
    NewUser: "text-purple-500",
  };
  return map[type] ?? "text-gray-500";
}

function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("Just now");
  if (mins < 60) return t("{n} minutes ago", { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("{n} hours ago", { n: hours });
  return t("{n} days ago", { n: Math.floor(hours / 24) });
}

const userData = computed(() => ({
  fullName: authStore.userInfo?.fullName ?? "",
  email: authStore.userInfo?.email ?? "",
  avatarUrl: authStore.userInfo?.avatarUrl ?? "",
}));

const login = () => router.push({ name: "login" });
const register = () => router.push({ name: "register" });
const handleMyAccount = () => router.push({ name: "my-account" });
const handlePayments = () => router.push({ name: "payments" });
const handleSettings = () => router.push({ name: "settings" });
const handleSupport = () => router.push({ name: "support" });

function handleSignOut() {
  stopHub();
  authStore.userLogout();
  router.push({ name: "login" });
}

onMounted(async () => {
  authStore.initAuthFromCookie();
  if (authStore.isAuthenticated) {
    await authStore.fetchUserInfo();
    await initHub();
  }
});

watch(
  () => authStore.isAuthenticated,
  async (val) => {
    if (val) {
      await authStore.fetchUserInfo();
      await initHub();
    } else {
      stopHub();
    }
  },
);

onUnmounted(() => {
  stopHub();
});
</script>
