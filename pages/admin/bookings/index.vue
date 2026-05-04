<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">{{ t("Bookings Management") }}</h1>
        <p class="admin-page-subtitle">
          {{ t("View and manage all bookings") }}
        </p>
      </div>
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

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import type { Reservation } from "~/stores/admin/interfaces/reservations";
import { useReservationsStore } from "~/stores/admin/reservations";
import type { BookingFiltersModel } from "../../../components/admin/booking/BookingFilter.vue";
import BookingDetailDialog from "../../../components/admin/booking/BookingDetailDialog.vue";
import BookingTable from "../../../components/admin/booking/BookingTable.vue";
import BookingFilter from "../../../components/admin/booking/BookingFilter.vue";
import BookingStatCard from "../../../components/admin/booking/BookingStatCard.vue";
import { Toast } from "primevue";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const { t } = useI18n();

useHead({ title: t("Reservation Management") });

const toast = useToast();
const reservationsStore = useReservationsStore();

const reservations = ref<Reservation[]>([]);
const loading = ref(false);
const updatingId = ref<number | null>(null);
const detailDialog = ref(false);
const selectedBooking = ref<Reservation | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const pagination = ref({ page: 1, pageSize: 10, totalCount: 0 });

const filters = ref<BookingFiltersModel>({
  search: "",
  status: null,
  dateFrom: null,
  dateTo: null,
});

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
        summary: t("Error"),
        detail: res?.message ?? t("Failed to load bookings"),
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: t("Unexpected error loading bookings"),
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

watch(
  filters,
  () => {
    pagination.value.page = 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchReservations, 400);
  },
  { deep: true },
);

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
        summary: t("Status Updated"),
        detail: t("Booking #{id} → {status}", {
          id: booking.reservationId,
          status: t(booking.paymentStatus),
        }),
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail: res?.message ?? t("Failed to update status"),
        life: 3000,
      });
      await fetchReservations();
    }
  } catch {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: t("Unexpected error"),
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
    summary: t("Printing"),
    detail: t("Invoice for booking #{id}", { id: booking.reservationId }),
    life: 3000,
  });
}

onMounted(fetchReservations);
</script>
