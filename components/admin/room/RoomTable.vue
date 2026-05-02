<template>
  <div class="admin-card">
    <DataTable
      :value="rooms"
      :loading="loading"
      :rows="pageSize"
      :totalRecords="totalCount"
      :paginator="true"
      :lazy="true"
      dataKey="roomId"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :currentPageReportTemplate="
        t('Showing {first} to {last} of {totalRecords} rooms')
      "
      class="p-datatable-sm"
      @page="onPage"
    >
      <template #header>
        <span class="text-(--admin-text-secondary)">
          {{ t("{n} rooms found", { n: totalCount }) }}
        </span>
      </template>

      <template #empty>
        <div class="text-center py-8 text-(--admin-text-muted)">
          <i class="pi pi-inbox text-4xl mb-2 block" />
          <p>{{ t("No rooms found") }}</p>
        </div>
      </template>

      <Column field="roomId" :header="t('Room No.')" style="min-width: 100px">
        <template #body="{ data }">
          <span
            class="font-semibold text-(--admin-primary) flex justify-center"
            >{{ data.roomNumber }}</span
          >
        </template>
      </Column>

      <Column field="hotelName" :header="t('Hotel')" style="min-width: 160px">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i class="pi pi-building text-(--admin-primary)" />
            <span class="font-medium text-(--admin-text-color)">{{
              data.hotelName
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="roomType" :header="t('Type')" style="min-width: 120px">
        <template #body="{ data }">
          <Tag
            :value="translateRoomType(data.roomType)"
            :severity="getRoomTypeSeverity(data.roomType)"
          />
        </template>
      </Column>

      <Column field="capacity" :header="t('Capacity')" style="min-width: 100px">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <i class="pi pi-users text-(--admin-text-muted)" />
            <span>{{ data.capacity }}</span>
          </div>
        </template>
      </Column>

      <Column
        field="pricePerNight"
        :header="t('Price/Night')"
        style="min-width: 120px"
      >
        <template #body="{ data }">
          <span class="font-semibold text-green-600">{{
            formatPrice(data.pricePerNight)
          }}</span>
        </template>
      </Column>

      <Column field="status" :header="t('Status')" style="min-width: 120px">
        <template #body="{ data }">
          <Tag
            :value="t(data.status)"
            :severity="getStatusSeverity(data.status)"
          />
        </template>
      </Column>

      <Column
        field="facilities"
        :header="t('Facilities')"
        style="min-width: 160px"
      >
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag
              v-for="facility in data.facilities.slice(0, 2)"
              :key="facility.facilityId"
              severity="info"
              class="text-xs"
            >
              {{ translateFacility(facility.name) }}
            </Tag>
            <Tag
              v-if="data.facilities.length > 2"
              severity="secondary"
              class="text-xs"
            >
              +{{ data.facilities.length - 2 }}
            </Tag>
          </div>
        </template>
      </Column>

      <Column :header="t('Actions')" style="width: 120px">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              icon="pi pi-eye"
              severity="info"
              text
              rounded
              size="small"
              v-tooltip.top="t('View')"
              @click="emit('view', data)"
            />
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
import type { RoomDto } from "~/stores/admin/interfaces/rooms";

const { t } = useI18n();
const { translateFacility } = useFacilityTranslation();
const { translateRoomType } = useRoomTypeTranslation();

const props = defineProps<{
  rooms: RoomDto[];
  totalCount: number;
  pageSize: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "view", room: RoomDto): void;
  (e: "edit", room: RoomDto): void;
  (e: "delete", room: RoomDto): void;
  (e: "page", event: { page: number; rows: number }): void;
}>();

function onPage(event: any) {
  emit("page", { page: event.page + 1, rows: event.rows });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getRoomTypeSeverity(typeName: string) {
  const map: Record<string, string> = {
    Standard: "secondary",
    Deluxe: "info",
    Suite: "success",
    Presidential: "warn",
  };
  return map[typeName] ?? "secondary";
}

function getStatusSeverity(status: string) {
  const map: Record<string, string> = {
    Available: "success",
    Occupied: "danger",
    Maintenance: "warn",
    Reserved: "info",
  };
  return map[status] ?? "secondary";
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
