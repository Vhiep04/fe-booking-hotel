// middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (import.meta.client) {
    authStore.initAuthFromCookie();
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    return navigateTo("/");
  }
});
