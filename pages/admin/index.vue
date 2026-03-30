<template>
  <div>
    <!-- Page Header -->
    <div class="admin-page-header">
      <h1 class="admin-page-title">Dashboard</h1>
      <p class="admin-page-subtitle">
        Welcome back! Here's what's happening with your bookings.
      </p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KpiCard
        title="Total Revenue"
        :value="kpiData.revenue"
        :change="12.5"
        icon="pi pi-dollar"
        color="blue"
        format="currency"
        period="month"
      />
      <KpiCard
        title="Total Bookings"
        :value="kpiData.bookings"
        :change="8.2"
        icon="pi pi-calendar"
        color="purple"
        period="month"
      />
      <KpiCard
        title="Active Hotels"
        :value="kpiData.hotels"
        :change="3.1"
        icon="pi pi-building"
        color="orange"
        period="month"
      />
      <KpiCard
        title="Total Users"
        :value="kpiData.users"
        :change="15.3"
        icon="pi pi-users"
        color="pink"
        period="month"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2">
        <RevenueChart />
      </div>
      <div>
        <BookingChart />
      </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Top Hotels -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Top Hotels</h3>
        </div>
        <div class="admin-card-body">
          <div class="space-y-4">
            <div
              v-for="hotel in topHotels"
              :key="hotel.id"
              class="flex items-center gap-3"
            >
              <img
                :src="hotel.image"
                :alt="hotel.name"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-[var(--admin-text-color)] truncate">
                  {{ hotel.name }}
                </p>
                <p class="text-sm text-[var(--admin-text-muted)]">
                  {{ hotel.bookings }} bookings
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-[var(--admin-text-color)]">
                  ${{ hotel.revenue.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Recent Activities</h3>
        </div>
        <div class="admin-card-body">
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start gap-3"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="activity.iconBg"
              >
                <i :class="[activity.icon, 'text-sm', activity.iconColor]"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-[var(--admin-text-color)]">
                  {{ activity.message }}
                </p>
                <p class="text-xs text-[var(--admin-text-muted)] mt-1">
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Cities -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">Popular Cities</h3>
        </div>
        <div class="admin-card-body">
          <div class="space-y-3">
            <div
              v-for="city in popularCities"
              :key="city.name"
              class="flex items-center gap-3"
            >
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span
                    class="text-sm font-medium text-[var(--admin-text-color)]"
                  >
                    {{ city.name }}
                  </span>
                  <span class="text-sm text-[var(--admin-text-muted)]">
                    {{ city.percentage }}%
                  </span>
                </div>
                <ProgressBar
                  :value="city.percentage"
                  :showValue="false"
                  class="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bookings Table -->
    <RecentBookings />
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "primevue/progressbar";
import KpiCard from "~/components/admin/dashboard/KpiCard.vue";
import RevenueChart from "~/components/admin/dashboard/RevenueChart.vue";
import BookingChart from "~/components/admin/dashboard/BookingChart.vue";
import RecentBookings from "~/components/admin/dashboard/RecentBookings.vue";

// Define page meta
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

// Mock KPI data - replace with real API data
const kpiData = ref({
  revenue: 125840,
  bookings: 1195,
  hotels: 248,
  users: 15420,
});

// Top Hotels mock data
const topHotels = ref([
  {
    id: 1,
    name: "Grand Plaza Hotel",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop",
    bookings: 142,
    revenue: 28500,
  },
  {
    id: 2,
    name: "Seaside Resort & Spa",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&h=100&fit=crop",
    bookings: 128,
    revenue: 24200,
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop",
    bookings: 98,
    revenue: 18600,
  },
  {
    id: 4,
    name: "City Center Boutique",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=100&h=100&fit=crop",
    bookings: 87,
    revenue: 15400,
  },
]);

// Recent Activities mock data
const recentActivities = ref([
  {
    id: 1,
    message: "New booking at Grand Plaza Hotel",
    time: "2 minutes ago",
    icon: "pi pi-calendar-plus",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    message: "Payment received - $450",
    time: "15 minutes ago",
    icon: "pi pi-credit-card",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    message: "New user registered",
    time: "1 hour ago",
    icon: "pi pi-user-plus",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    message: "Booking cancelled - BK-2024-005",
    time: "2 hours ago",
    icon: "pi pi-times-circle",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600",
  },
  {
    id: 5,
    message: "New hotel added - Beach Resort",
    time: "3 hours ago",
    icon: "pi pi-building",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600",
  },
]);

// Popular Cities mock data
const popularCities = ref([
  { name: "New York", percentage: 85 },
  { name: "Miami", percentage: 72 },
  { name: "Los Angeles", percentage: 65 },
  { name: "Chicago", percentage: 58 },
  { name: "Las Vegas", percentage: 45 },
]);
</script>
