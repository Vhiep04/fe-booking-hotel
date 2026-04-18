<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-center gap-0">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
          >
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all',
                  currentStep > step.id
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : currentStep === step.id
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-gray-300 text-gray-400',
                ]"
              >
                <i v-if="currentStep > step.id" class="pi pi-check text-xs" />
                <span v-else>{{ step.id }}</span>
              </div>
              <span
                :class="[
                  'text-sm font-medium hidden sm:block',
                  currentStep >= step.id ? 'text-gray-800' : 'text-gray-400',
                ]"
                >{{ step.label }}</span
              >
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'h-px w-16 md:w-32 lg:w-48 mx-3',
                currentStep > step.id ? 'bg-blue-700' : 'bg-gray-300',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="roomStore.isLoading || paymentStore.isLoading"
      class="flex justify-center items-center py-32"
    >
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
    </div>

    <div
      v-else-if="roomStore.error"
      class="flex flex-col justify-center items-center py-32"
    >
      <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <p class="text-xl text-gray-700">{{ roomStore.error }}</p>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <CheckoutLeftPanel
          :hotel="hotel"
          :booking="booking"
          :price="price"
          :cancellation-policy="cancellationPolicy"
        />
        <CheckoutCenterPanel
          v-model:guest-details="guestDetails"
          v-model:special-request="specialRequest"
          v-model:arrival-time="arrivalTime"
          :booking="booking"
          :is-paying="paymentStore.isLoading"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
  <PaymentLoading
    v-model="isRedirecting"
    message="Đang chuyển hướng đến cổng thanh toán..."
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import CheckoutLeftPanel from "~/components/Booking/CheckoutLeftPanel.vue";
import CheckoutCenterPanel from "~/components/Booking/CheckoutCenterPanel.vue";
import { useGetRoomStore } from "~/stores/getRoom";
import { usePaymentStore } from "~/stores/payments";
import { useAuthStore } from "~/stores/auth";
import PaymentLoading from "~/components/shared/PaymentLoading.vue";
import dayjs from "dayjs";

const { t } = useI18n();
const router = useRouter();

useHead({
  title: t("Detail Booking"),
});

const route = useRoute();
const roomStore = useGetRoomStore();
const paymentStore = usePaymentStore();
const authStore = useAuthStore();
const hotelStore = useHotelStore();
const toast = useToast();

const currentStep = ref(2);

const steps = [
  { id: 1, label: "Your Selection" },
  { id: 2, label: "Your Details" },
  { id: 3, label: "Finish booking" },
];

const hotelId = computed(() => Number(route.query.hotelId));
const roomId = computed(() => Number(route.query.roomId));

const hotel = computed(() => {
  const r = roomStore.room;
  return {
    name: hotelStore.currentHotel?.name ?? `Hotel #${hotelId.value}`,
    address: hotelStore.currentHotel?.location ?? "",
    rating: 0,
    reviewCount: 0,
    reviewLabel: "",
    locationScore: 0,
    stars: 0,
    amenities:
      r?.facilities?.filter((f) =>
        ["WiFi", "Free Wifi", "Airport shuttle"].includes(f),
      ) ?? [],
    image: r?.imgUrl ?? "https://via.placeholder.com/400x200",
  };
});

const VAT_RATE = 0.08;
const DISCOUNT_RATE = 0.4;

const searchStore = useSearchStore();

const nights = computed(() => {
  const ci = searchStore.checkIn;
  const co = searchStore.checkOut;
  if (!ci || !co) return 1;
  return dayjs(co).diff(dayjs(ci), "day") || 1;
});

const guestDetails = ref({
  firstName: "",
  lastName: "",
  email: "",
  country: "Vietnam",
  phone: "",
});

const booking = computed(() => {
  const r = roomStore.room;
  const ci = searchStore.checkIn ?? dayjs().format("YYYY-MM-DD");
  const co = searchStore.checkOut ?? dayjs().add(1, "day").format("YYYY-MM-DD");
  const daysAway = dayjs(ci).diff(dayjs(), "day");

  return {
    checkIn: {
      date: dayjs(ci).format("ddd, MMM D, YYYY"),
      time: "2:00 PM",
    },
    checkOut: {
      date: dayjs(co).format("ddd, MMM D, YYYY"),
      time: "12:00 PM",
    },
    checkInDate: ci,
    checkOutDate: co,
    daysAway: daysAway > 0 ? daysAway : 0,
    nights: nights.value,
    rooms: 1,
    adults: r?.capacity ?? 2,
    room: {
      name: r?.roomType ?? "",
      guests: r?.capacity ?? 2,
      noSmoking: false,
      freeCancellationBefore: dayjs(ci)
        .subtract(3, "day")
        .format("MMMM D, YYYY"),
    },
  };
});
const price = computed(() => {
  const r = roomStore.room;
  const pricePerNight = r?.pricePerNight ?? 0;
  const total = pricePerNight * nights.value; // ✅ nhân số đêm
  const original = Math.round(total / (1 - DISCOUNT_RATE));
  const discount = original - total;
  const taxes = Math.round(total * VAT_RATE);

  return {
    original,
    discount,
    discountLabel: "Early 2026 Deal",
    pricePerNight,
    nights: nights.value,
    total,
    taxes,
    vatPercent: VAT_RATE * 100,
    currency: "VND",
  };
});

