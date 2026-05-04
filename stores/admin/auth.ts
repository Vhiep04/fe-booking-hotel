import { defineStore } from "pinia";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
}

export const useAdminAuthStore = defineStore("adminAuth", {
  state: (): AdminAuthState => ({
    admin: null,
    isAuthenticated: false,
    loading: false,
    token: null,
  }),

  getters: {
    currentAdmin: (state) => state.admin,
    isLoggedIn: (state) => state.isAuthenticated && state.admin !== null,
    adminName: (state) => state.admin?.name || "Admin",
    adminAvatar: (state) => state.admin?.avatar || "/images/default-avatar.png",
    adminRole: (state) => state.admin?.role || "admin",
    hasPermission: (state) => (permission: string) => {
      return (
        state.admin?.permissions?.includes(permission) ||
        state.admin?.role === "super_admin"
      );
    },
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/admin/login', {
        //   method: 'POST',
        //   body: { email, password }
        // })

        // Mock login for demo
        if (email === "admin@booking.com" && password === "admin123") {
          const mockAdmin: AdminUser = {
            id: 1,
            name: "Admin User",
            email: email,
            avatar: "/images/admin-avatar.png",
            role: "super_admin",
            permissions: [
              "hotels:read",
              "hotels:write",
              "bookings:read",
              "bookings:write",
              "users:read",
              "users:write",
              "cities:read",
              "cities:write",
            ],
          };

          this.admin = mockAdmin;
          this.isAuthenticated = true;
          this.token = "mock-jwt-token";

          // Save to localStorage
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("admin-token", this.token);
            localStorage.setItem("admin-user", JSON.stringify(mockAdmin));
          }

          return { success: true };
        } else {
          return { success: false, message: "Invalid email or password" };
        }
      } catch (error: any) {
        return { success: false, message: error.message || "Login failed" };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.admin = null;
      this.isAuthenticated = false;
      this.token = null;

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-user");
      }

      // Redirect to login
      navigateTo("/admin/login");
    },

    async checkAuth() {
      if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("admin-token");
        const userJson = localStorage.getItem("admin-user");

        if (token && userJson) {
          try {
            // TODO: Verify token with API
            // const response = await $fetch('/api/admin/verify', {
            //   headers: { Authorization: `Bearer ${token}` }
            // })

            this.token = token;
            this.admin = JSON.parse(userJson);
            this.isAuthenticated = true;
            return true;
          } catch {
            this.logout();
            return false;
          }
        }
      }
      return false;
    },

    setAdmin(admin: AdminUser) {
      this.admin = admin;
      this.isAuthenticated = true;
    },
  },
});
