<template>
  <div class="admin-card">
    <div class="admin-card-header flex items-center justify-between">
      <h3 class="admin-card-title">Recent Bookings</h3>
      <NuxtLink
        to="/admin/bookings"
        class="text-sm text-[var(--admin-primary)] hover:underline"
      >
        View All
      </NuxtLink>
    </div>
    <div class="overflow-x-auto">
      <DataTable
        :value="bookings"
        :rows="5"
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <!-- Empty state -->
        <template #empty>
          <div class="flex flex-col items-center justify-center py-10 gap-2">
            <i
              class="pi pi-calendar text-3xl text-[var(--admin-text-muted)]"
            ></i>
            <p class="text-[var(--admin-text-muted)] text-sm">
              No recent bookings
            </p>
          </div>
        </template>

        <Column
          field="bookingCode"
          header="Booking ID"
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <span class="font-medium text-[var(--admin-primary)]">
              #{{ data.bookingCode }}
            </span>
          </template>
        </Column>

        <Column field="hotelName" header="Hotel" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <img
                v-if="data.hotelImage"
                :src="data.hotelImage"
                :alt="data.hotelName"
                class="w-10 h-10 rounded-lg object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-lg bg-[var(--admin-surface-hover)] flex items-center justify-center"
              >
                <i class="pi pi-building text-[var(--admin-text-muted)]"></i>
              </div>
              <div>
                <p class="font-medium text-[var(--admin-text-color)]">
                  {{ data.hotelName }}
                </p>
                <p class="text-xs text-[var(--admin-text-muted)]">
                  {{ data.cityName }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="guestName" header="Guest" style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar
                :image="data.guestAvatar ?? undefined"
                :label="
                  !data.guestAvatar ? data.guestName.charAt(0) : undefined
                "
                shape="circle"
                size="small"
              />
              <span>{{ data.guestName }}</span>
            </div>
          </template>
        </Column>

        <Column field="checkInDate" header="Check-in" style="min-width: 120px">
          <template #body="{ data }">
            <span>{{ formatDate(data.checkInDate) }}</span>
          </template>
        </Column>

        <Column
          field="checkOutDate"
          header="Check-out"
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <span>{{ formatDate(data.checkOutDate) }}</span>
          </template>
        </Column>

        <Column field="amount" header="Amount" style="min-width: 100px">
          <template #body="{ data }">
            <span class="font-semibold">
              ${{ data.amount.toLocaleString() }}
            </span>
          </template>
        </Column>

        <Column field="status" header="Status" style="min-width: 120px">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>

        <Column header="Actions" style="min-width: 100px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                size="small"
                @click="viewBooking(data)"
              />
              <Button
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                rounded
                size="small"
                @click="toggleMenu($event, data)"
              />
            </div>
            <Menu ref="menu" :model="menuItems" popup />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Menu from "primevue/menu";
import type { RecentBooking } from "~/stores/admin/interfaces/dashboard";

defineProps<{
  bookings: RecentBooking[];
}>();

const menu = ref();
const selectedBooking = ref<RecentBooking | null>(null);

const menuItems = [
  {
    label: "View Details",
    icon: "pi pi-eye",
    command: () => viewBooking(selectedBooking.value!),
  },
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => editBooking(selectedBooking.value!),
  },
  { separator: true },
  {
    label: "Cancel Booking",
    icon: "pi pi-times",
    command: () => cancelBooking(selectedBooking.value!),
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusSeverity(status: string) {
  const map: Record<string, string> = {
    Confirmed: "info",
    confirmed: "info",
    Pending: "warn",
    pending: "warn",
    Completed: "success",
    completed: "success",
    Cancelled: "danger",
    cancelled: "danger",
  };
  return map[status] ?? "secondary";
}

function viewBooking(booking: RecentBooking) {
  navigateTo(`/admin/bookings/${booking.reservationId}`);
}

function editBooking(booking: RecentBooking) {
  navigateTo(`/admin/bookings/${booking.reservationId}/edit`);
}

function cancelBooking(booking: RecentBooking) {
  console.log("Cancel booking:", booking.bookingCode);
}

function toggleMenu(event: Event, booking: RecentBooking) {
  selectedBooking.value = booking;
  menu.value.toggle(event);
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
