<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Bookings Management</h1>
        <p class="admin-page-subtitle">View and manage all bookings</p>
      </div>
      <Button
        label="Export"
        icon="pi pi-download"
        severity="secondary"
        outlined
        @click="exportData"
      />
    </div>

    <BookingStatCard
      :reservations="reservations"
      :totalCount="pagination.totalCount"
    />

    <BookingFilter v-model="filters" />

    <BookingTable
      :reservations="reservations"
      :totalCount="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :loading="loading"
      :updatingId="updatingId"
      @view="openDetailDialog"
      @print="printInvoice"
      @status-change="onStatusChange"
      @page="onPageChange"
    />

    <BookingDetailDialog
      v-model="detailDialog"
      :booking="selectedBooking"
      @print="printInvoice"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import type { Reservation } from "~/stores/admin/interfaces/reservations";
import { useReservationsStore } from "~/stores/reservations";
import type { BookingFiltersModel } from "./BookingFilter.vue";
import BookingDetailDialog from "./BookingDetailDialog.vue";
import BookingTable from "./BookingTable.vue";
import BookingFilter from "./BookingFilter.vue";
import BookingStatCard from "./BookingStatCard.vue";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "Reservation Management",
});

const toast = useToast();
const reservationsStore = useReservationsStore();

const reservations = ref<Reservation[]>([]);
const loading = ref(false);
const updatingId = ref<number | null>(null);
const detailDialog = ref(false);
const selectedBooking = ref<Reservation | null>(null);

const pagination = ref({ page: 1, pageSize: 10, totalCount: 0 });

const filters = ref<BookingFiltersModel>({
  search: "",
  status: null,
  dateFrom: null,
  dateTo: null,
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchReservations() {
  loading.value = true;
  try {
    const res = await reservationsStore.fetchReservations({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      status: filters.value.status || undefined,
      fromDate: filters.value.dateFrom?.toISOString().split("T")[0],
      toDate: filters.value.dateTo?.toISOString().split("T")[0],
    });
    if (res?.success) {
      reservations.value = res.data.items;
      pagination.value.totalCount = res.data.totalCount;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to load bookings",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading bookings",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  filters,
  () => {
    pagination.value.page = 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchReservations, 400);
  },
  { deep: true },
);

onMounted(fetchReservations);

// ─── Handlers ─────────────────────────────────────────────────────────────────

function onPageChange({ page, rows }: { page: number; rows: number }) {
  pagination.value.page = page;
  pagination.value.pageSize = rows;
  fetchReservations();
}

function openDetailDialog(booking: Reservation) {
  selectedBooking.value = booking;
  detailDialog.value = true;
}

async function onStatusChange(booking: Reservation) {
  updatingId.value = booking.reservationId;
  try {
    const res = await reservationsStore.updateReservationStatus(
      booking.reservationId,
      booking.paymentStatus,
    );
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Status Updated",
        detail: `Booking #${booking.reservationId} → ${booking.paymentStatus}`,
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to update status",
        life: 3000,
      });
      await fetchReservations();
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
    await fetchReservations();
  } finally {
    updatingId.value = null;
  }
}

function printInvoice(booking: Reservation | null) {
  if (!booking) return;
  toast.add({
    severity: "info",
    summary: "Printing",
    detail: `Invoice for booking #${booking.reservationId}`,
    life: 3000,
  });
}

function exportData() {
  toast.add({
    severity: "info",
    summary: "Export",
    detail: "Exporting bookings data...",
    life: 3000,
  });
}
</script>
