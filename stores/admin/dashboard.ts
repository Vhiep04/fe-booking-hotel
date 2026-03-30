import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import type { DashboardData, DashboardResponse } from "./interfaces/dashboard";

export const useDashboardStore = defineStore("dashboard", () => {
  const apiStore = useApiStore();

  const dashboardData = ref<DashboardData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboard() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<DashboardResponse>({
        endpoint: "/admin/dashboard",
        method: "GET",
        auth: true,
      });

      if (response?.success) {
        dashboardData.value = response.data;
      } else {
        error.value = response?.message ?? "Failed to fetch dashboard data";
      }
    } catch (e) {
      error.value = "An error occurred while fetching dashboard data";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  function $reset() {
    dashboardData.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return {
    dashboardData,
    isLoading,
    error,
    fetchDashboard,
    $reset,
  };
});

export default null;
