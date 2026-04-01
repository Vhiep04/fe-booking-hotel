import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "./api";
import type { PaymentPayload } from "./interface/request/payments";
import type { CreatePaymentRes } from "./interface/response/payments";

export interface SendReceiptPayload {
  email: string;
  name: string;
  userId: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  transactionId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  orderDescription: string;
}

export interface SendReceiptRes {
  success: boolean;
  reservationId: number;
  emailSent: boolean;
  message: string;
}

export const usePaymentStore = defineStore("payment", () => {
  const apiStore = useApiStore();

  const paymentUrl = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function createPayment(payload: PaymentPayload) {
    isLoading.value = true;
    error.value = null;
    paymentUrl.value = null;

    try {
      const response = await apiStore.apiRequest<CreatePaymentRes>({
        endpoint: "/Payment/create-payment",
        method: "POST",
        data: payload,
        auth: true,
      });

      if (response?.paymentUrl) {
        paymentUrl.value = response.paymentUrl;
        window.location.href = response.paymentUrl;
      } else {
        error.value = "Failed to get payment URL";
      }
    } catch (e) {
      error.value = "An error occurred while creating payment";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function sendReceipt(payload: SendReceiptPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<SendReceiptRes>({
        endpoint: "/Payment/send-receipt",
        method: "POST",
        data: payload,
        auth: true,
      });

      return response;
    } catch (e) {
      error.value = "An error occurred while sending receipt";
      console.error(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  function clearPayment() {
    paymentUrl.value = null;
    error.value = null;
  }

  return {
    paymentUrl,
    isLoading,
    error,
    createPayment,
    sendReceipt,
    clearPayment,
  };
});
