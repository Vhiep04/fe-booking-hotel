<template>
  <div class="admin-card">
    <DataTable
      :value="users"
      :paginator="true"
      :rows="pageSize"
      :totalRecords="totalCount"
      :loading="loading"
      :lazy="true"
      dataKey="id"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :currentPageReportTemplate="
        t('Showing {first} to {last} of {totalRecords} users')
      "
      responsiveLayout="scroll"
      v-model:selection="selectedUsers"
      @page="onPage"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-(--admin-text-secondary)">
            {{ t("{n} users found", { n: totalCount }) }}
          </span>
          <div class="flex items-center gap-2" v-if="selectedUsers.length > 0">
            <Button
              :label="t('Delete Selected')"
              icon="pi pi-trash"
              severity="danger"
              outlined
              size="small"
              @click="emit('delete-selected', selectedUsers)"
            />
          </div>
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column field="id" :header="t('ID')" sortable style="min-width: 80px">
        <template #body="{ data }">
          <span class="font-medium">#{{ data.id }}</span>
        </template>
      </Column>

      <Column
        field="fullName"
        :header="t('User')"
        sortable
        style="min-width: 250px"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <Avatar
              :label="getInitial(data)"
              shape="circle"
              size="large"
              class="bg-(--admin-primary) text-white"
            />
            <div>
              <p class="font-semibold text-(--admin-text-color)">
                {{ data.fullName }}
              </p>
              <p class="text-sm text-(--admin-text-muted)">{{ data.email }}</p>
            </div>
          </div>
        </template>
      </Column>

      <Column
        field="roles"
        :header="t('Role')"
        sortable
        style="min-width: 130px"
      >
        <template #body="{ data }">
          <Tag
            v-for="role in data.roles"
            :key="role"
            :value="role"
            :severity="role === 'Admin' ? 'danger' : 'info'"
            class="mr-1"
          />
        </template>
      </Column>

      <Column
        field="emailConfirmed"
        :header="t('Email Verified')"
        sortable
        style="min-width: 130px"
      >
        <template #body="{ data }">
          <Tag
            :value="data.emailConfirmed ? t('Verified') : t('Unverified')"
            :severity="data.emailConfirmed ? 'success' : 'warn'"
          />
        </template>
      </Column>

      <Column field="phoneNumber" :header="t('Phone')" style="min-width: 140px">
        <template #body="{ data }">
          <span class="text-(--admin-text-muted)">{{
            data.phoneNumber || "—"
          }}</span>
        </template>
      </Column>

      <Column
        field="createdAt"
        :header="t('Joined')"
        sortable
        style="min-width: 130px"
      >
        <template #body="{ data }">
          <span>{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>

      <Column :header="t('Actions')" style="min-width: 120px">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              size="small"
              v-tooltip.top="t('Edit')"
              @click="emit('edit', data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              size="small"
              v-tooltip.top="t('Delete')"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import type { UserDto } from "~/stores/admin/interfaces/users";

const { t } = useI18n();

const props = defineProps<{
  users: UserDto[];
  totalCount: number;
  pageSize: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", user: UserDto): void;
  (e: "delete", user: UserDto): void;
  (e: "delete-selected", users: UserDto[]): void;
  (e: "page", event: { page: number; rows: number }): void;
}>();

const selectedUsers = ref<UserDto[]>([]);

function getInitial(user: UserDto) {
  return (user.firstName?.[0] ?? user.userName?.[0] ?? "?").toUpperCase();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function onPage(event: any) {
  emit("page", { page: event.page + 1, rows: event.rows });
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
