<template>
  <div class="layout-topbar">
    <div class="layout-topbar-left">
      <!-- Menu Toggle Button -->
      <button
        type="button"
        class="layout-topbar-button"
        @click="onMenuToggle"
        aria-label="Toggle Menu"
      >
        <i class="pi pi-bars"></i>
      </button>

      <!-- Breadcrumb -->
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

      <!-- User Profile Menu -->
      <div class="layout-profile-menu relative">
        <button
          type="button"
          class="layout-profile-button"
          @click="toggleProfileMenu"
          aria-label="User Menu"
        >
          <img
            :src="adminAvatar"
            :alt="adminName"
            class="layout-profile-avatar"
          />
          <div class="layout-profile-info hidden lg:block">
            <div class="layout-profile-name">{{ adminName }}</div>
            <div class="layout-profile-role">{{ adminRoleLabel }}</div>
          </div>
          <i class="pi pi-chevron-down text-sm hidden lg:block"></i>
        </button>

        <!-- Profile Dropdown -->
        <Menu
          ref="profileMenu"
          :model="profileMenuItems"
          :popup="true"
          class="w-48"
        />
      </div>
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

    <!-- Notifications Panel -->
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
            class="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.read }"
          >
            <div class="flex items-start gap-3">
              <i
                :class="['text-lg', notification.icon, notification.iconColor]"
              ></i>
              <div class="flex-1">
                <p class="font-medium text-sm m-0">{{ notification.title }}</p>
                <p class="text-xs text-gray-500 m-0 mt-1">
                  {{ notification.time }}
                </p>
              </div>
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
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import { useAdminLayoutStore } from "~/stores/admin/layout";
import { useAdminAuthStore } from "~/stores/admin/auth";

const layoutStore = useAdminLayoutStore();
const authStore = useAdminAuthStore();
const route = useRoute();

// Refs
const profileMenu = ref();
const notificationsPanel = ref();
const searchVisible = ref(false);
const searchQuery = ref("");

// Computed
const isDarkMode = computed(() => layoutStore.isDarkMode);
const adminName = computed(() => authStore.adminName);
const adminAvatar = computed(() => authStore.adminAvatar);
const adminRoleLabel = computed(() => {
  const roleMap: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Administrator",
    moderator: "Moderator",
  };
  return roleMap[authStore.adminRole] || "Admin";
});

// Breadcrumbs based on route
const breadcrumbs = computed(() => {
  const items: Array<{ label: string; to?: string }> = [];
  const paths = route.path.split("/").filter(Boolean);

  // Skip 'admin' from breadcrumb
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

// Notifications mock data
const notifications = ref([
  {
    id: 1,
    title: "New booking received",
    time: "5 minutes ago",
    icon: "pi pi-calendar",
    iconColor: "text-blue-500",
    read: false,
  },
  {
    id: 2,
    title: "Payment confirmed",
    time: "1 hour ago",
    icon: "pi pi-check-circle",
    iconColor: "text-green-500",
    read: false,
  },
  {
    id: 3,
    title: "New user registered",
    time: "3 hours ago",
    icon: "pi pi-user-plus",
    iconColor: "text-purple-500",
    read: true,
  },
]);

const notificationCount = computed(
  () => notifications.value.filter((n) => !n.read).length,
);

// Profile Menu Items
const profileMenuItems = ref([
  {
    label: "Profile",
    icon: "pi pi-user",
    command: () => navigateTo("/admin/profile"),
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    command: () => navigateTo("/admin/settings"),
  },
  { separator: true },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => authStore.logout(),
  },
]);

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

function toggleProfileMenu(event: Event) {
  profileMenu.value.toggle(event);
}

function toggleNotifications(event: Event) {
  notificationsPanel.value.toggle(event);
}

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
}
</script>
