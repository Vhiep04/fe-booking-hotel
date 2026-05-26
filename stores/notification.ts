import { defineStore } from "pinia";
import { useApiStore } from "./api";
import { useAuthStore } from "./auth";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: number;
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
    authStore.isAdmin ? "/api/notifications/admin" : "/api/notifications",
  );

  // stores/notification.ts
  async function fetchNotifications() {
    try {
      loading.value = true;
      const res = await apiStore.apiRequest<any[]>({
        method: "GET",
        endpoint: endpoint.value,
        auth: true,
        proxy: false,
      });

      // Map notificationId → id
      notifications.value = (res ?? []).map((n) => ({
        id: n.notificationId,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt,
        reservationId: n.reservationId ?? undefined,
      }));
    } catch (e) {
      console.error("fetchNotifications error:", e);
    } finally {
      loading.value = false;
    }
  }

  async function markAllRead() {
    try {
      const ep = authStore.isAdmin
        ? "/api/notifications/admin/read-all"
        : "/api/notifications/read-all";

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
        endpoint: `/api/notifications/${id}/read`,
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
  function addRealtimeNotification(noti: any) {
    notifications.value.unshift({
      id: noti.notificationId ?? noti.id,
      title: noti.title,
      message: noti.message,
      type: noti.type,
      isRead: noti.isRead,
      createdAt: noti.createdAt,
      reservationId: noti.reservationId ?? undefined,
    });
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
