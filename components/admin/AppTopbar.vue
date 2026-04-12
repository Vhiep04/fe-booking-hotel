<template>
  <div class="layout-topbar">
    <div class="layout-topbar-left">
      <button
        type="button"
        class="layout-topbar-button"
        @click="onMenuToggle"
        aria-label="Toggle Menu"
      >
        <i class="pi pi-bars"></i>
      </button>

      <nav class="layout-breadcrumb hidden md:flex">
        <NuxtLink to="/admin" class="flex items-center">
          <i class="pi pi-home"></i>
        </NuxtLink>
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <span class="layout-breadcrumb-separator mx-2">/</span>
          <NuxtLink v-if="item.to" :to="item.to" class="hover:text-primary">
            {{ item.label }}
          </NuxtLink>
          <span v-else class="layout-breadcrumb-current">
            {{ item.label }}
          </span>
        </template>
      </nav>
    </div>

    <div class="layout-topbar-right">
      <!-- Search Button -->
      <button
        type="button"
        class="layout-topbar-button"
        @click="toggleSearch"
        aria-label="Search"
      >
        <i class="pi pi-search"></i>
      </button>

      <!-- Dark Mode Toggle -->
      <button
        type="button"
        class="layout-topbar-button"
        @click="toggleDarkMode"
        :aria-label="
          isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
        "
      >
        <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
      </button>

      <!-- Notifications -->
      <button
        type="button"
        class="layout-topbar-button relative"
        @click="toggleNotifications"
        aria-label="Notifications"
      >
        <i class="pi pi-bell"></i>
        <span
          v-if="notificationCount > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
        >
          {{ notificationCount > 9 ? "9+" : notificationCount }}
        </span>
      </button>

      <UserProfile
        :full-name="userData.fullName"
        :email="userData.email"
        :avatar-url="userData.avatarUrl"
        :is-admin="true"
        @sign-out="handleSignOut"
      />
    </div>

    <!-- Search Dialog -->
    <Dialog
      v-model:visible="searchVisible"
      modal
      header="Search"
      :style="{ width: '500px' }"
      :dismissableMask="true"
    >
      <div class="flex items-center gap-3">
        <IconField class="flex-1">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Search..."
            class="w-full"
            autofocus
            @keyup.enter="performSearch"
          />
        </IconField>
        <Button label="Search" @click="performSearch" />
      </div>
    </Dialog>

    <OverlayPanel ref="notificationsPanel" class="w-80">
      <div class="p-2">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-semibold m-0">Notifications</h4>
          <Button
            label="Mark all read"
            link
            size="small"
            @click="markAllRead"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="onClickNotification(notification.id)"
            class="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.isRead }"
          >
            <div class="flex items-start gap-3">
              <div class="flex-1">
                <p class="font-medium text-sm m-0">{{ notification.title }}</p>
                <p class="text-xs text-gray-500 m-0 mt-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 m-0 mt-1">
                  {{ new Date(notification.createdAt).toLocaleString("vi-VN") }}
                </p>
              </div>
              <!-- Chấm xanh nếu chưa đọc -->
              <span
                v-if="!notification.isRead"
                class="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"
              />
            </div>
          </div>
          <div
            v-if="notifications.length === 0"
            class="text-center py-4 text-gray-500"
          >
            No notifications
          </div>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import { useAdminLayoutStore } from "~/stores/admin/layout";
import { useAdminAuthStore } from "~/stores/admin/auth";
import type { UserInfoResponse } from "~/stores/interface/response/getUserInfo";
import UserProfile from "../UserProfile.vue";
import { useNotificationStore } from "~/stores/notification";
import { useNotificationHub } from "~/composables/useNotificationHub";

const layoutStore = useAdminLayoutStore();
const authStore = useAdminAuthStore();
const userStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const profileMenu = ref();
const notificationsPanel = ref();
const searchVisible = ref(false);
const searchQuery = ref("");

const isDarkMode = computed(() => layoutStore.isDarkMode);

const breadcrumbs = computed(() => {
  const items: Array<{ label: string; to?: string }> = [];
  const paths = route.path.split("/").filter(Boolean);

  if (paths[0] === "admin") {
    paths.shift();
  }

  let currentPath = "/admin";
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    if (index === paths.length - 1) {
      items.push({ label });
    } else {
      items.push({ label, to: currentPath });
    }
  });

  return items;
});

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

const notificationStore = useNotificationStore();
const { init: initHub, stop: stopHub } = useNotificationHub();

const notifications = computed(() => notificationStore.notifications);
const notificationCount = computed(() => notificationStore.unreadCount);

async function markAllRead() {
  await notificationStore.markAllRead();
}

async function onClickNotification(id: number) {
  await notificationStore.markOneRead(id);
}
// Methods
function onMenuToggle() {
  layoutStore.onMenuToggle();
}

function toggleDarkMode() {
  layoutStore.toggleDarkMode();
}

function toggleSearch() {
  searchVisible.value = true;
}

function performSearch() {
  if (searchQuery.value.trim()) {
    // TODO: Implement global search
    console.log("Searching for:", searchQuery.value);
    searchVisible.value = false;
  }
}

function toggleNotifications(event: Event) {
  notificationsPanel.value.toggle(event);
}

function handleSignOut() {
  userStore.userLogout();
  router.push({ name: "login" });
}

onMounted(async () => {
  await userStore.fetchUserInfo();

  const user = userStore.userInfo;
  if (user) {
    userData.fullName = user.fullName;
    userData.email = user.email;
    userData.avatarUrl = user.avatarUrl ?? "";
    userData.phoneNumber = user.phoneNumber ?? "";
    userData.firstName = user.firstName ?? "";
    userData.lastName = user.lastName ?? "";
    userData.userId = user.userId ?? "";
  }

  await initHub();
});

onUnmounted(() => {
  stopHub();
});
</script>
