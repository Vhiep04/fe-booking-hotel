export const useNotificationHub = () => {
  const config = useRuntimeConfig();
  const notificationStore = useNotificationStore();

  const { isConnected, start, on, stop } = useSignalR(
    `${config.public.apiBase}/hubs/notification`,
  );

  const _registerHandlers = () => {
    on("ReceiveNotification", (noti) => {
      console.log("[Hub] Received:", noti);
      notificationStore.addRealtimeNotification(noti);
    });
  };

  const init = async () => {
    await notificationStore.fetchNotifications();
    await start();
    _registerHandlers();

    // Re-register lại mỗi khi reconnect thành công
    watch(isConnected, (val) => {
      if (val) {
        console.log("[Hub] Reconnected — re-registering handlers");
        _registerHandlers();
      }
    });
  };

  return { isConnected, init, stop };
};
