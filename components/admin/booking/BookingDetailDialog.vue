<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '700px' }"
    header="Booking Details"
    :modal="true"
  >
    <div v-if="booking" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-(--admin-text-muted)"> Booking ID </label>
          <p class="font-semibold text-(--admin-primary)">
            #{{ booking.reservationId }}
          </p>
        </div>
        <div>
          <label class="text-sm text-(--admin-text-muted)"> Created At </label>
          <p class="font-medium">{{ formatDate(booking.createdAt) }}</p>
        </div>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3">Hotel Information</h4>
        <p class="font-semibold text-lg">{{ booking.hotelName }}</p>
        <p class="text-(--admin-text-muted)">
          {{ booking.roomType }} Room Number: {{ booking.roomId }}
        </p>
        <p class="text-sm text-(--admin-text-muted) mt-1">
          <i class="pi pi-map-marker mr-1"></i>{{ booking.cityName }}
        </p>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3">Guest Information</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-(--admin-text-muted)">Name</label>
            <p class="font-medium">{{ booking.userName }}</p>
          </div>
          <div>
            <label class="text-sm text-(--admin-text-muted)">Email</label>
            <p class="font-medium">{{ booking.userEmail }}</p>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3">Stay Information</h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-sm text-(--admin-text-muted)">Check-in</label>
            <p class="font-medium">{{ formatDate(booking.checkInDate) }}</p>
          </div>
          <div>
            <label class="text-sm text-(--admin-text-muted)">Check-out</label>
            <p class="font-medium">{{ formatDate(booking.checkOutDate) }}</p>
          </div>
          <div>
            <label class="text-sm text-(--admin-text-muted)">Duration</label>
            <p class="font-medium">{{ booking.nights }} nights</p>
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <h4 class="font-semibold mb-3">Payment Information</h4>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-sm text-(--admin-text-muted)">
              Total Amount
            </label>
            <p class="font-bold text-xl">
              ${{ booking.totalPrice.toLocaleString() }}
            </p>
          </div>
          <div>
            <label class="text-sm text-(--admin-text-muted)">
              Payment Status
            </label>
            <div class="mt-1">
              <Tag
                :value="booking.paymentStatus"
                :severity="getPaymentSeverity(booking.paymentStatus)"
              />
            </div>
          </div>
        </div>

        <div v-if="booking.payments?.length > 0">
          <label class="text-sm text-(--admin-text-muted) mb-2 block">
            Payment History
          </label>
          <div class="space-y-2">
            <div
              v-for="payment in booking.payments"
              :key="payment.paymentId"
              class="flex items-center justify-between p-3 rounded-lg bg-(--admin-surface-hover)"
            >
              <div>
                <p class="font-medium text-sm">{{ payment.paymentMethod }}</p>
                <p class="text-xs text-(--admin-text-muted)">
                  {{ formatDate(payment.paymentDate) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold">
                  ${{ payment.amount.toLocaleString() }}
                </p>
                <Tag
                  :value="payment.status"
                  :severity="getPaymentSeverity(payment.status)"
                  class="text-xs"
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
        @click="emit('update:modelValue', false)"
      />
      <Button
        label="Print Invoice"
        icon="pi pi-print"
        @click="emit('print', booking!)"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Button from "primevue/button";
import Tag from "primevue/tag";
import type { Reservation } from "~/stores/admin/interfaces/reservations";

const props = defineProps<{
  modelValue: boolean;
  booking: Reservation | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "print", booking: Reservation): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

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
    Confirmed: "success",
    Completed: "success",
    Cancelled: "danger",
    Refunded: "secondary",
  };
  return map[status] ?? "secondary";
}
</script>
