import { defineStore } from "pinia";
import { useApiStore } from "./api";
import { useAuthStore } from "./auth";
import { ref, computed } from "vue";

const namespace = "/User";

// ─── Util: format Date to "YYYY-MM-DD" using LOCAL timezone (avoid UTC shift) ─
export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  birthDate: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  birthDate?: string | null;
  gender?: string;
  address?: string;
  avatarUrl?: string | null;
}

export const useEditUserStore = defineStore("editUser", () => {
  const apiStore = useApiStore();
  const authStore = useAuthStore();

  const profile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const initials = computed(() => {
    const f = profile.value?.firstName?.[0] ?? "";
    const l = profile.value?.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "U";
  });

  // ─── Load profile from auth store (already fetched on login) ──────────────

  function loadFromAuthStore() {
    const userInfo = authStore.userInfo;
    if (!userInfo) return;

    profile.value = {
      userId: userInfo.userId,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      fullName: userInfo.fullName,
      phoneNumber: userInfo.phoneNumber ?? "",
      birthDate: userInfo.birthDate ?? null,
      avatarUrl: userInfo.avatarUrl ?? null,
    };
  }

  // ─── Fetch fresh profile ───────────────────────────────────────────────────

  async function fetchProfile() {
    try {
      isLoading.value = true;
      error.value = null;

      await authStore.fetchUserInfo();
      loadFromAuthStore();
    } catch (e: any) {
      error.value = e?.message ?? "Failed to load profile";
      console.error("fetchProfile error:", e);
    } finally {
      isLoading.value = false;
    }
  }

  // ─── Update profile ────────────────────────────────────────────────────────

  async function updateProfile(payload: UpdateProfilePayload) {
    try {
      isSaving.value = true;
      error.value = null;

      await apiStore.apiRequest<{ success: boolean; message?: string }>({
        method: "PUT",
        endpoint: `${namespace}/profile`,
        data: payload,
        auth: true,
        proxy: false,
      });

      // Optimistically update local profile
      if (profile.value) {
        profile.value = {
          ...profile.value,
          ...payload,
          fullName:
            `${payload.firstName ?? profile.value.firstName} ${payload.lastName ?? profile.value.lastName}`.trim(),
        };
      }

      // Sync back to auth store
      await authStore.fetchUserInfo();
      loadFromAuthStore();
    } catch (e: any) {
      error.value = e?.message ?? "Failed to update profile";
      console.error("updateProfile error:", e);
      throw e;
    } finally {
      isSaving.value = false;
    }
  }

  // ─── Upload avatar ─────────────────────────────────────────────────────────

  async function updateAvatar(file: File) {
    try {
      isSaving.value = true;
      error.value = null;

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await apiStore.apiRequest<{
        success: boolean;
        data: { avatarUrl: string };
      }>({
        method: "PUT",
        endpoint: `${namespace}/profile`,
        data: formData,
        auth: true,
        proxy: false,
      });

      if (profile.value && res?.data?.avatarUrl) {
        profile.value.avatarUrl = res.data.avatarUrl;
      }
    } catch (e: any) {
      error.value = e?.message ?? "Failed to upload avatar";
      console.error("updateAvatar error:", e);
      throw e;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    profile,
    isLoading,
    isSaving,
    error,
    initials,
    loadFromAuthStore,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };
});
