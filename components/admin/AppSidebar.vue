<template>
  <div class="layout-sidebar">
    <!-- Logo -->
    <div class="layout-sidebar-logo">
      <NuxtLink to="/admin">
        <img
          src="/assets/images/england-flag.svg"
          alt="Booking Admin"
          class="h-8"
        />
        <span>Booking Admin</span>
      </NuxtLink>
    </div>

    <!-- Menu -->
    <div class="layout-menu-container">
      <AppMenu :model="menuItems" />
    </div>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-[var(--admin-sidebar-border)]">
      <div class="flex items-center gap-3 text-[var(--admin-sidebar-text)]">
        <i class="pi pi-info-circle text-sm"></i>
        <span class="text-xs text-[var(--admin-sidebar-text-muted)]">
          v1.0.0 - Booking Admin
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppMenu from "./AppMenu.vue";

interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  items?: MenuItem[];
  badge?: string | number;
  badgeClass?: string;
  separator?: boolean;
  visible?: boolean;
}

const menuItems = ref<MenuItem[]>([
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
      },
      {
        label: "Pending",
        icon: "pi pi-clock",
        to: "/admin/bookings?status=pending",
        badge: "5",
        badgeClass: "bg-yellow-500",
      },
      {
        label: "Confirmed",
        icon: "pi pi-check-circle",
        to: "/admin/bookings?status=confirmed",
      },
      {
        label: "Cancelled",
        icon: "pi pi-times-circle",
        to: "/admin/bookings?status=cancelled",
      },
    ],
  },
  {
    label: "Hotels",
    icon: "pi pi-building",
    items: [
      {
        label: "All Hotels",
        icon: "pi pi-list",
        to: "/admin/hotels",
      },
      {
        label: "Add New",
        icon: "pi pi-plus",
        to: "/admin/hotels/create",
      },
      {
        label: "Categories",
        icon: "pi pi-tags",
        to: "/admin/hotels/categories",
      },
    ],
  },
  {
    label: "Users",
    icon: "pi pi-users",
    items: [
      {
        label: "All Users",
        icon: "pi pi-list",
        to: "/admin/users",
      },
      {
        label: "Administrators",
        icon: "pi pi-shield",
        to: "/admin/users?role=admin",
      },
      {
        label: "Customers",
        icon: "pi pi-user",
        to: "/admin/users?role=customer",
      },
    ],
  },
  {
    label: "Cities",
    icon: "pi pi-map-marker",
    to: "/admin/cities",
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
