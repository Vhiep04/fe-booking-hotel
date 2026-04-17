<template>
  <div class="layout-sidebar">
    <div class="layout-sidebar-logo">
      <NuxtLink to="/admin">
        <img
          src="/assets/images/logo_easyset24.svg"
          alt="Booking Admin"
          class="h-8"
        />
        <span>Booking Admin</span>
      </NuxtLink>
    </div>

    <div class="layout-menu-container">
      <AppMenu :model="menuItems" />
    </div>

    <div class="p-4 border-t border-(--admin-sidebar-border)">
      <div class="flex items-center gap-3 text-(--admin-sidebar-text)">
        <i class="pi pi-info-circle text-sm"></i>
        <span class="text-xs text-(--admin-sidebar-text-muted)">
          v1.0.0 - Booking Admin
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppMenu from "./AppMenu.vue";
import type { MenuItem, MenuEntry } from "./AppMenu.vue";
import { useDashboardStore } from "~/stores/admin/dashboard";

const dashboardStore = useDashboardStore();

const data = computed(() => dashboardStore.dashboardData);

const badge = (count: number | undefined, cls: string): Partial<MenuItem> =>
  count ? { badge: count, badgeClass: cls } : {};

const menuItems = computed<MenuEntry[]>(() => [
  {
    label: "Dashboard",
    icon: "pi pi-home",
    to: "/admin",
  },
  {
    label: "Bookings",
    icon: "pi pi-calendar",
    items: [
      {
        label: "All Bookings",
        icon: "pi pi-list",
        to: "/admin/bookings",
        ...badge(data.value?.totalReservations, "bg-blue-500"),
      },
      {
        label: "Pending",
        icon: "pi pi-clock",
        to: "/admin/bookings?status=pending",
        ...badge(data.value?.pendingReservations, "bg-yellow-500"),
      },
      {
        label: "Confirmed",
        icon: "pi pi-check-circle",
        to: "/admin/bookings?status=confirmed",
        ...badge(data.value?.confirmedReservations, "bg-blue-100"),
      },
      {
        label: "Completed",
        icon: "pi pi-verified",
        to: "/admin/bookings?status=completed",
        ...badge(data.value?.completedReservations, "bg-green-500"),
      },
      {
        label: "Cancelled",
        icon: "pi pi-times-circle",
        to: "/admin/bookings?status=cancelled",
        ...badge(data.value?.cancelledReservations, "bg-red-500"),
      },
    ],
  },
  {
    label: "Hotels",
    icon: "pi pi-building",
    to: "/admin/hotels",
    ...badge(data.value?.totalHotels, "bg-blue-500"),
  },
  {
    label: "Users",
    icon: "pi pi-users",
    to: "/admin/users",
    ...badge(data.value?.totalUsers, "bg-blue-500"),
  },
  {
    label: "Cities",
    icon: "pi pi-map-marker",
    to: "/admin/cities",
    ...badge(data.value?.totalCities, "bg-blue-500"),
  },
  {
    label: "Facilities",
    icon: "pi pi-th-large",
    to: "/admin/facilities",
  },
  {
    label: "Rooms",
    icon: "pi pi-inbox",
    to: "/admin/rooms",
    ...badge(data.value?.totalRooms, "bg-blue-500"),
  },
  { separator: true },
  {
    label: "Reports",
    icon: "pi pi-chart-bar",
    items: [
      {
        label: "Revenue Report",
        icon: "pi pi-dollar",
        to: "/admin/reports/revenue",
      },
      {
        label: "Booking Report",
        icon: "pi pi-calendar",
        to: "/admin/reports/bookings",
      },
      {
        label: "User Report",
        icon: "pi pi-users",
        to: "/admin/reports/users",
      },
    ],
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    items: [
      {
        label: "General",
        icon: "pi pi-sliders-h",
        to: "/admin/settings/general",
      },
      {
        label: "Payment",
        icon: "pi pi-credit-card",
        to: "/admin/settings/payment",
      },
      {
        label: "Email Templates",
        icon: "pi pi-envelope",
        to: "/admin/settings/email",
      },
    ],
  },
]);
</script>
