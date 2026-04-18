<template>
  <div class="admin-card">
    <DataTable
      :value="reservations"
      :paginator="true"
      :rows="pageSize"
      :totalRecords="totalCount"
      :loading="loading"
      :lazy="true"
      dataKey="reservationId"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} bookings"
      responsiveLayout="scroll"
      @page="onPage"
    >
      <template #header>
        <span class="text-[var(--admin-text-secondary)]">
          {{ totalCount }} bookings found
        </span>
      </template>

      <Column
        field="reservationId"
        header="Booking ID"
        sortable
        style="min-width: 130px"
      >
        <template #body="{ data }">
          <span class="font-semibold text-[var(--admin-primary)]"
            >#{{ data.reservationId }}</span
          >
        </template>
      </Column>

      <Column
        field="hotelName"
        header="Hotel"
        sortable
        style="min-width: 220px"
      >
        <template #body="{ data }">
          <p class="font-medium text-[var(--admin-text-color)]">
            {{ data.hotelName }}
          </p>
          <p class="text-xs text-[var(--admin-text-muted)]">
            {{ data.roomType }} · {{ data.cityName }}
          </p>
        </template>
      </Column>

      <Column
        field="roomNumber"
        header="RoomNumber"
        sortable
        style="min-width: 100px"
      >
        <template #body="{ data }">
          <span class="font-medium text-[var(--admin-text-color)]">
            #{{ data.roomId }}
          </span>
        </template>
      </Column>

      <Column field="userName" header="Guest" sortable style="min-width: 180px">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar
              :label="
                (data.userName || data.userEmail || '?').charAt(0).toUpperCase()
              "
              shape="circle"
              size="normal"
              class="bg-[var(--admin-primary)] text-white"
            />
            <div>
              <p class="font-medium text-[var(--admin-text-color)]">
                {{ data.userName }}
              </p>
              <p class="text-xs text-[var(--admin-text-muted)]">
                {{ data.userEmail }}
              </p>
            </div>
          </div>
        </template>
      </Column>

      <Column
        field="checkInDate"
        header="Check-in"
        sortable
        style="min-width: 120px"
      >
        <template #body="{ data }">
          <p class="font-medium">{{ formatDate(data.checkInDate) }}</p>
        </template>
      </Column>

      <Column
        field="checkOutDate"
        header="Check-out"
        sortable
        style="min-width: 120px"
      >
        <template #body="{ data }">
          <p class="font-medium">{{ formatDate(data.checkOutDate) }}</p>
        </template>
      </Column>

      <Column field="nights" header="Nights" sortable style="min-width: 80px">
        <template #body="{ data }">
          <span>{{ data.nights }}n</span>
        </template>
      </Column>

      <Column
        field="totalPrice"
        header="Amount"
        sortable
        style="min-width: 130px"
      >
        <template #body="{ data }">
          <p class="font-bold text-[var(--admin-text-color)]">
            ${{ data.totalPrice.toLocaleString() }}
          </p>
          <Tag
            :value="data.paymentStatus"
            :severity="getPaymentSeverity(data.paymentStatus)"
            class="text-xs mt-1"
          />
        </template>
      </Column>

      <Column
        field="paymentStatus"
        header="Status"
        sortable
        style="min-width: 150px"
      >
        <template #body="{ data }">
          <Dropdown
            v-model="data.paymentStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            :loading="updatingId === data.reservationId"
            @change="emit('status-change', data)"
          >
            <template #value="slotProps">
              <Tag
                :value="slotProps.value"
                :severity="getPaymentSeverity(slotProps.value)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>

      <Column header="Actions" style="min-width: 100px">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              icon="pi pi-eye"
              severity="info"
              text
              rounded
              size="small"
              v-tooltip.top="'View Details'"
              @click="emit('view', data)"
            />
            <Button
              icon="pi pi-print"
              severity="secondary"
              text
              rounded
              size="small"
              v-tooltip.top="'Print Invoice'"
              @click="emit('print', data)"
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
import Dropdown from "primevue/dropdown";
import type { Reservation } from "~/stores/admin/interfaces/reservations";

const props = defineProps<{
  reservations: Reservation[];
  totalCount: number;
  pageSize: number;
  loading: boolean;
  updatingId: number | null;
}>();

const emit = defineEmits<{
  (e: "view", booking: Reservation): void;
  (e: "print", booking: Reservation): void;
  (e: "status-change", booking: Reservation): void;
  (e: "page", event: { page: number; rows: number }): void;
}>();

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Refunded", value: "Refunded" },
];

function onPage(event: any) {
  emit("page", { page: event.page + 1, rows: event.rows });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPaymentSeverity(status: string) {
  const map: Record<string, string> = {
    Pending: "warn",
    Completed: "success",
    Cancelled: "danger",
    Confirmed: "secondary",
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
