<template>
  <div class="admin-card">
    <DataTable
      :value="hotels"
      :paginator="true"
      :rows="pageSize"
      :totalRecords="totalCount"
      :loading="loading"
      :lazy="true"
      dataKey="hotelId"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} hotels"
      responsiveLayout="scroll"
      v-model:selection="selectedHotels"
      @page="onPage"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-(--admin-text-secondary)">
            {{ totalCount }} hotels found
          </span>
          <Button
            v-if="selectedHotels.length > 0"
            label="Delete Selected"
            icon="pi pi-trash"
            severity="danger"
            outlined
            size="small"
            @click="emit('delete-selected', selectedHotels)"
          />
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column field="hotelId" header="ID" sortable style="min-width: 80px">
        <template #body="{ data }">
          <span class="font-medium">#{{ data.hotelId }}</span>
        </template>
      </Column>

      <Column field="name" header="Hotel" sortable style="min-width: 280px">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <img
              :src="getPrimaryImage(data)"
              :alt="data.name"
              class="w-14 h-14 rounded-lg object-cover bg-(--admin-surface-hover)"
            />
            <div>
              <p class="font-semibold text-(--admin-text-color)">
                {{ data.name }}
              </p>
              <p class="text-sm text-(--admin-text-muted)">
                {{ data.location }}
              </p>
            </div>
          </div>
        </template>
      </Column>

      <Column field="cityName" header="City" sortable style="min-width: 120px">
        <template #body="{ data }">
          <span>{{ data.cityName }}</span>
        </template>
      </Column>

      <Column
        field="averageRating"
        header="Rating"
        sortable
        style="min-width: 130px"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <i class="pi pi-star-fill text-yellow-400"></i>
            <span class="font-medium">{{
              data.averageRating?.toFixed(1) ?? "—"
            }}</span>
            <span class="text-(--admin-text-muted)"
              >({{ data.feedbackCount }})</span
            >
          </div>
        </template>
      </Column>

      <Column
        field="roomCount"
        header="Rooms"
        sortable
        style="min-width: 100px"
      >
        <template #body="{ data }">
          <span>{{ data.roomCount }} rooms</span>
        </template>
      </Column>

      <Column
        field="createdAt"
        header="Created"
        sortable
        style="min-width: 120px"
      >
        <template #body="{ data }">
          <span class="text-(--admin-text-muted)">{{
            formatDate(data.createdAt)
          }}</span>
        </template>
      </Column>

      <Column header="Actions" style="min-width: 120px">
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
import type { Hotel } from "~/stores/admin/interfaces/hotels";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop";

const props = defineProps<{
  hotels: Hotel[];
  totalCount: number;
  pageSize: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "view", hotel: Hotel): void;
  (e: "edit", hotel: Hotel): void;
  (e: "delete", hotel: Hotel): void;
  (e: "delete-selected", hotels: Hotel[]): void;
  (e: "page", event: { page: number; rows: number }): void;
}>();

const selectedHotels = ref<Hotel[]>([]);

function getPrimaryImage(hotel: Hotel): string {
  return (
    hotel.images?.find((img) => img.isPrimary)?.imageUrl ??
    hotel.images?.[0]?.imageUrl ??
    hotel.imgUrl ??
    FALLBACK_IMAGE
  );
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
