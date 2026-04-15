// composables/useChatHub.ts
export const useChatHub = () => {
  const config = useRuntimeConfig();

  const hub = useSignalR(`${config.public.apiBase}/hubs/chatHub`);

  const messages = ref<{ role: "user" | "assistant"; content: string }[]>([]);
  const isStreaming = ref(false);
  const isBotTyping = ref(false);

  const _registerHandlers = () => {
    // Server báo bot đang typing
    hub.on("BotTyping", (typing: boolean) => {
      isBotTyping.value = typing;
    });

    // Nhận từng token stream
    hub.on("ReceiveToken", (token: string) => {
      const last = messages.value.at(-1);
      if (last?.role === "assistant") {
        last.content += token; // cộng dồn trực tiếp, không cần buffer ngoài
      }
    });

    // Stream kết thúc
    hub.on("StreamComplete", () => {
      isStreaming.value = false;
      isBotTyping.value = false;
    });

    // Lỗi từ server — backend gửi "ChatError" không phải "ReceiveError"
    hub.on("ChatError", (err: string) => {
      isStreaming.value = false;
      isBotTyping.value = false;
      const last = messages.value.at(-1);
      if (last?.role === "assistant") {
        last.content = `Đã xảy ra lỗi: ${err}`;
      }
    });
  };

  const init = async () => {
    await hub.start();
    _registerHandlers();

    watch(hub.isConnected, (val) => {
      if (val) {
        console.log("[ChatHub] Reconnected — re-registering handlers");
        _registerHandlers();
      }
    });
  };

  const sendMessage = async (userMessage: string) => {
    if (!hub.isConnected.value || isStreaming.value) return;

    messages.value.push({ role: "user", content: userMessage });
    messages.value.push({ role: "assistant", content: "" }); // placeholder
    isStreaming.value = true;

    try {
      // Backend chỉ nhận 1 tham số "message", sessionId = ConnectionId tự động
      await hub.invoke("SendMessage", userMessage);
    } catch (e) {
      isStreaming.value = false;
      isBotTyping.value = false;
      const last = messages.value.at(-1);
      if (last?.role === "assistant") {
        last.content = "Không thể kết nối tới chatbot.";
      }
    }
  };

  return {
    isConnected: hub.isConnected,
    isConnecting: hub.isConnecting,
    isStreaming,
    isBotTyping,
    messages,
    error: hub.error,
    init,
    stop: hub.stop,
    sendMessage, // không cần truyền sessionId nữa
  };
};
