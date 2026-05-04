<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">{{ t("My Account") }}</h1>
        <p class="admin-page-subtitle">
          {{ t("View and update your profile information") }}
        </p>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-24">
      <ProgressSpinner />
    </div>

    <template v-else-if="profile">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <div class="admin-card">
            <div
              class="admin-card-body p-6 flex flex-col items-center text-center gap-4"
            >
              <div class="relative">
                <AvatarUpload
                  :initials="initials"
                  :avatar-url="profile.avatarUrl ?? undefined"
                  @upload="handleAvatarUpload"
                />
                <div
                  class="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white dark:border-gray-900 pointer-events-none"
                  :title="t('Active')"
                />
              </div>

              <div>
                <p class="text-xl font-bold text-(--admin-text-color)">
                  {{ profile.fullName || profile.email }}
                </p>
                <p class="text-sm text-(--admin-text-muted) mt-0.5">
                  {{ profile.email }}
                </p>
              </div>

              <Divider />

              <div class="w-full space-y-3 text-left">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"
                  >
                    <i class="pi pi-envelope text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p class="text-xs text-(--admin-text-muted)">
                      {{ t("Email") }}
                    </p>
                    <p class="text-sm font-medium text-(--admin-text-color)">
                      {{ profile.email }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0"
                  >
                    <i class="pi pi-phone text-green-600 text-sm" />
                  </div>
                  <div>
                    <p class="text-xs text-(--admin-text-muted)">
                      {{ t("Phone Number") }}
                    </p>
                    <p class="text-sm font-medium text-(--admin-text-color)">
                      {{ profile.phoneNumber || "—" }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0"
                  >
                    <i class="pi pi-calendar text-purple-600 text-sm" />
                  </div>
                  <div>
                    <p class="text-xs text-(--admin-text-muted)">
                      {{ t("Member since") }}
                    </p>
                    <p class="text-sm font-medium text-(--admin-text-color)">
                      {{
                        profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString(
                              locale,
                              {
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 class="admin-card-title flex items-center gap-2">
                <i class="pi pi-id-card text-(--admin-primary)" />
                {{ t("Personal Information") }}
              </h3>
            </div>

            <div class="admin-card-body">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-sm font-medium text-(--admin-text-secondary)"
                  >
                    {{ t("First Name") }}
                    <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    v-model="form.firstName"
                    :placeholder="t('e.g. Nguyen')"
                    :class="{ 'p-invalid': submitted && !form.firstName }"
                  />
                  <small v-if="submitted && !form.firstName" class="p-error">
                    {{ t("First name is required") }}
                  </small>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-sm font-medium text-(--admin-text-secondary)"
                  >
                    {{ t("Last Name") }}
                    <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    v-model="form.lastName"
                    :placeholder="t('e.g. Van A')"
                    :class="{ 'p-invalid': submitted && !form.lastName }"
                  />
                  <small v-if="submitted && !form.lastName" class="p-error">
                    {{ t("Last name is required") }}
                  </small>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-sm font-medium text-(--admin-text-secondary)"
                  >
                    {{ t("Email") }}
                  </label>
                  <div class="relative">
                    <InputText
                      :value="profile.email"
                      disabled
                      class="w-full pr-10 opacity-70 cursor-not-allowed"
                    />
                    <i
                      class="pi pi-lock absolute right-3 top-1/2 -translate-y-1/2 text-(--admin-text-muted) text-sm"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-sm font-medium text-(--admin-text-secondary)"
                  >
                    {{ t("Phone Number") }}
                  </label>
                  <InputText
                    v-model="form.phoneNumber"
                    :placeholder="t('e.g. 0901234567')"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <Button
              :label="t('Reset')"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              :disabled="saving"
              @click="resetForm"
            />
            <Button
              :label="t('Save Changes')"
              icon="pi pi-check"
              :loading="saving"
              @click="handleSave"
            />
          </div>
        </div>
      </div>
    </template>

    <div v-else class="admin-card p-12 text-center">
      <i
        class="pi pi-exclamation-circle text-5xl text-(--admin-text-muted) mb-4 block"
      />
      <h3 class="text-xl font-semibold text-(--admin-text-color) mb-2">
        {{ t("Failed to load profile") }}
      </h3>
      <p class="text-(--admin-text-muted) mb-4">
        {{ t("Could not fetch your account information.") }}
      </p>
      <Button :label="t('Retry')" icon="pi pi-refresh" @click="fetchProfile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Divider from "primevue/divider";
import ProgressSpinner from "primevue/progressspinner";
import { useToast } from "primevue/usetoast";
import { useEditUserStore } from "~/stores/editUser";
import { useUploadStore } from "~/stores/admin/uploadImage";
import AvatarUpload from "~/components/user-info/AvatarUpload.vue";

definePageMeta({ layout: "admin", middleware: ["admin"] });
useHead({ title: "My Account" });

const { t, locale } = useI18n();
const toast = useToast();
const editUserStore = useEditUserStore();
const uploadStore = useUploadStore();

const profile = computed(() => editUserStore.profile);
const loading = computed(() => editUserStore.isLoading);
const saving = computed(() => editUserStore.isSaving);

const submitted = ref(false);
const form = ref({ firstName: "", lastName: "", phoneNumber: "" });
const initials = computed(() => editUserStore.initials);

async function fetchProfile() {
  try {
    await editUserStore.fetchProfile();
    populateForm();
  } catch {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: t("Unexpected error loading profile"),
      life: 3000,
    });
  }
}

function populateForm() {
  const p = editUserStore.profile;
  if (!p) return;
  form.value = {
    firstName: p.firstName ?? "",
    lastName: p.lastName ?? "",
    phoneNumber: p.phoneNumber ?? "",
  };
}

function resetForm() {
  submitted.value = false;
  populateForm();
}

async function handleSave() {
  submitted.value = true;
  if (!form.value.firstName || !form.value.lastName) return;
  try {
    await editUserStore.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNumber: form.value.phoneNumber,
    });
    submitted.value = false;
    toast.add({
      severity: "success",
      summary: t("Success"),
      detail: t("Profile updated successfully"),
      life: 3000,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: t("Failed to update profile"),
      life: 3000,
    });
  }
}

async function handleAvatarUpload(file: File, _previewUrl: string) {
  try {
    const uploadRes = await uploadStore.uploadImage(file, "avatars");
    if (!uploadRes?.success || !uploadRes.data?.url) {
      toast.add({
        severity: "error",
        summary: t("Upload failed"),
        detail: t("Could not upload image"),
        life: 3000,
      });
      return;
    }
    await editUserStore.updateProfile({ avatarUrl: uploadRes.data.url });
    toast.add({
      severity: "success",
      summary: t("Success"),
      detail: t("Avatar updated successfully"),
      life: 3000,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: t("Unexpected error uploading avatar"),
      life: 3000,
    });
  }
}

onMounted(fetchProfile);
</script>
