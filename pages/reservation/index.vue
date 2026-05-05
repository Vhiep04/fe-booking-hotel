<template>
  <div
    class="min-h-screen mt-4 mx-auto max-w-6xl px-4 md:px-8 pb-12 dark:bg-slate-900"
  >
    <div class="mb-8 max-w-6xl">
      <p class="text-[#07689F] font-bold text-2xl mb-2">
        {{ t("My Reservations") }}
      </p>
      <p class="text-[#07689F]">
        {{ t("Manage and track all your bookings in one place.") }}
      </p>
    </div>

    <div class="flex gap-2 max-w-6xl mb-6 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="selectTab(tab.value)"
        :class="[
          'px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-0.5',
          activeTab === tab.value
            ? 'border-[#07689F] text-[#07689F] bg-white'
            : 'border-transparent text-gray-500 hover:text-[#07689F] hover:bg-white/60',
        ]"
      >
        {{ t(tab.labelKey) }}
        <span
          v-if="tab.value === activeTab && reservationStore.totalCount > 0"
          class="ml-1.5 px-1.5 py-0.5 text-xs bg-[#07689F] text-white rounded-full"
        >
          {{ reservationStore.totalCount }}
        </span>
      </button>
    </div>

    <template v-if="reservationStore.isLoading">
      <div class="space-y-4">
        <ReservationCardSkeleton v-for="i in pageSize" :key="i" />
      </div>
    </template>

    <template v-else-if="reservations.length > 0">
      <div class="space-y-4">
        <ReservationCard
          v-for="r in pagedReservations"
          :key="r.reservationId"
          :reservation="r"
          @cancel="handleCancel"
        />
      </div>

      <div class="mt-6">
        <Paginator
          v-model:rows="pageSize"
          :totalRecords="reservations.length"
          :first="firstRecord"
          :rowsPerPageOptions="[5, 10, 15]"
          @page="onPageChange"
          pt:root:class="bg-transparent!"
        />
      </div>
    </template>

    <!-- Empty -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <div
        class="w-20 h-20 mb-4 rounded-full bg-[#E8F4FB] flex items-center justify-center"
      >
        <i class="pi pi-calendar text-3xl text-[#07689F]" />
      </div>
      <p class="text-gray-600 font-semibold text-lg mb-1">
        {{ t("No reservations found") }}
      </p>
      <p class="text-gray-400 text-sm">
        {{
          activeTab !== "all"
            ? t("You have no {status} bookings yet.", { status: t(activeTab) })
            : t("You have no bookings yet.")
        }}
      </p>
      <NuxtLink
        to="/"
        class="mt-6 px-6 py-2.5 bg-[#07689F] text-white rounded-lg text-sm font-semibold hover:bg-[#055a8a] transition-colors"
      >
        {{ t("Explore Hotels") }}
      </NuxtLink>
    </div>

    <!-- Cancel Confirm Dialog -->
    <Dialog
      v-model:visible="showCancelDialog"
      modal
      :header="t('Cancel Reservation')"
      :style="{ width: '420px' }"
    >
      <p class="text-gray-600 mb-2">
        {{ t("Are you sure you want to cancel booking") }}
      </p>
      <p class="font-semibold text-gray-800">
        {{ cancelTarget?.bookingCode }}?
      </p>
      <p class="text-sm text-red-500 mt-3">
        {{ t("This action cannot be undone.") }}
      </p>
      <template #footer>
        <Button
          :label="t('Keep Booking')"
          severity="secondary"
          @click="showCancelDialog = false"
          class="mr-2"
        />
        <Button
          :label="t('Yes, Cancel')"
          severity="danger"
          :loading="reservationStore.isLoading"
          @click="confirmCancel"
        />
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import ReservationCard from "~/components/reservation/ReservationCard.vue";
import ReservationCardSkeleton from "~/components/reservation/ReservationCardSkeleton.vue";
import Paginator from "primevue/paginator";
import { useToast } from "primevue/usetoast";

const { t } = useI18n();
useHead({ title: t("My Reservations") });

const reservationStore = useReservationStore();
const toast = useToast();

const firstRecord = ref(0);
const pageSize = ref(5);

function onPageChange(event: { first: number; rows: number }) {
  firstRecord.value = event.first;
  pageSize.value = event.rows;
}

const pagedReservations = computed(() =>
  reservations.value.slice(
    firstRecord.value,
    firstRecord.value + pageSize.value,
  ),
);

const tabs = [
  { labelKey: "All", value: "all" },
  { labelKey: "Pending", value: "Pending" },
  { labelKey: "Confirmed", value: "Confirmed" },
  { labelKey: "Cancelled", value: "Cancelled" },
];

const activeTab = ref("all");
const showCancelDialog = ref(false);
const cancelTarget = ref<UserReservation | null>(null);

const reservations = computed(() => reservationStore.reservations);

async function fetchData() {
  await reservationStore.fetchReservations({
    status: activeTab.value !== "all" ? activeTab.value : undefined,
  });
}

function selectTab(val: string) {
  activeTab.value = val;
  firstRecord.value = 0; // reset về trang đầu khi đổi tab
  fetchData();
}

function handleCancel(reservation: UserReservation) {
  cancelTarget.value = reservation;
  showCancelDialog.value = true;
}

async function confirmCancel() {
  if (!cancelTarget.value) return;
  const res = await reservationStore.cancelReservation(
    cancelTarget.value.reservationId,
  );
  showCancelDialog.value = false;
  if (res?.success) {
    toast.add({
      severity: "success",
      summary: t("Cancelled"),
      detail: t("Reservation cancelled successfully."),
      life: 3000,
    });
    const newTotal = reservations.value.length;
    if (firstRecord.value >= newTotal && firstRecord.value > 0) {
      firstRecord.value = Math.max(0, firstRecord.value - pageSize.value);
    }
  } else {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: reservationStore.error ?? t("Failed to cancel."),
      life: 3000,
    });
  }
}

onMounted(fetchData);
</script>
