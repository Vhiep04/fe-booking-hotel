<template>
  <div>
    <!-- Page Header -->
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
            >
              <i class="pi pi-users text-blue-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.total }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Total Users</p>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
            >
              <i class="pi pi-shield text-purple-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.admins }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Admins</p>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <i class="pi pi-check-circle text-green-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.active }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Active</p>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center"
            >
              <i class="pi pi-user-plus text-gray-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.newThisMonth }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">
                New This Month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Search users..."
              class="w-full"
            />
          </IconField>
          <Dropdown
            v-model="filters.role"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Roles"
            showClear
            class="w-full"
          />
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Status"
            showClear
            class="w-full"
          />
          <Calendar
            v-model="filters.joinedDate"
            placeholder="Joined After"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="admin-card">
      <DataTable
        :value="filteredUsers"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :loading="loading"
        dataKey="id"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
        responsiveLayout="scroll"
        v-model:selection="selectedUsers"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-[var(--admin-text-secondary)]">
              {{ filteredUsers.length }} users found
            </span>
            <div
              class="flex items-center gap-2"
              v-if="selectedUsers.length > 0"
            >
              <Button
                label="Delete Selected"
                icon="pi pi-trash"
                severity="danger"
                outlined
                size="small"
                @click="confirmDeleteSelected"
              />
            </div>
          </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" />

        <Column field="id" header="ID" sortable style="min-width: 80px">
          <template #body="{ data }">
            <span class="font-medium">#{{ data.id }}</span>
          </template>
        </Column>

        <Column field="name" header="User" sortable style="min-width: 250px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <Avatar
                :image="data.avatar"
                :label="!data.avatar ? data.name.charAt(0) : undefined"
                shape="circle"
                size="large"
                class="bg-[var(--admin-primary)] text-white"
              />
              <div>
                <p class="font-semibold text-[var(--admin-text-color)]">
                  {{ data.name }}
                </p>
                <p class="text-sm text-[var(--admin-text-muted)]">
                  {{ data.email }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="role" header="Role" sortable style="min-width: 130px">
          <template #body="{ data }">
            <Tag
              :value="data.role"
              :severity="data.role === 'Admin' ? 'danger' : 'info'"
            />
          </template>
        </Column>

        <Column
          field="bookings"
          header="Bookings"
          sortable
          style="min-width: 100px"
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.bookings }}</span>
          </template>
        </Column>

        <Column
          field="totalSpent"
          header="Total Spent"
          sortable
          style="min-width: 130px"
        >
          <template #body="{ data }">
            <span class="font-semibold">
              ${{ data.totalSpent.toLocaleString() }}
            </span>
          </template>
        </Column>

        <Column
          field="joinedAt"
          header="Joined"
          sortable
          style="min-width: 130px"
        >
          <template #body="{ data }">
            <span>{{ formatDate(data.joinedAt) }}</span>
          </template>
        </Column>

        <Column
          field="lastLogin"
          header="Last Login"
          sortable
          style="min-width: 130px"
        >
          <template #body="{ data }">
            <span class="text-[var(--admin-text-muted)]">{{
              data.lastLogin
            }}</span>
          </template>
        </Column>

        <Column
          field="status"
          header="Status"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'Active' ? 'success' : 'danger'"
            />
          </template>
        </Column>

        <Column header="Actions" style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                size="small"
                v-tooltip.top="'View'"
                @click="viewUser(data)"
              />
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Edit'"
                @click="editUser(data)"
              />
              <Button
                :icon="
                  data.status === 'Active' ? 'pi pi-lock' : 'pi pi-lock-open'
                "
                :severity="data.status === 'Active' ? 'warn' : 'success'"
                text
                rounded
                size="small"
                v-tooltip.top="
                  data.status === 'Active' ? 'Lock Account' : 'Unlock Account'
                "
                @click="toggleUserStatus(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="'Delete'"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '600px' }"
      :header="isEditing ? 'Edit User' : 'Add New User'"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div class="field md:col-span-2">
          <label for="name" class="font-medium mb-2 block">Full Name *</label>
          <InputText
            id="name"
            v-model="userForm.name"
            placeholder="Enter full name"
            :class="{ 'p-invalid': submitted && !userForm.name }"
          />
          <small v-if="submitted && !userForm.name" class="p-error">
            Name is required
          </small>
        </div>

        <div class="field md:col-span-2">
          <label for="email" class="font-medium mb-2 block">Email *</label>
          <InputText
            id="email"
            v-model="userForm.email"
            type="email"
            placeholder="Enter email address"
            :class="{ 'p-invalid': submitted && !userForm.email }"
          />
          <small v-if="submitted && !userForm.email" class="p-error">
            Email is required
          </small>
        </div>

        <div class="field" v-if="!isEditing">
          <label for="password" class="font-medium mb-2 block"
            >Password *</label
          >
          <Password
            id="password"
            v-model="userForm.password"
            placeholder="Enter password"
            toggleMask
            :feedback="true"
          />
        </div>

        <div class="field">
          <label for="phone" class="font-medium mb-2 block">Phone</label>
          <InputText
            id="phone"
            v-model="userForm.phone"
            placeholder="Enter phone number"
          />
        </div>

        <div class="field">
          <label for="role" class="font-medium mb-2 block">Role *</label>
          <Dropdown
            id="role"
            v-model="userForm.role"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select role"
          />
        </div>

        <div class="field">
          <label for="status" class="font-medium mb-2 block">Status</label>
          <Dropdown
            id="status"
            v-model="userForm.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="hideDialog"
        />
        <Button label="Save" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Confirm Delete"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-4xl text-yellow-500"></i>
        <span
          >Are you sure you want to delete
          <strong>{{ userToDelete?.name }}</strong
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="deleteDialog = false"
        />
        <Button
          label="Yes, Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="deleteUser"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const toast = useToast();

