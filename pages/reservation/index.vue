<template>
  <div class="min-h-screen bg-[#F5F7FA] mt-6 ml-36 mr-36 pb-12">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-[#07689F] font-bold text-2xl mb-2">My Reservations</p>
      <p class="text-[#07689F]">
        Manage and track all your bookings in one place.
      </p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
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
        {{ tab.label }}
        <span
          v-if="tab.value === activeTab && reservationStore.totalCount > 0"
          class="ml-1.5 px-1.5 py-0.5 text-xs bg-[#07689F] text-white rounded-full"
        >
          {{ reservationStore.totalCount }}
        </span>
      </button>
    </div>

    <!-- Sort -->
    <div class="flex justify-end mb-4">
      <Select
        v-model="sortOption"
        :options="sortOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Sort by"
        class="w-48 text-sm"
        @change="fetchData"
      />
    </div>

    <!-- Loading -->
    <template v-if="reservationStore.isLoading">
      <div class="space-y-4">
        <ReservationCardSkeleton v-for="i in 3" :key="i" />
      </div>
    </template>

    <!-- List -->
    <template v-else-if="reservations.length > 0">
      <div class="space-y-4">
        <ReservationCard
          v-for="r in reservations"
          :key="r.reservationId"
          :reservation="r"
          @cancel="handleCancel"
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
        No reservations found
      </p>
      <p class="text-gray-400 text-sm">
        You have no {{ activeTab !== "all" ? activeTab : "" }} bookings yet.
      </p>
      <NuxtLink
        to="/"
        class="mt-6 px-6 py-2.5 bg-[#07689F] text-white rounded-lg text-sm font-semibold hover:bg-[#055a8a] transition-colors"
      >
        Explore Hotels
      </NuxtLink>
    </div>

    <!-- Cancel Confirm Dialog -->
    <Dialog
      v-model:visible="showCancelDialog"
      modal
      header="Cancel Reservation"
      :style="{ width: '420px' }"
    >
      <p class="text-gray-600 mb-2">Are you sure you want to cancel booking</p>
      <p class="font-semibold text-gray-800">
        {{ cancelTarget?.bookingCode }}?
      </p>
      <p class="text-sm text-red-500 mt-3">This action cannot be undone.</p>
      <template #footer>
        <Button
          label="Keep Booking"
          severity="secondary"
          @click="showCancelDialog = false"
          class="mr-2"
        />
        <Button
          label="Yes, Cancel"
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
import { useToast } from "primevue/usetoast";

const { t } = useI18n();
useHead({ title: t("My Reservations") });

const reservationStore = useReservationStore();
const toast = useToast();

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Cancelled", value: "Cancelled" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Check-in Date", value: "checkin" },
];

const activeTab = ref("all");
const sortOption = ref("newest");
const showCancelDialog = ref(false);
const cancelTarget = ref<UserReservation | null>(null);

const reservations = computed(() => reservationStore.reservations);

async function fetchData() {
  await reservationStore.fetchReservations({
    status: activeTab.value !== "all" ? activeTab.value : undefined,
    sort: sortOption.value,
  });
}

function selectTab(val: string) {
  activeTab.value = val;
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
      summary: "Cancelled",
      detail: "Reservation cancelled successfully.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: reservationStore.error ?? "Failed to cancel.",
      life: 3000,
    });
  }
}

onMounted(fetchData);
</script>
