<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Users Management</h1>
        <p class="admin-page-subtitle">Manage all users and administrators</p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          label="Export"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportData"
        />
        <Button label="Add User" icon="pi pi-plus" @click="openCreateDialog" />
      </div>
    </div>

    <UserStatsCard :stats="stats" />

    <UserFilter v-model="filters" />

    <UserTable
      :users="users"
      :totalCount="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :loading="loading"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @delete-selected="confirmDeleteSelected"
      @page="onPageChange"
    />

    <UserFormDialog
      v-model="userDialog"
      :isEditing="isEditing"
      :editingUser="editingUser"
      :saving="saving"
      @hide="closeUserDialog"
      @save-create="handleCreate"
      @save-update="handleUpdate"
    />

    <DeleteConfirmDialog
      v-model="deleteDialog"
      :user="userToDelete"
      :deleting="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import UserStatsCard from "./UserStatsCard.vue";
import UserFilter, { type UserFiltersModel } from "./UserFilter.vue";
import UserTable from "./UserTable.vue";
import UserFormDialog from "./UserFormDialog.vue";
import DeleteConfirmDialog from "./DeleteConfirmDialog.vue";
import { useUsersStore } from "~/stores/admin/users";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDto,
} from "~/stores/admin/interfaces/users";
import { useDebounceFn } from "@vueuse/core";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "User Management",
});

const toast = useToast();
const usersStore = useUsersStore();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const users = ref<UserDto[]>([]);
const userDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editingUser = ref<UserDto | null>(null);
const userToDelete = ref<UserDto | null>(null);

const pagination = ref({
  page: 1,
  pageSize: 10,
  totalCount: 0,
});

const filters = ref<UserFiltersModel>({
  search: "",
  role: null,
  status: null,
  joinedDate: null,
});

const stats = computed(() => ({
  total: pagination.value.totalCount,
  admins: users.value.filter((u) => u.roles.includes("Admin")).length,
  active: users.value.filter((u) => u.emailConfirmed).length,
  newThisMonth: users.value.filter((u) => {
    const joined = new Date(u.createdAt);
    const now = new Date();
    return (
      joined.getMonth() === now.getMonth() &&
      joined.getFullYear() === now.getFullYear()
    );
  }).length,
}));

async function fetchUsers() {
  loading.value = true;
  try {
    const res = await usersStore.getUsers({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      role: filters.value.role ?? undefined,
    });

    if (res.success) {
      users.value = res.data.items;
      pagination.value.totalCount = res.data.totalCount;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to load users",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading users",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

const debouncedFetch = useDebounceFn(fetchUsers, 400);
watch(
  filters,
  () => {
    pagination.value.page = 1;
    debouncedFetch();
  },
  { deep: true },
);

onMounted(fetchUsers);

function onPageChange({ page, rows }: { page: number; rows: number }) {
  pagination.value.page = page;
  pagination.value.pageSize = rows;
  fetchUsers();
}

function openCreateDialog() {
  editingUser.value = null;
  isEditing.value = false;
  userDialog.value = true;
}

function openEditDialog(user: UserDto) {
  editingUser.value = user;
  isEditing.value = true;
  userDialog.value = true;
}

function closeUserDialog() {
  userDialog.value = false;
  editingUser.value = null;
}

function openDeleteDialog(user: UserDto) {
  userToDelete.value = user;
  deleteDialog.value = true;
}

async function handleCreate(payload: CreateUserPayload) {
  saving.value = true;
  try {
    const res = await usersStore.createUser(payload);
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "User created successfully",
        life: 3000,
      });
      closeUserDialog();
      await fetchUsers();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to create user",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

async function handleUpdate(id: string, payload: UpdateUserPayload) {
  saving.value = true;
  try {
    const res = await usersStore.updateUser(id, payload);
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "User updated successfully",
        life: 3000,
      });
      closeUserDialog();
      await fetchUsers();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to update user",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!userToDelete.value) return;
  deleting.value = true;
  try {
    const res = await usersStore.deleteUser(userToDelete.value.id);
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "User deleted successfully",
        life: 3000,
      });
      deleteDialog.value = false;
      userToDelete.value = null;
      await fetchUsers();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to delete user",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    deleting.value = false;
  }
}

function confirmDeleteSelected(selected: UserDto[]) {
  // TODO: implement bulk delete endpoint
  toast.add({
    severity: "warn",
    summary: "Not implemented",
    detail: "Bulk delete coming soon",
    life: 3000,
  });
}

function exportData() {
  toast.add({
    severity: "info",
    summary: "Export",
    detail: "Exporting users data...",
    life: 3000,
  });
}
</script>
