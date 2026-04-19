<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600 mb-4 block" />
      <p class="text-gray-600">Đang xử lý thanh toán...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaymentStore } from "~/stores/payments";
const { t } = useI18n();

definePageMeta({ layout: false });

useHead({
  title: t("Payment Processing"),
});

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();

onMounted(async () => {
  const q = route.query as Record<string, string>;

  if (q.vnp_ResponseCode !== "00") {
    router.replace({
      path: "/booking",
      query: { paymentError: q.vnp_ResponseCode },
    });
    return;
  }

  const stored = sessionStorage.getItem("pendingBooking");
  const guest = stored ? JSON.parse(stored) : null;

  if (!guest) {
    router.replace("/");
    return;
  }

  const result = await paymentStore.sendReceipt({
    email: guest.guestDetails?.email ?? "",
    name: `${guest.guestDetails?.firstName ?? ""} ${guest.guestDetails?.lastName ?? ""}`.trim(),
    userId: String(guest.userId ?? ""),
    roomId: Number(guest.roomId ?? 0),
    checkInDate: guest.checkInDate ?? "",
    checkOutDate: guest.checkOutDate ?? "",
    transactionId: q.vnp_TransactionNo ?? "",
    orderId: q.vnp_TxnRef ?? "",
    amount: Number(q.vnp_Amount ?? 0) / 100,
    paymentMethod: q.vnp_CardType ?? "VnPay",
    orderDescription: q.vnp_OrderInfo ?? "",
    // ✅ Thêm 3 field còn thiếu
    phoneNumber: guest.guestDetails?.phone ?? "",
    hotelName: guest.hotelName ?? "",
    hotelAddress: guest.hotelAddress ?? "",
  });

  sessionStorage.removeItem("pendingBooking");

  sessionStorage.setItem(
    "paymentResponse",
    JSON.stringify({
      success: true,
      reservationId: result?.reservationId ?? null,
      emailSent: result?.emailSent ?? false,
      message: result?.message ?? "",
      orderDescription: q.vnp_OrderInfo ?? "",
      transactionId: q.vnp_TransactionNo ?? "",
      orderId: q.vnp_TxnRef ?? "",
      amount: Number(q.vnp_Amount ?? 0) / 100,
      paymentMethod: q.vnp_CardType ?? "VnPay",
      token: q.vnp_SecureHash ?? "",
      hotelName: guest.hotelName ?? "",
      hotelAddress: guest.hotelAddress ?? "",
      checkInDate: guest.checkInDate ?? "",
      checkOutDate: guest.checkOutDate ?? "",
      guestName:
        `${guest.guestDetails?.firstName ?? ""} ${guest.guestDetails?.lastName ?? ""}`.trim(),
      phoneNumber: guest.guestDetails?.phone ?? "",
    }),
  );

  router.replace("/payment/success");
});
</script>
