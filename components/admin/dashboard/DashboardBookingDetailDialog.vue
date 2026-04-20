<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '700px' }"
    header="Booking Details"
    :modal="true"
    @show="onOpen"
  >
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <ProgressSpinner />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-10 gap-3"
    >
      <i class="pi pi-exclamation-circle text-3xl text-(--admin-danger)"></i>
      <p class="text-(--admin-danger) text-sm">{{ error }}</p>
      <Button
        label="Retry"
        icon="pi pi-refresh"
        size="small"
        @click="loadDetail"
      />
    </div>

    <!-- Content -->
    <div v-else-if="detail" class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label
            class="text-xs text-(--admin-text-muted) uppercase tracking-wider"
            >Booking ID</label
          >
          <p class="font-semibold text-(--admin-primary) mt-1">
            #{{ detail.reservationId }}
          </p>
        </div>
        <div>
          <label
            class="text-xs text-(--admin-text-muted) uppercase tracking-wider"
            >Created At</label
          >
          <p class="font-medium mt-1">{{ formatDate(detail.createdAt) }}</p>
        </div>
      </div>

      <Divider />

      <!-- Thay phần Hotel Information -->
      <div>
        <h4 class="font-semibold mb-3 text-(--admin-text-color)">
          Hotel Information
        </h4>
        <div class="flex items-center gap-4">
          <img
            v-if="props.booking?.hotelImage"
            :src="props.booking.hotelImage"
            :alt="detail.hotelName"
            class="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div
            v-else
            class="w-20 h-20 rounded-xl bg-(--admin-surface-hover) flex items-center justify-center shrink-0"
          >
            <i class="pi pi-building text-2xl text-(--admin-text-muted)"></i>
          </div>
          <div>
            <p class="font-semibold text-lg text-(--admin-text-color)">
              {{ detail.hotelName }}
            </p>
            <p class="text-(--admin-text-muted) text-sm mt-0.5">
              {{ detail.roomType }} · Room #{{ detail.roomId }}
            </p>
            <p class="text-sm text-(--admin-text-muted) mt-1">
              <i class="pi pi-map-marker mr-1 text-xs"></i>{{ detail.cityName }}
            </p>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3 text-(--admin-text-color)">
          Guest Information
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-(--admin-text-muted)">Name</label>
            <p class="font-medium mt-1">{{ detail.userName }}</p>
          </div>
          <div>
            <label class="text-xs text-(--admin-text-muted)">Email</label>
            <p class="font-medium mt-1 truncate">{{ detail.userEmail }}</p>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3 text-(--admin-text-color)">
          Stay Information
        </h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-xs text-(--admin-text-muted)">Check-in</label>
            <p class="font-medium mt-1">{{ formatDate(detail.checkInDate) }}</p>
          </div>
          <div>
            <label class="text-xs text-(--admin-text-muted)">Check-out</label>
            <p class="font-medium mt-1">
              {{ formatDate(detail.checkOutDate) }}
            </p>
          </div>
          <div>
            <label class="text-xs text-(--admin-text-muted)">Duration</label>
            <p class="font-medium mt-1">{{ detail.nights }} nights</p>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3 text-(--admin-text-color)">
          Payment Information
        </h4>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-xs text-(--admin-text-muted)"
              >Total Amount</label
            >
            <p class="font-bold text-2xl mt-1">
              ${{ detail.totalPrice.toLocaleString() }}
            </p>
          </div>
          <div>
            <label class="text-xs text-(--admin-text-muted)"
              >Payment Status</label
            >
            <div class="mt-2">
              <Tag
                :value="detail.paymentStatus"
                :severity="getStatusSeverity(detail.paymentStatus)"
              />
            </div>
          </div>
        </div>

        <div v-if="detail.payments?.length > 0">
          <label
            class="text-xs text-(--admin-text-muted) uppercase tracking-wider mb-2 block"
          >
            Payment History
          </label>
          <div class="space-y-2">
            <div
              v-for="payment in detail.payments"
              :key="payment.paymentId"
              class="flex items-center justify-between p-3 rounded-lg bg-(--admin-surface-hover)"
            >
              <div>
                <p class="font-medium text-sm">{{ payment.paymentMethod }}</p>
                <p class="text-xs text-(--admin-text-muted) mt-0.5">
                  {{ formatDate(payment.paymentDate) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold">
                  ${{ payment.amount.toLocaleString() }}
                </p>
                <Tag
                  :value="payment.status"
                  :severity="getStatusSeverity(payment.status)"
                  class="text-xs mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Close"
        severity="secondary"
        outlined
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import { useReservationsStore } from "~/stores/admin/reservations";
import type { RecentBooking } from "~/stores/admin/interfaces/dashboard";
import type { Reservation } from "~/stores/admin/interfaces/reservations";

const props = defineProps<{
  modelValue: boolean;
  booking: RecentBooking | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const reservationsStore = useReservationsStore();

const detail = ref<Reservation | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

async function loadDetail() {
  if (!props.booking?.reservationId) return;
  loading.value = true;
  error.value = null;
  detail.value = null;
  try {
    const res = await reservationsStore.fetchReservationById(
      props.booking.reservationId,
    );
    if (res?.success) {
      detail.value = res.data;
    } else {
      error.value = res?.message ?? "Failed to load booking detail";
    }
  } catch {
    error.value = "Unexpected error. Please try again.";
  } finally {
    loading.value = false;
  }
}

function onOpen() {
  loadDetail();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusSeverity(status: string) {
  const map: Record<string, string> = {
    Pending: "warn",
    pending: "warn",
    Confirmed: "info",
    confirmed: "info",
    Completed: "success",
    completed: "success",
    Cancelled: "danger",
    cancelled: "danger",
    Refunded: "secondary",
  };
  return map[status] ?? "secondary";
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      detail.value = null;
      error.value = null;
    }
  },
);
</script>