// State
const loading = ref(false);
const userDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const isEditing = ref(false);
const selectedUsers = ref<any[]>([]);
const userToDelete = ref<any>(null);

// Stats
const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter((u) => u.role === "Admin").length,
  active: users.value.filter((u) => u.status === "Active").length,
  newThisMonth: 24, // Mock value
}));

// Filters
const filters = ref({
  search: "",
  role: null,
  status: null,
  joinedDate: null,
});

// Form
const defaultForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "Customer",
  status: "Active",
};
const userForm = ref({ ...defaultForm });

// Options
const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Customer", value: "Customer" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Locked", value: "Locked" },
];

// Mock users data
const users = ref([
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    avatar: "https://i.pravatar.cc/150?u=1",
    role: "Customer",
    bookings: 12,
    totalSpent: 4520,
    joinedAt: "2023-06-15",
    lastLogin: "2 hours ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "https://i.pravatar.cc/150?u=2",
    role: "Customer",
    bookings: 8,
    totalSpent: 2840,
    joinedAt: "2023-08-20",
    lastLogin: "1 day ago",
    status: "Active",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@booking.com",
    avatar: "https://i.pravatar.cc/150?u=3",
    role: "Admin",
    bookings: 0,
    totalSpent: 0,
    joinedAt: "2023-01-01",
    lastLogin: "5 minutes ago",
    status: "Active",
  },
  {
    id: 4,
    name: "Mike Wilson",
    email: "mike.w@email.com",
    avatar: "https://i.pravatar.cc/150?u=4",
    role: "Customer",
    bookings: 5,
    totalSpent: 1650,
    joinedAt: "2023-10-05",
    lastLogin: "1 week ago",
    status: "Locked",
  },
  {
    id: 5,
    name: "Emily Brown",
    email: "emily.b@email.com",
    avatar: "https://i.pravatar.cc/150?u=5",
    role: "Customer",
    bookings: 15,
    totalSpent: 6200,
    joinedAt: "2023-04-12",
    lastLogin: "3 hours ago",
    status: "Active",
  },
  {
    id: 6,
    name: "David Lee",
    email: "david.l@email.com",
    avatar: null,
    role: "Customer",
    bookings: 3,
    totalSpent: 890,
    joinedAt: "2024-01-08",
    lastLogin: "2 days ago",
    status: "Active",
  },
]);

// Computed
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchSearch =
      !filters.value.search ||
      user.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchRole = !filters.value.role || user.role === filters.value.role;
    const matchStatus =
      !filters.value.status || user.status === filters.value.status;

    return matchSearch && matchRole && matchStatus;
  });
});

// Methods
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function openCreateDialog() {
  userForm.value = { ...defaultForm };
  isEditing.value = false;
  submitted.value = false;
  userDialog.value = true;
}

function editUser(user: any) {
  userForm.value = { ...user };
  isEditing.value = true;
  submitted.value = false;
  userDialog.value = true;
}

function viewUser(user: any) {
  navigateTo(`/admin/users/${user.id}`);
}

function hideDialog() {
  userDialog.value = false;
  submitted.value = false;
}

function saveUser() {
  submitted.value = true;

  if (!userForm.value.name || !userForm.value.email) {
    return;
  }

  if (isEditing.value) {
    const index = users.value.findIndex((u) => u.id === userForm.value.id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userForm.value };
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "User updated successfully",
      life: 3000,
    });
  } else {
    const newUser = {
      ...userForm.value,
      id: users.value.length + 1,
      avatar: null,
      bookings: 0,
      totalSpent: 0,
      joinedAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    };
    users.value.push(newUser);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "User created successfully",
      life: 3000,
    });
  }

  hideDialog();
}

function confirmDelete(user: any) {
  userToDelete.value = user;
  deleteDialog.value = true;
}

function confirmDeleteSelected() {
  // TODO: Implement bulk delete
}

function deleteUser() {
  users.value = users.value.filter((u) => u.id !== userToDelete.value.id);
  deleteDialog.value = false;
  userToDelete.value = null;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "User deleted successfully",
    life: 3000,
  });
}

function toggleUserStatus(user: any) {
  const newStatus = user.status === "Active" ? "Locked" : "Active";
  user.status = newStatus;
  toast.add({
    severity: "success",
    summary: "Status Updated",
    detail: `User account ${newStatus === "Active" ? "unlocked" : "locked"}`,
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

<style scoped>
:deep(.p-datatable) {
  background: transparent;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--admin-table-header-bg);
  border-color: var(--admin-table-border);
  color: var(--admin-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background: transparent;
  border-color: var(--admin-table-border);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: var(--admin-table-row-hover);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: var(--admin-table-border);
  color: var(--admin-text-color);
}
</style>
