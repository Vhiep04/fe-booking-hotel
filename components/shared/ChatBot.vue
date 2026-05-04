<template>
  <div class="fixed bottom-6 right-6 z-9999 flex flex-col items-end">
    <button
      v-if="isMinimized"
      @click="isMinimized = false"
      class="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg hover:bg-violet-700 transition-all cursor-pointer"
    >
      <i class="pi pi-comments text-white text-2xl" />
    </button>

    <!-- Expanded chat window -->
    <div
      v-else
      class="w-[360px] flex flex-col rounded-[20px] overflow-hidden border border-gray-200 shadow-2xl bg-white"
      style="height: 80vh"
    >
      <!-- Chat header -->
      <div
        v-if="activeView === 'chat'"
        class="flex items-center gap-2.5 px-3.5 py-3 bg-linear-to-br from-violet-600 to-violet-500 z-10 shrink-0"
      >
        <div class="relative shrink-0">
          <div
            class="w-[38px] h-[38px] rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white"
          >
            MB
          </div>
          <div
            class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors"
            :class="isConnected ? 'bg-green-400' : 'bg-gray-400'"
          />
        </div>
        <div class="flex-1 min-w-0 text-white">
          <div class="text-[13px] font-semibold leading-tight">Monster Bot</div>
          <div class="text-[11px] opacity-70">
            {{
              isConnecting
                ? "Đang kết nối..."
                : isConnected
                  ? "Support Agent"
                  : "Offline"
            }}
          </div>
        </div>
        <div class="flex gap-1">
          <button
            @click="activeView = 'home'"
            class="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <i class="pi pi-arrow-left text-[12px]" />
          </button>
          <button
            @click="isMinimized = true"
            class="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <i class="pi pi-minus text-[12px]" />
          </button>
        </div>
      </div>

      <!-- Home view -->
      <div
        v-if="activeView === 'home'"
        class="flex-1 flex flex-col overflow-hidden bg-gray-50"
      >
        <div
          class="bg-linear-to-b from-violet-500 to-violet-300 p-8 pb-10 relative shrink-0"
        >
          <h2 class="text-2xl font-bold text-gray-800">Live Chat</h2>
          <div class="absolute top-2.5 right-3">
            <button
              @click="isMinimized = true"
              class="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <i class="pi pi-minus text-[12px]" />
            </button>
          </div>
        </div>

        <div class="flex-1 p-4 mt-8 overflow-y-auto">
          <div
            class="bg-white rounded-2xl border border-gray-100 p-4 -mt-4 shadow-md"
          >
            <div class="flex items-center gap-2.5 mb-3">
              <div
                class="relative w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-xs"
              >
                MB
                <div
                  class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                  :class="isConnected ? 'bg-green-400' : 'bg-gray-400'"
                />
              </div>
              <div>
                <div class="text-[13px] font-semibold text-gray-800">
                  Monster Bot
                </div>
                <div class="text-[11px] text-gray-400">Hello!</div>
              </div>
            </div>
            <button
              @click="activeView = 'chat'"
              class="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Let's chat
              <i class="pi pi-send text-xs" />
            </button>
          </div>
        </div>

        <div class="flex border-t border-gray-100 bg-white shrink-0">
          <button
            class="flex-1 flex flex-col items-center gap-1 py-2 text-[11px] font-medium text-gray-800"
          >
            <i class="pi pi-home text-base" /> Home
          </button>
          <button
            @click="activeView = 'chat'"
            class="flex-1 flex flex-col items-center gap-1 py-2 text-[11px] font-medium text-gray-400 hover:text-gray-600"
          >
            <i class="pi pi-comments text-base" /> Chat
          </button>
        </div>
      </div>

      <!-- Chat view -->
      <div v-else class="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5"
        >
          <div
            v-if="messages.length === 0"
            class="text-center text-[11px] text-gray-400 py-2"
          >
            Bắt đầu cuộc trò chuyện nào!
          </div>

          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="[
              'flex gap-2 items-end',
              msg.role === 'user' ? 'flex-row-reverse' : '',
            ]"
          >
            <div
              v-if="msg.role !== 'user'"
              class="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-600 shrink-0"
            >
              M
            </div>
            <div
              :class="[
                'max-w-[70%] px-3 py-2 text-[13px] leading-relaxed rounded-2xl shadow-sm',
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none',
              ]"
            >
              {{ msg.content }}
              <span
                v-if="
                  isStreaming &&
                  i === messages.length - 1 &&
                  msg.role === 'assistant'
                "
                class="inline-block w-0.5 h-[13px] bg-gray-400 ml-0.5 align-middle animate-pulse"
              />
            </div>
          </div>

          <!-- Bot typing indicator -->
          <div v-if="isBotTyping && !isStreaming" class="flex gap-2 items-end">
            <div
              class="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-600 shrink-0"
            >
              M
            </div>
            <div
              class="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm flex gap-1 items-center"
            >
              <span
                class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"
              />
              <span
                class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"
              />
              <span
                class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"
              />
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="text-center text-[11px] text-red-400 py-1">
            {{ error }}
          </div>
        </div>

        <div
          v-if="!isInputVisible"
          class="p-4 border-t border-gray-100 bg-white shrink-0"
        >
          <button
            @click="isInputVisible = true"
            class="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            Let's chat
            <i class="pi pi-send text-xs" />
          </button>
        </div>

        <div
          v-else
          class="p-2.5 flex items-center gap-2 bg-white border-t border-gray-100 shrink-0"
        >
          <InputText
            v-model="inputText"
            @keyup.enter="handleSend"
            placeholder="Write a message..."
            :disabled="!isConnected || isStreaming"
            class="flex-1 bg-gray-50! border-gray-200! rounded-full! px-3.5! py-1.5! text-[13px]! focus:border-violet-400!"
            size="small"
          />
          <button
            @click="handleSend"
            :disabled="!inputText.trim() || !isConnected || isStreaming"
            class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white disabled:bg-violet-300 disabled:cursor-not-allowed"
          >
            <i
              :class="isStreaming ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
              class="text-[10px]"
            />
          </button>
        </div>
      </div>

      <div
        class="text-center py-1.5 text-[10px] text-gray-400 bg-white border-t border-gray-50 shrink-0"
      >
        Powered by <span class="text-orange-500 font-bold">LiveChat</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { InputText } from "primevue";

const {
  isConnected,
  isConnecting,
  isStreaming,
  isBotTyping,
  messages,
  error,
  init,
  stop,
  sendMessage,
} = useChatHub();

const isMinimized = ref(true);
const activeView = ref<"chat" | "home">("home");
const isInputVisible = ref(false);
const inputText = ref("");
const messageContainer = ref<HTMLElement | null>(null);

// Chỉ init một lần khi mount, KHÔNG stop khi minimize
onMounted(() => init());

onUnmounted(() => {
  window.removeEventListener("beforeunload", stop);
});

const handleSend = async () => {
  if (!inputText.value.trim() || !isConnected.value || isStreaming.value)
    return;
  const text = inputText.value;
  inputText.value = "";
  await sendMessage(text);
};

watch(
  messages,
  async () => {
    await nextTick();
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  },
  { deep: true },
);
watch(activeView, (newVal) => {
  if (newVal === "home") {
    isInputVisible.value = false;
  } else if (newVal === "chat") {
    // Nếu đã có tin nhắn thì không hiện button "Let's chat"
    if (messages.value.length > 0) {
      isInputVisible.value = true;
    }
  }
});
watch(activeView, (newVal) => {
  if (newVal === "home") isInputVisible.value = false;
});
</script>
