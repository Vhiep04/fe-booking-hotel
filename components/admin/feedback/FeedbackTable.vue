<template>
  <div class="admin-card">
    <DataTable
      :value="feedbacks"
      :loading="loading"
      :rows="pageSize"
      :totalRecords="totalCount"
      :paginator="true"
      :lazy="true"
      dataKey="feedbackId"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} feedbacks"
      responsiveLayout="scroll"
      @page="onPage"
    >
      <template #header>
        <span class="text-(--admin-text-secondary)">
          {{ totalCount }} feedbacks found
        </span>
      </template>

      <template #empty>
        <div class="text-center py-8 text-(--admin-text-muted)">
          <i class="pi pi-comments text-4xl mb-2 block" />
          <p>No feedbacks found</p>
        </div>
      </template>

      <Column field="feedbackId" header="ID" sortable style="min-width: 80px">
        <template #body="{ data }">
          <span class="font-medium text-(--admin-text-muted)"
            >#{{ data.feedbackId }}</span
          >
        </template>
      </Column>

      <Column field="userName" header="User" sortable style="min-width: 180px">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar
              :label="getInitial(data)"
              shape="circle"
              size="normal"
              class="bg-(--admin-primary)] text-white"
            />
            <div>
              <p class="font-medium text-(--admin-text-color)">
                {{ data.userName ?? "Anonymous" }}
              </p>
              <p class="text-xs text-(--admin-text-muted)]">
                {{ data.userEmail }}
              </p>
            </div>
          </div>
        </template>
      </Column>

      <Column
        field="hotelName"
        header="Hotel"
        sortable
        style="min-width: 180px"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i class="pi pi-building text-(--admin-primary)" />
            <span class="font-medium text-(--admin-text-color)">{{
              data.hotelName
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="rating" header="Rating" sortable style="min-width: 130px">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <span
              v-for="i in 5"
              :key="i"
              class="pi text-sm"
              :class="
                i <= data.rating
                  ? 'pi-star-fill text-yellow-400'
                  : 'pi-star text-gray-300'
              "
            />
            <span class="ml-1 font-semibold text-(--admin-text-color)">{{
              data.rating
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="comment" header="Comment" style="min-width: 250px">
        <template #body="{ data }">
          <p class="text-sm text-(--admin-text-color) line-clamp-2">
            {{ data.comment || "—" }}
          </p>
        </template>
      </Column>

      <Column field="createdAt" header="Date" sortable style="min-width: 120px">
        <template #body="{ data }">
          <span class="text-sm text-(--admin-text-muted)">{{
            formatDate(data.createdAt)
          }}</span>
        </template>
      </Column>

      <Column header="Actions" style="min-width: 110px">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              icon="pi pi-eye"
              severity="info"
              text
              rounded
              size="small"
              v-tooltip.top="'View'"
              @click="emit('view', data)"
            />
            <Button
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              size="small"
              v-tooltip.top="'Edit'"
              @click="emit('edit', data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              size="small"
              v-tooltip.top="'Delete'"
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
import Avatar from "primevue/avatar";
import type { AdminFeedbackDto } from "~/stores/admin/interfaces/feedbacks";

const props = defineProps<{
  feedbacks: AdminFeedbackDto[];
  totalCount: number;
  pageSize: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "view", feedback: AdminFeedbackDto): void;
  (e: "edit", feedback: AdminFeedbackDto): void;
  (e: "delete", feedback: AdminFeedbackDto): void;
  (e: "page", event: { page: number; rows: number }): void;
}>();

function onPage(event: any) {
  emit("page", { page: event.page + 1, rows: event.rows });
}

function getInitial(f: AdminFeedbackDto) {
  return (f.userName ?? f.userEmail ?? "?").charAt(0).toUpperCase();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
