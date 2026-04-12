<template>
  <header class="bg-gray-100 px-10 py-2">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <img src="../../assets/images/logo_easyset24.svg" alt="Logo" />
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Language -->
        <button
          @click="toggleLangPanel"
          class="hover:opacity-80 transition-opacity"
        >
          <img :src="currentFlag" alt="Language" class="w-8 h-6" />
        </button>

        <OverlayPanel ref="langPanel">
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

        <template v-if="authStore.isAuthenticated">
          <!-- Favourite -->
          <button class="text-gray-700 hover:text-red-500 transition-colors">
            <i class="pi pi-heart" style="font-size: 1.2rem"></i>
          </button>

          <!-- Notifications -->
          <button
            class="text-gray-700 hover:text-blue-600 transition-colors relative"
            @click="toggleNotifications"
          >
            <i class="pi pi-bell" style="font-size: 1.2rem"></i>
            <span
              v-if="notificationCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? "9+" : notificationCount }}
            </span>
          </button>

          <OverlayPanel ref="notificationsPanel" class="w-80">
            <div class="p-2">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold m-0 text-sm">Thông báo</h4>
                <button
                  v-if="notificationCount > 0"
                  class="text-xs text-blue-600 hover:underline"
                  @click="handleMarkAllRead"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              </div>

              <!-- Loading -->
              <div v-if="notificationStore.loading" class="text-center py-6">
                <i class="pi pi-spin pi-spinner text-gray-400"></i>
              </div>

              <!-- List -->
              <div v-else class="flex flex-col gap-1 max-h-80 overflow-y-auto">
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
                  Không có thông báo
                </div>
              </div>
            </div>
          </OverlayPanel>

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
            size="normal"
            severity="info"
            raised
            class="w-[150px]"
          />
          <Button
            @click="register"
            :label="t('Register')"
            size="normal"
            severity="info"
            raised
            class="w-[150px]"
          />
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import UserProfile from "../UserProfile.vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import type { UserInfoResponse } from "~/stores/interface/response/getUserInfo";
import { Button } from "primevue";
import OverlayPanel from "primevue/overlaypanel";
import { useI18n } from "vue-i18n";
import enFlag from "@/assets/images/england-flag.svg";
import viFlag from "@/assets/images/vietnam-flag.svg";

const { t, locale, setLocale } = useI18n();
type LocaleCode = "en" | "vi";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const langPanel = ref();
const languages: { code: LocaleCode; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: enFlag },
  { code: "vi", label: "Tiếng Việt", flag: viFlag },
];
const currentFlag = computed(() => (locale.value === "vi" ? viFlag : enFlag));

const toggleLangPanel = (event: Event) => langPanel.value.toggle(event);
const changeLanguage = async (code: LocaleCode) => {
  if (locale.value !== code) await setLocale(code);
  langPanel.value.hide();
};

const notificationsPanel = ref();
const { init: initHub, stop: stopHub } = useNotificationHub();

const notifications = computed(() => notificationStore.notifications);
const notificationCount = computed(() => notificationStore.unreadCount);

const toggleNotifications = (event: Event) => {
  notificationsPanel.value.toggle(event);
};

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
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
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
    const user = authStore.userInfo;

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
