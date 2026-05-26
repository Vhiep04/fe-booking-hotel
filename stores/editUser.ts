import { defineStore } from "pinia";
import { useApiStore } from "./api";
import { useAuthStore } from "./auth";
import { ref, computed } from "vue";

const namespace = "User";

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
  gender?: string;
  address?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string | null;
  gender?: string;
  address?: string;
  avatarUrl?: string;
}

export const useEditUserStore = defineStore("editUser", () => {
  const apiStore = useApiStore();
  const authStore = useAuthStore();

  const profile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  const initials = computed(() => {
    const f = profile.value?.firstName?.[0] ?? "";
    const l = profile.value?.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "U";
  });

  function loadFromAuthStore() {
    const userInfo = authStore.userInfo;
    if (!userInfo) return;

    profile.value = {
      userId: userInfo.userId,
      email: userInfo.email,
      firstName: userInfo.firstName ?? "",
      lastName: userInfo.lastName ?? "",
      fullName: userInfo.fullName,
      phoneNumber: userInfo.phoneNumber ?? "",
      birthDate: userInfo.birthDate
        ? toLocalDateString(new Date(userInfo.birthDate))
        : null,
      avatarUrl: userInfo.avatarUrl ?? null,
      createdAt: userInfo.createdAt ?? "",
    };
  }

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

  async function updateProfile(payload: UpdateProfilePayload) {
    try {
      isSaving.value = true;
      error.value = null;

      const merged: UpdateProfilePayload = {
        firstName: profile.value?.firstName ?? "",
        lastName: profile.value?.lastName ?? "",
        email: profile.value?.email ?? "",
        phoneNumber: profile.value?.phoneNumber ?? "",
        birthDate: profile.value?.birthDate ?? null,
        gender: profile.value?.gender ?? "",
        address: profile.value?.address ?? "",
        avatarUrl: profile.value?.avatarUrl ?? "",
        ...payload,
      };

      await apiStore.apiRequest<{ success: boolean; message?: string }>({
        method: "PUT",
        endpoint: `/api/${namespace}/profile`,
        data: merged,
        auth: true,
        proxy: false,
      });

      if (profile.value) {
        profile.value = {
          ...profile.value,
          ...payload,
          fullName:
            `${payload.firstName ?? profile.value.firstName} ${payload.lastName ?? profile.value.lastName}`.trim(),
        };
      }

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

  return {
    profile,
    isLoading,
    isSaving,
    error,
    initials,
    loadFromAuthStore,
    fetchProfile,
    updateProfile,
  };
});
