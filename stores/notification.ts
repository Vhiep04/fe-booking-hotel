// stores/notification.ts
import { defineStore } from "pinia";
import { useApiStore } from "./api";
import { useAuthStore } from "./auth";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  reservationId?: number;
}

export const useNotificationStore = defineStore("notification", () => {
  const apiStore = useApiStore();
  const authStore = useAuthStore();

  const notifications = ref<Notification[]>([]);
  const loading = ref(false);

  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length,
  );

  // Endpoint tùy theo role
  const endpoint = computed(() =>
    authStore.isAdmin ? "/notifications/admin" : "/notifications",
  );

  async function fetchNotifications() {
    try {
      loading.value = true;
      const res = await apiStore.apiRequest<Notification[]>({
        method: "GET",
        endpoint: endpoint.value,
        auth: true,
        proxy: false,
      });
      notifications.value = res ?? [];
    } catch (e) {
      console.error("fetchNotifications error:", e);
    } finally {
      loading.value = false;
    }
  }

  async function markAllRead() {
    try {
      const ep = authStore.isAdmin
        ? "/notifications/admin/read-all"
        : "/notifications/read-all";

      await apiStore.apiRequest({
        method: "PATCH",
        endpoint: ep,
        auth: true,
        proxy: false,
      });
      notifications.value = notifications.value.map((n) => ({
        ...n,
        isRead: true,
      }));
    } catch (e) {
      console.error("markAllRead error:", e);
    }
  }

  async function markOneRead(id: number) {
    try {
      await apiStore.apiRequest({
        method: "PATCH",
        endpoint: `/notifications/${id}/read`,
        auth: true,
        proxy: false,
      });
      const n = notifications.value.find((n) => n.id === id);
      if (n) n.isRead = true;
    } catch (e) {
      console.error("markOneRead error:", e);
    }
  }

  // SignalR push vào đầu danh sách
  function addRealtimeNotification(noti: Notification) {
    notifications.value.unshift(noti);
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllRead,
    markOneRead,
    addRealtimeNotification,
  };
});
