import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "@/stores/api";
import { useAuthStore } from "@/stores/auth";
import type { DashboardData, DashboardResponse } from "./interfaces/dashboard";

export const useDashboardStore = defineStore("dashboard", () => {
  const apiStore = useApiStore();
  const authStore = useAuthStore();

  const dashboardData = ref<DashboardData | null>(null);
  const isLoading = ref(false);
  const isExporting = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboard() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<DashboardResponse>({
        endpoint: "/api/admin/dashboard",
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

  async function exportDashboard() {
    isExporting.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `${useRuntimeConfig().public.apiBase}/api/admin/dashboard/export`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );

      if (!response.ok) {
        error.value = "Failed to export dashboard";
        return;
      }

      const disposition = response.headers.get("content-disposition") ?? "";
      const filenameMatch = disposition.match(/filename=([^;]+)/);
      const filename = filenameMatch?.[1]?.trim() ?? "dashboard_export.xlsx";

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      error.value = "An error occurred while exporting dashboard";
      console.error(e);
    } finally {
      isExporting.value = false;
    }
  }

  function $reset() {
    dashboardData.value = null;
    isLoading.value = false;
    isExporting.value = false;
    error.value = null;
  }

  return {
    dashboardData,
    isLoading,
    isExporting,
    error,
    fetchDashboard,
    exportDashboard,
    $reset,
  };
});

export default null;
