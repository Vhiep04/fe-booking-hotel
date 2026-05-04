<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">{{ t("Dashboard") }}</h1>
        <p class="admin-page-subtitle">
          {{ t("Welcome back! Here's what's happening with your bookings.") }}
        </p>
      </div>
      <Button
        :label="t('Export')"
        icon="pi pi-download"
        :loading="dashboardStore.isExporting"
        :disabled="dashboardStore.isExporting"
        @click="exportData"
      />
    </div>

    <div
      v-if="dashboardStore.isLoading"
      class="flex items-center justify-center py-20"
    >
      <ProgressSpinner />
    </div>

    <div v-else-if="dashboardStore.error" class="admin-card p-6 text-center">
      <p class="text-(--admin-danger) mb-4">{{ dashboardStore.error }}</p>
      <Button
        :label="t('Retry')"
        icon="pi pi-refresh"
        @click="dashboardStore.fetchDashboard()"
      />
    </div>

    <template v-else-if="data">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard
          :title="t('Total Revenue')"
          :value="data.totalRevenue"
          :change="12.5"
          icon="pi pi-wallet"
          color="blue"
          format="currency"
          :period="t('month')"
        />
        <KpiCard
          :title="t('Total Bookings')"
          :value="data.totalReservations"
          :change="8.2"
          icon="pi pi-calendar"
          color="purple"
          :period="t('month')"
        />
        <KpiCard
          :title="t('Active Hotels')"
          :value="data.totalHotels"
          :change="3.1"
          icon="pi pi-building"
          color="orange"
          :period="t('month')"
        />
        <KpiCard
          :title="t('Total Users')"
          :value="data.totalUsers"
          :change="15.3"
          icon="pi pi-users"
          color="pink"
          :period="t('month')"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-2">
          <RevenueChart :chart-data="data.revenueChart" />
        </div>
        <div>
          <BookingChart
            :confirmed="data.confirmedReservations"
            :pending="data.pendingReservations"
            :cancelled="data.cancelledReservations"
            :completed="data.completedReservations"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Top Hotels -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3 class="admin-card-title">{{ t("Top Hotels") }}</h3>
          </div>
          <div class="admin-card-body">
            <div class="space-y-4">
              <div
                v-for="hotel in data.topHotels"
                :key="hotel.hotelId"
                class="flex items-center gap-3"
              >
                <img
                  v-if="hotel.imgUrl"
                  :src="hotel.imgUrl"
                  :alt="hotel.name"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-lg bg-(--admin-surface-hover) flex items-center justify-center"
                >
                  <i class="pi pi-building text-(--admin-text-muted)"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-(--admin-text-color) truncate">
                    {{ hotel.name }}
                  </p>
                  <p class="text-sm text-(--admin-text-muted)">
                    {{ hotel.reservationCount }} {{ t("bookings") }} · ⭐
                    {{ hotel.averageRating.toFixed(1) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-(--admin-text-color)">
                    {{ formatCurrency(hotel.revenue) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="admin-card flex flex-col">
          <div class="admin-card-header">
            <h3 class="admin-card-title">{{ t("Recent Activities") }}</h3>
          </div>
          <div class="admin-card-body flex-1 overflow-y-auto max-h-72">
            <div v-if="data.recentActivities.length" class="space-y-4">
              <div
                v-for="(activity, index) in data.recentActivities"
                :key="index"
                class="flex items-start gap-3"
              >
                <template
                  v-for="actStyle in [
                    getActivityStyle(activity?.type ?? 'booking'),
                  ]"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    :class="actStyle.bg"
                  >
                    <i :class="[actStyle.icon, 'text-sm', actStyle.color]"></i>
                  </div>
                </template>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-(--admin-text-color)">
                    {{ translateActivity(activity.message, activity.type) }}
                  </p>
                  <p class="text-xs text-(--admin-text-muted) mt-1">
                    {{ formatTimeAgo(activity.time) }}
                  </p>
                </div>
              </div>
            </div>
            <p
              v-else
              class="text-sm text-(--admin-text-muted) text-center py-4"
            >
              {{ t("No recent activities") }}
            </p>
          </div>
        </div>

        <!-- Popular Cities -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3 class="admin-card-title">{{ t("Popular Cities") }}</h3>
          </div>
          <div class="admin-card-body">
            <div class="space-y-3">
              <div
                v-for="city in data.popularCities"
                :key="city.cityId"
                class="flex items-center gap-3"
              >
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-(--admin-text-color)">
                      {{ city.name }}
                    </span>
                    <span class="text-sm text-(--admin-text-muted)">
                      {{ city.hotelCount }} {{ t("hotels") }}
                    </span>
                  </div>
                  <ProgressBar
                    :value="city.percentage || city.hotelCount"
                    :showValue="false"
                    class="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecentBookings
        :bookings="data.recentBookings"
        @view="openDashboardBookingDialog"
      />

      <DashboardBookingDetailDialog
        v-model="dashboardBookingDialog"
        :booking="dashboardSelectedBooking"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import KpiCard from "~/components/admin/dashboard/KpiCard.vue";
import RevenueChart from "~/components/admin/dashboard/RevenueChart.vue";
import BookingChart from "~/components/admin/dashboard/BookingChart.vue";
import RecentBookings from "~/components/admin/dashboard/RecentBookings.vue";
import { useDashboardStore } from "~/stores/admin/dashboard";
import DashboardBookingDetailDialog from "~/components/admin/dashboard/DashboardBookingDetailDialog.vue";
import type { RecentBooking } from "~/stores/admin/interfaces/dashboard";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const { t } = useI18n();

useHead({ title: t("Admin") });

const dashboardStore = useDashboardStore();
const data = computed(
  () =>
    dashboardStore.dashboardData as NonNullable<
      typeof dashboardStore.dashboardData
    >,
);
const dashboardBookingDialog = ref(false);
const dashboardSelectedBooking = ref<RecentBooking | null>(null);

function openDashboardBookingDialog(booking: RecentBooking) {
  dashboardSelectedBooking.value = booking;
  dashboardBookingDialog.value = true;
}

function formatCurrency(value: number): string {
  if (value === 0) return "0 đ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return t("just now");
  if (diffMins < 60) return t("{n} minutes ago", { n: diffMins });
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t("{n} hours ago", { n: diffHours });
  return t("{n} days ago", { n: Math.floor(diffHours / 24) });
}

function translateActivity(message: string, type: string): string {
  // "Payment received - $4000000.00"
  const paymentMatch = message.match(/^Payment received - (.+)$/);
  if (paymentMatch) {
    return t("Payment received - {amount}", { amount: paymentMatch[1] });
  }

  // "New booking at The Savoy"
  const bookingMatch = message.match(/^New booking at (.+)$/);
  if (bookingMatch) {
    return t("New booking at {hotel}", { hotel: bookingMatch[1] });
  }

  // "New user registered: example@email.com"
  const userMatch = message.match(/^New user registered: (.+)$/);
  if (userMatch) {
    return t("New user registered: {email}", { email: userMatch[1] });
  }

  // "Booking cancelled at The Savoy"
  const cancelMatch = message.match(/^Booking cancelled at (.+)$/);
  if (cancelMatch) {
    return t("Booking cancelled at {hotel}", { hotel: cancelMatch[1] });
  }

  // fallback
  return message;
}

function getActivityStyle(type: string | undefined): {
  bg: string;
  icon: string;
  color: string;
} {
  const styles: Record<string, { bg: string; icon: string; color: string }> = {
    booking: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: "pi pi-calendar-plus",
      color: "text-blue-600",
    },
    payment: {
      bg: "bg-green-100 dark:bg-green-900/30",
      icon: "pi pi-credit-card",
      color: "text-green-600",
    },
    user: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      icon: "pi pi-user-plus",
      color: "text-purple-600",
    },
    cancellation: {
      bg: "bg-red-100 dark:bg-red-900/30",
      icon: "pi pi-times-circle",
      color: "text-red-600",
    },
    hotel: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      icon: "pi pi-building",
      color: "text-orange-600",
    },
  };
  return styles[type ?? ""] ?? styles["booking"]!;
}

async function exportData() {
  await dashboardStore.exportDashboard();
}

onMounted(() => {
  dashboardStore.fetchDashboard();
});
</script>