const cancellationPolicy = computed(() => ({
  freeBeforeDate: dayjs(searchStore.checkIn).subtract(3, "day").format("MMM D"),
  penaltyAfter: price.value.total,
  currency: "VND",
}));

const specialRequest = ref("");
const arrivalTime = ref("");

async function handleVnpayReturn() {
  const {
    vnp_ResponseCode,
    vnp_TxnRef,
    vnp_TransactionNo,
    vnp_OrderInfo,
    vnp_Amount,
  } = route.query as Record<string, string>;

  if (!vnp_ResponseCode) return;

  if (vnp_ResponseCode === "00") {
    const result = await paymentStore.sendReceipt({
      email: guestDetails.value.email,
      name: `${guestDetails.value.firstName} ${guestDetails.value.lastName}`,
      userId: authStore.userInfo?.userId ?? "",
      roomId: roomId.value,
      checkInDate: booking.value.checkInDate,
      checkOutDate: booking.value.checkOutDate,
      transactionId: vnp_TransactionNo ?? "",
      orderId: vnp_TxnRef ?? "",
      amount: Number(vnp_Amount ?? 0) / 100,
      paymentMethod: "VNPAY",
      orderDescription:
        vnp_OrderInfo ?? roomStore.room?.roomType ?? "Room booking",
    });

    if (result?.success) {
      currentStep.value = 3;
      toast.add({
        severity: "success",
        summary: "Đặt phòng thành công!",
        detail: result.message,
        life: 5000,
      });
    } else {
      toast.add({
        severity: "warn",
        summary: "Thanh toán thành công",
        detail: "Nhưng không thể gửi email xác nhận. Vui lòng liên hệ hỗ trợ.",
        life: 6000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Thanh toán thất bại",
      detail: `Mã lỗi VNPAY: ${vnp_ResponseCode}`,
      life: 5000,
    });
  }
}

const isRedirecting = ref(false);

async function handleSubmit(method: "vnpay" | "cash") {
  if (method === "vnpay") {
    const amount = price.value.total;
    if (!amount || amount < 5000) {
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: "Số tiền không hợp lệ.",
        life: 4000,
      });
      return;
    }

    const url = await paymentStore.createPayment({
      orderType: "other",
      amount,
      orderDescription: roomStore.room?.roomType ?? "Room booking",
      name: `${guestDetails.value.firstName} ${guestDetails.value.lastName}`,
    });

    if (url) {
      isRedirecting.value = true;
      // Delay nhỏ để tránh nháy, sau đó mới redirect
      await nextTick();
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    }
  } else {
    const r = roomStore.room;
    const result = await paymentStore.cashBooking({
      email: guestDetails.value.email,
      name: `${guestDetails.value.firstName} ${guestDetails.value.lastName}`,
      phoneNumber: guestDetails.value.phone,
      userId: authStore.userInfo?.userId ?? "",
      roomId: roomId.value,
      hotelName: hotel.value.name,
      hotelAddress: hotel.value.address,
      checkInDate: booking.value.checkInDate,
      checkOutDate: booking.value.checkOutDate,
      amount: price.value.total,
      orderDescription: r?.roomType ?? "Room booking",
    });

    if (result?.success) {
      sessionStorage.setItem(
        "cashBookingResponse",
        JSON.stringify({
          reservationId: result.reservationId,
          name: `${guestDetails.value.firstName} ${guestDetails.value.lastName}`,
          hotelName: hotel.value.name,
          hotelAddress: hotel.value.address,
          orderDescription: r?.roomType ?? "",
          checkInDate: booking.value.checkInDate,
          checkOutDate: booking.value.checkOutDate,
          amount: price.value.total,
          emailSent: result.emailSent,
          message: result.message,
        }),
      );
      router.push("/payment/cash-success");
    }
  }
}

// booking/index.vue — onMounted xử lý đầy đủ
onMounted(async () => {
  // Chặn user back về trang VNPAY sandbox
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
    // Redirect về hotel detail thay vì VNPAY
    const hId = searchStore.pendingHotelId;
    if (hId) router.replace(`/hotels/${hId}`);
  });

  // Lấy từ query, fallback về searchStore nếu mất (khi back)
  const hId = hotelId.value || searchStore.pendingHotelId;
  const rId = roomId.value || searchStore.pendingRoomId;

  if (!hId || !rId) {
    // Không có data gì cả → về trang chủ
    router.replace("/");
    return;
  }

  await Promise.all([
    roomStore.fetchRoom(hId, rId),
    hotelStore.getHotelById(hId),
  ]);

  await handleVnpayReturn();
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", () => {});
  roomStore.clearRoom();
  paymentStore.clearPayment();
});
</script>
