<template>
  <div class="layout-sidebar">
    <div class="layout-sidebar-logo">
      <NuxtLink to="/admin">
        <img
          src="/assets/images/logo_easyset24.svg"
          alt="Booking Admin"
          class="h-8"
        />
        <span>{{ appTitle }}</span>
      </NuxtLink>
    </div>

    <div class="layout-menu-container">
      <AppMenu :model="menuItems" />
    </div>

    <div class="p-4 border-t border-(--admin-sidebar-border)">
      <div class="flex items-center gap-3 text-(--admin-sidebar-text)">
        <i class="pi pi-info-circle text-sm"></i>
        <span class="text-xs text-(--admin-sidebar-text-muted)">
          v1.0.0 - {{ appTitle }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppMenu from "./AppMenu.vue";
import type { MenuItem, MenuEntry } from "./AppMenu.vue";
import { useDashboardStore } from "~/stores/admin/dashboard";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();
const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const appTitle = computed(() => {
  if (authStore.isAdmin) return t("Booking Admin");
  return t("Booking Staff");
});

const data = computed(() => dashboardStore.dashboardData);

const badge = (count: number | undefined, cls: string): Partial<MenuItem> =>
  count ? { badge: count, badgeClass: cls } : {};

const menuItems = computed<MenuEntry[]>(() => [
  {
    label: t("Dashboard"),
    icon: "pi pi-home",
    to: "/admin",
  },
  {
    label: t("Bookings"),
    icon: "pi pi-calendar",
    items: [
      {
        label: t("All Bookings"),
        icon: "pi pi-list",
        to: "/admin/bookings",
        ...badge(data.value?.totalReservations, "bg-blue-500"),
      },
      {
        label: t("Pending"),
        icon: "pi pi-clock",
        to: "/admin/bookings?status=pending",
        ...badge(data.value?.pendingReservations, "bg-yellow-500"),
      },
      {
        label: t("Confirmed"),
        icon: "pi pi-check-circle",
        to: "/admin/bookings?status=confirmed",
        ...badge(data.value?.confirmedReservations, "bg-purple-500"),
      },
      {
        label: t("Completed"),
        icon: "pi pi-verified",
        to: "/admin/bookings?status=completed",
        ...badge(data.value?.completedReservations, "bg-green-500"),
      },
      {
        label: t("Cancelled"),
        icon: "pi pi-times-circle",
        to: "/admin/bookings?status=cancelled",
        ...badge(data.value?.cancelledReservations, "bg-red-500"),
      },
    ],
  },
  {
    label: t("Hotels"),
    icon: "pi pi-building",
    to: "/admin/hotels",
    ...badge(data.value?.totalHotels, "bg-blue-500"),
    items: [
      {
        label: t("Hotel List"),
        icon: "pi pi-building",
        to: "/admin/hotels",
      },
      {
        label: t("Add Hotel"),
        icon: "pi pi-plus",
        to: "/admin/hotels/create",
      },
    ],
  },
  {
    label: t("Users"),
    icon: "pi pi-users",
    to: "/admin/users",
    visible: authStore.isAdmin,
    ...badge(data.value?.totalUsers, "bg-blue-500"),
  },
  {
    label: t("Cities"),
    icon: "pi pi-map-marker",
    to: "/admin/cities",
    ...badge(data.value?.totalCities, "bg-blue-500"),
  },
  {
    label: t("Facilities"),
    icon: "pi pi-th-large",
    to: "/admin/facilities",
  },
  {
    label: t("Rooms"),
    icon: "pi pi-inbox",
    to: "/admin/rooms",
    ...badge(data.value?.totalRooms, "bg-blue-500"),
  },
  {
    label: t("Feedbacks"),
    icon: "pi pi-comments",
    to: "/admin/feedbacks",
    ...badge(data.value?.totalRooms, "bg-blue-500"),
  },
]);
</script>
