// plugins/auth.ts
import { useAuthStore } from "@/stores/auth";

// plugins/auth.ts
export default defineNuxtPlugin({
  name: "auth",
  parallel: true,
  async setup(nuxtApp) {
    // ✅ Chỉ chạy trên client
    if (process.server) return;

    const authStore = useAuthStore();
    await authStore.initAuthFromCookie();

    console.log("🔐 Auth initialized (client-side)");
  },
});
