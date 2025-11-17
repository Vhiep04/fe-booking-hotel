// plugins/auth.ts
import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Restore auth state từ cookie khi app khởi động
  authStore.initAuthFromCookie();
});
