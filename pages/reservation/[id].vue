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
                class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"
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

            <button
              v-if="canCancel"
              :disabled="reservationStore.isLoading"
              @click="showCancelDialog = true"
              class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-300 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                v-if="!reservationStore.isLoading"
                class="pi pi-times-circle text-sm"
              />
              <i v-else class="pi pi-spin pi-spinner text-sm" />
              {{ t("Cancel Reservation") }}
            </button>

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

    <Dialog
      v-model:visible="showCancelDialog"
      modal
      :header="t('Cancel reservation')"
      :style="{ width: '420px' }"
      :closable="!reservationStore.isLoading"
    >
      <div
        class="bg-gray-100 rounded-lg px-4 py-3 mb-4 flex items-center justify-between"
      >
        <div>
          <p class="text-[11px] text-gray-400 mb-0.5">
            {{ t("Booking code") }}
          </p>
          <p class="text-sm font-semibold tracking-wider text-gray-800">
            {{ reservation?.bookingCode }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-[11px] text-gray-400 mb-0.5">{{ t("Nhận phòng") }}</p>
          <p class="text-sm font-medium text-gray-800">
            {{ formatDate(reservation?.checkInDate ?? "") }}
          </p>
        </div>
      </div>

      <div
        class="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 mb-5"
      >
        <i
          class="pi pi-info-circle text-red-400 text-sm mt-0.5 flex-shrink-0"
        />
        <p class="text-xs text-red-600 leading-relaxed">
          {{
            t(
              "This action cannot be undone. Once cancelled, your booking will be permanently removed.",
            )
          }}
        </p>
      </div>

      <template #footer>
        <div class="flex gap-2 w-full">
          <button
            :disabled="reservationStore.isLoading"
            @click="showCancelDialog = false"
            class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {{ t("Keep booking") }}
          </button>
          <button
            :disabled="reservationStore.isLoading"
            @click="confirmCancel"
            class="flex-1 py-2.5 border border-red-200 bg-red-50 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i
              v-if="reservationStore.isLoading"
              class="pi pi-spin pi-spinner text-xs"
            />
            <i v-else class="pi pi-times-circle text-xs" />
            {{ t("Yes, cancel") }}
          </button>
        </div>
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import ReservationDetailSkeleton from "~/components/reservation/ReservationDetailSkeleton.vue";
import { useToast } from "primevue/usetoast";
import { Dialog } from "primevue";

const { t } = useI18n();
useHead({ title: t("Reservation Detail") });

const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const toast = useToast();

const showCancelDialog = ref(false);
const reservation = computed(() => reservationStore.selectedReservation);

const canCancel = computed(() => {
  const r = reservation.value;
  if (!r) return false;

  const isAllowedStatus =
    r.paymentStatus === "Pending" || r.paymentStatus === "Confirmed";

  const checkInDate = new Date(r.checkInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFutureCheckIn = checkInDate > today;

  return isAllowedStatus && isFutureCheckIn;
});

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
