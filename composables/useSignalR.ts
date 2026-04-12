// composables/useSignalR.ts
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "~/stores/auth";

type EventHandler = (...args: any[]) => void;

export const useSignalR = (hubPath: string) => {
  const authStore = useAuthStore();

  const connection = ref<signalR.HubConnection | null>(null);
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const error = ref<string | null>(null);

  // Registry để cleanup listeners đúng cách
  const _handlers = new Map<string, EventHandler>();

  const _buildConnection = () => {
    return new signalR.HubConnectionBuilder()
      .withUrl(hubPath, {
        accessTokenFactory: () => authStore.token,
        // Bỏ skipNegotiation và transport — để SignalR tự chọn
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(
        process.env.NODE_ENV === "development"
          ? signalR.LogLevel.Information
          : signalR.LogLevel.Error,
      )
      .build();
  };

  const start = async () => {
    // Không kết nối nếu chưa login
    if (!authStore.isAuthenticated) {
      error.value = "Unauthenticated";
      return;
    }

    if (isConnecting.value || isConnected.value) return;

    try {
      isConnecting.value = true;
      error.value = null;

      connection.value = _buildConnection();

      connection.value.onreconnecting((err) => {
        isConnected.value = false;
        console.warn("[SignalR] Reconnecting...", err);
      });

      connection.value.onreconnected((connectionId) => {
        isConnected.value = true;
        console.info("[SignalR] Reconnected:", connectionId);

        // Re-register lại tất cả handlers sau reconnect
        _handlers.forEach((handler, event) => {
          connection.value?.off(event, handler);
          connection.value?.on(event, handler);
        });
      });

      connection.value.onclose((err) => {
        isConnected.value = false;
        console.warn("[SignalR] Connection closed:", err);
      });

      await connection.value.start();
      isConnected.value = true;
    } catch (e: any) {
      error.value = e?.message ?? "SignalR connection failed";
      console.error("[SignalR] Start error:", e);
    } finally {
      isConnecting.value = false;
    }
  };

  const stop = async () => {
    if (!connection.value) return;
    await connection.value.stop();
    isConnected.value = false;
  };

  // Đăng ký lắng nghe event từ server, tự dedup
  const on = (event: string, handler: EventHandler) => {
    if (!connection.value) {
      console.warn(`[SignalR] on("${event}") called before connection started`);
      return;
    }
    // Nếu đã có handler cũ cho event này thì off trước
    if (_handlers.has(event)) {
      connection.value.off(event, _handlers.get(event)!);
    }
    _handlers.set(event, handler);
    connection.value.on(event, handler);
  };

  const off = (event: string) => {
    if (!connection.value || !_handlers.has(event)) return;
    connection.value.off(event, _handlers.get(event)!);
    _handlers.delete(event);
  };

  // Gọi method trên Hub (server → trả về kết quả)
  const invoke = async <T = void>(
    method: string,
    ...args: any[]
  ): Promise<T | undefined> => {
    if (!connection.value || !isConnected.value) {
      console.warn(`[SignalR] invoke("${method}") — not connected`);
      return;
    }
    try {
      return await connection.value.invoke<T>(method, ...args);
    } catch (e: any) {
      console.error(`[SignalR] invoke("${method}") error:`, e);
      throw e;
    }
  };

  // Gọi method mà không cần response (fire-and-forget)
  const send = async (method: string, ...args: any[]) => {
    if (!connection.value || !isConnected.value) {
      console.warn(`[SignalR] send("${method}") — not connected`);
      return;
    }
    try {
      await connection.value.send(method, ...args);
    } catch (e: any) {
      console.error(`[SignalR] send("${method}") error:`, e);
      throw e;
    }
  };

  onUnmounted(async () => {
    _handlers.forEach((handler, event) => {
      connection.value?.off(event, handler);
    });
    _handlers.clear();
    await stop();
  });

  return {
    isConnected,
    isConnecting,
    error,
    start,
    stop,
    on,
    off,
    invoke,
    send,
  };
};
