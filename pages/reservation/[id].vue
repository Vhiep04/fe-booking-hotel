<template>
  <div class="min-h-screen mt-6 ml-36 mr-36 pb-12">
    <NuxtLink
      to="/reservation"
      class="inline-flex items-center gap-2 text-[#07689F] text-sm font-semibold mb-6 hover:underline"
    >
      <i class="pi pi-arrow-left text-xs" />
      {{ t("Back to My Reservations") }}
    </NuxtLink>

    <!-- Loading -->
    <template v-if="reservationStore.isLoading">
      <ReservationDetailSkeleton />
    </template>

    <!-- Not found -->
    <div
      v-else-if="!reservation"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <div
        class="w-20 h-20 mb-4 rounded-full bg-[#E8F4FB] flex items-center justify-center"
      >
        <i class="pi pi-exclamation-triangle text-3xl text-[#07689F]" />
      </div>
      <p class="text-gray-600 font-semibold text-lg mb-1">
        {{ t("Reservation not found") }}
      </p>
      <NuxtLink
        to="/reservation"
        class="mt-4 px-6 py-2.5 bg-[#07689F] text-white rounded-lg text-sm font-semibold hover:bg-[#055a8a] transition-colors"
      >
        {{ t("Go Back") }}
      </NuxtLink>
    </div>

    <!-- Content -->
    <template v-else>
      <div class="grid grid-cols-[1fr_340px] gap-6 items-start">
        <!-- Left: Main Info -->
        <div class="space-y-5">
          <!-- Hotel Card -->
          <div
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div class="relative h-52 overflow-hidden">
              <img
                :src="reservation.hotelImage || '/placeholder-hotel.jpg'"
                :alt="reservation.hotelName"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              />
              <div class="absolute bottom-4 left-5 text-white">
                <p class="text-xl font-bold">{{ reservation.hotelName }}</p>
                <p class="text-sm opacity-90 flex items-center gap-1 mt-0.5">
                  <i class="pi pi-map-marker text-xs" />
                  {{ reservation.hotelLocation }}, {{ reservation.cityName }}
                </p>
              </div>
              <!-- Status badge -->
              <div class="absolute top-4 right-4">
                <span
                  :class="statusClass(reservation.paymentStatus)"
                  class="px-3 py-1 rounded-full text-xs font-bold shadow"
                >
                  {{ t(reservation.paymentStatus) }}
                </span>
              </div>
            </div>

            <div class="p-5 grid grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-gray-400 mb-1">{{ t("Room") }}</p>
                <p class="font-semibold text-gray-800">
                  {{ reservation.roomTypeName }}
                </p>
                <p class="text-sm text-gray-500">
                  #{{ reservation.roomNumber }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">{{ t("Capacity") }}</p>
                <p class="font-semibold text-gray-800 flex items-center gap-1">
                  <i class="pi pi-user text-sm" />
                  {{ reservation.capacity }} {{ t("guests") }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">
                  {{ t("Price per night") }}
                </p>
                <p class="font-semibold text-[#07689F]">
                  {{ reservation.pricePerNight.toLocaleString() }} VNĐ
                </p>
              </div>
            </div>
          </div>

          <!-- Stay Details -->
          <div
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p class="font-bold text-gray-800 mb-4">{{ t("Stay Details") }}</p>
            <div class="grid grid-cols-3 gap-6">
              <div class="text-center p-4 bg-[#F0F8FF] rounded-xl">
                <p class="text-xs text-gray-400 mb-1">{{ t("Check-in") }}</p>
                <p class="font-bold text-[#07689F] text-sm">
                  {{ formatDate(reservation.checkInDate) }}
                </p>
                <p class="text-xs text-gray-400 mt-1">{{ t("From 14:00") }}</p>
              </div>
              <div
                class="text-center p-4 flex flex-col items-center justify-center"
              >
                <div class="flex items-center gap-1 text-gray-400">
                  <div class="h-px w-6 bg-gray-300" />
                  <i class="pi pi-moon text-sm" />
                  <div class="h-px w-6 bg-gray-300" />
                </div>
                <p class="font-bold text-gray-800 mt-1">
                  {{ reservation.nights }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ reservation.nights > 1 ? t("nights") : t("night") }}
                </p>
              </div>
              <div class="text-center p-4 bg-[#F0F8FF] rounded-xl">
                <p class="text-xs text-gray-400 mb-1">{{ t("Check-out") }}</p>
                <p class="font-bold text-[#07689F] text-sm">
                  {{ formatDate(reservation.checkOutDate) }}
                </p>
                <p class="text-xs text-gray-400 mt-1">{{ t("Until 12:00") }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p class="font-bold text-gray-800 mb-4">
              {{ t("Payment Information") }}
            </p>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">{{ t("Payment Method") }}</span>
                <span class="font-medium text-gray-800 capitalize">{{
                  reservation.paymentMethod
                }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">{{ t("Payment Date") }}</span>
                <span class="font-medium text-gray-800">{{
                  reservation.paymentDate
                    ? formatDate(reservation.paymentDate)
                    : "—"
                }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">{{ t("Booked On") }}</span>
                <span class="font-medium text-gray-800">{{
                  formatDate(reservation.createdAt)
                }}</span>
              </div>
              <div class="border-t border-dashed border-gray-200 my-2" />
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-700">{{
                  t("Total Price")
                }}</span>
                <span class="font-bold text-[#07689F] text-lg"
                  >{{ reservation.totalPrice.toLocaleString() }} VNĐ</span
                >
              </div>
            </div>
          </div>

          <!-- Feedback -->
          <div
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div class="flex justify-between items-center mb-4">
              <p class="font-bold text-gray-800">{{ t("Your Review") }}</p>
              <NuxtLink
                v-if="
                  !reservation.hasFeedback &&
                  reservation.paymentStatus === 'Confirmed'
                "
                :to="`/reservation/${reservation.reservationId}/feedback`"
                class="text-sm text-[#07689F] font-semibold hover:underline"
              >
                {{ t("+ Write a review") }}
              </NuxtLink>
            </div>

            <template v-if="reservation.hasFeedback">
              <div class="flex items-center gap-1 mb-2">
                <i
                  v-for="s in 5"
                  :key="s"
                  :class="
                    s <= (reservation.rating ?? 0)
                      ? 'pi pi-star-fill text-yellow-400'
                      : 'pi pi-star text-gray-300'
                  "
                  class="text-sm"
                />
                <span class="ml-2 text-sm text-gray-500"
                  >({{ reservation.rating }}/5)</span
                >
              </div>
              <p class="text-gray-600 text-sm italic">
                "{{ reservation.comment }}"
              </p>
            </template>
            <template v-else>
              <p class="text-gray-400 text-sm">
                {{
                  reservation.paymentStatus === "Confirmed"
                    ? t("Share your experience with this hotel.")
                    : t(
                        "Reviews can be submitted after your stay is confirmed.",
                      )
                }}
              </p>
            </template>
          </div>
        </div>

        <!-- Right: Booking Summary Sidebar -->
        <div class="sticky top-6 space-y-4">
          <div
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p class="font-bold text-gray-800 mb-4">
              {{ t("Booking Summary") }}
            </p>

            <div class="flex items-center gap-2 mb-3">
              <i class="pi pi-hashtag text-[#07689F] text-sm" />
              <div>
                <p class="text-xs text-gray-400">{{ t("Booking Code") }}</p>
                <p class="font-bold text-gray-800 tracking-wider">
                  {{ reservation.bookingCode }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <i class="pi pi-id-card text-[#07689F] text-sm" />
              <div>
                <p class="text-xs text-gray-400">{{ t("Reservation ID") }}</p>
                <p class="font-medium text-gray-700">
                  #{{ reservation.reservationId }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <i
                class="pi pi-circle-fill text-xs"
                :class="statusDotClass(reservation.paymentStatus)"
              />
              <div>
                <p class="text-xs text-gray-400">{{ t("Status") }}</p>
                <p class="font-semibold text-gray-800">
                  {{ t(reservation.paymentStatus) }}
                </p>
              </div>
            </div>

            <!-- Copy booking code -->
            <button
              @click="copyCode"
              class="mt-5 w-full py-2.5 border border-[#07689F] text-[#07689F] rounded-lg text-sm font-semibold hover:bg-[#07689F] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i class="pi pi-copy text-sm" />
              {{ t("Copy Booking Code") }}
            </button>
          </div>

          <!-- Actions -->
          <div
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3"
          >
            <p class="font-bold text-gray-800 mb-1">{{ t("Actions") }}</p>
            <Button
              v-if="canCancel"
              :label="t('Cancel Reservation')"
              severity="danger"
              outlined
              class="w-full text-sm"
              :loading="reservationStore.isLoading"
              @click="showCancelDialog = true"
            />
            <NuxtLink
              to="/reservation"
              class="block text-center py-2.5 bg-[#07689F] text-white rounded-lg text-sm font-semibold hover:bg-[#055a8a] transition-colors"
            >
              {{ t("All Reservations") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Cancel Dialog -->
    <Dialog
      v-model:visible="showCancelDialog"
      modal
      :header="t('Cancel Reservation')"
      :style="{ width: '420px' }"
    >
      <p class="text-gray-600 mb-1">
        {{ t("Are you sure you want to cancel this reservation?") }}
      </p>
      <p class="font-semibold text-gray-800">{{ reservation?.bookingCode }}</p>
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
import ReservationDetailSkeleton from "~/components/reservation/ReservationDetailSkeleton.vue";
import { useToast } from "primevue/usetoast";

const { t } = useI18n();
useHead({ title: t("Reservation Detail") });

const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const toast = useToast();

const showCancelDialog = ref(false);
const reservation = computed(() => reservationStore.selectedReservation);
const canCancel = computed(
  () =>
    reservation.value?.paymentStatus === "Pending" ||
    reservation.value?.paymentStatus === "Confirmed",
);

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-600",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

function statusDotClass(status: string) {
  const map: Record<string, string> = {
    Confirmed: "text-green-500",
    Pending: "text-yellow-500",
    Cancelled: "text-red-500",
  };
  return map[status] ?? "text-gray-400";
}

async function copyCode() {
  if (reservation.value?.bookingCode) {
    await navigator.clipboard.writeText(reservation.value.bookingCode);
    toast.add({
      severity: "info",
      summary: t("Copied!"),
      detail: t("Booking code copied to clipboard."),
      life: 2000,
    });
  }
}

async function confirmCancel() {
  if (!reservation.value) return;
  const res = await reservationStore.cancelReservation(
    reservation.value.reservationId,
  );
  showCancelDialog.value = false;
  if (res?.success) {
    toast.add({
      severity: "success",
      summary: t("Cancelled"),
      detail: t("Reservation cancelled."),
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: reservationStore.error ?? t("Failed to cancel."),
      life: 3000,
    });
  }
}

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) return router.push("/reservation");
  await reservationStore.fetchReservationById(id);
});

onUnmounted(() => {
  reservationStore.clearSelectedReservation();
});
</script>
