<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    @click="goToDetail"
  >
    <!-- Hotel Image -->
    <div class="relative w-[250px] shrink-0 overflow-hidden">
      <img
        :src="reservation.hotelImage || '/placeholder-hotel.jpg'"
        :alt="reservation.hotelName"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-linear-to-r from-transparent to-black/10"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 p-5 flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <div>
          <p class="font-bold text-gray-800 text-base">
            {{ reservation.hotelName }}
          </p>
          <p class="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <i class="pi pi-map-marker text-xs" />
            {{ reservation.hotelLocation }}, {{ reservation.cityName }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            {{ reservation.roomTypeName }} · {{ t("Room #")
            }}{{ reservation.roomNumber }}
          </p>
        </div>
        <span
          :class="statusClass"
          class="px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-4"
        >
          {{ t(reservation.paymentStatus) }}
        </span>
      </div>

      <!-- Dates -->
      <div class="flex items-center gap-6 mt-3 text-sm">
        <div>
          <p class="text-xs text-gray-400">{{ t("Check-in") }}</p>
          <p class="font-semibold text-gray-700">
            {{ formatDate(reservation.checkInDate) }}
          </p>
        </div>
        <div class="flex items-center gap-1 text-gray-300">
          <div class="h-px w-6 bg-gray-200" />
          <span class="text-xs text-gray-400"
            >{{ reservation.nights }}{{ t("n") }}</span
          >
          <div class="h-px w-6 bg-gray-200" />
        </div>
        <div>
          <p class="text-xs text-gray-400">{{ t("Check-out") }}</p>
          <p class="font-semibold text-gray-700">
            {{ formatDate(reservation.checkOutDate) }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-between items-center mt-3 pt-3 border-t border-gray-100"
      >
        <div>
          <span class="text-xs text-gray-400">{{ t("Booking Code:") }} </span>
          <span class="text-xs font-bold text-gray-700 tracking-wider">{{
            reservation.bookingCode
          }}</span>
        </div>
        <div class="flex items-center gap-3">
          <p class="font-bold text-[#07689F]">
            {{ reservation.totalPrice.toLocaleString() }} VNĐ
          </p>
          <Button
            v-if="canCancel"
            :label="t('Cancel')"
            severity="danger"
            size="small"
            outlined
            class="text-xs py-1 px-3"
            @click.stop="$emit('cancel', reservation)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{ reservation: UserReservation }>();
const emit = defineEmits<{ cancel: [r: UserReservation] }>();
const router = useRouter();

const canCancel = computed(
  () =>
    props.reservation.paymentStatus === "Pending" ||
    props.reservation.paymentStatus === "Confirmed",
);

function goToDetail() {
  router.push(`/reservation/${props.reservation.reservationId}`);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusClass = computed(() => {
  const map: Record<string, string> = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-600",
  };
  return map[props.reservation.paymentStatus] ?? "bg-gray-100 text-gray-600";
});
</script>
