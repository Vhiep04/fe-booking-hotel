import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "./api";
import type {
  CashBookingPayload,
  PaymentPayload,
  SendReceiptPayload,
} from "./interface/request/payments";
import type {
  CashBookingRes,
  CreatePaymentRes,
  SendReceiptRes,
} from "./interface/response/payments";

export const usePaymentStore = defineStore("payment", () => {
  const apiStore = useApiStore();

  const paymentUrl = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function createPayment(
    payload: PaymentPayload,
  ): Promise<string | null> {
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
        return response.paymentUrl;
      }
      error.value = "Failed to get payment URL";
      return null;
    } catch (e) {
      error.value = "An error occurred while creating payment";
      console.error(e);
      return null;
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

  async function cashBooking(payload: CashBookingPayload) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiStore.apiRequest<CashBookingRes>({
        endpoint: "/Payment/cash-booking",
        method: "POST",
        data: payload,
        auth: true,
      });

      return response;
    } catch (e) {
      error.value = "An error occurred while processing cash booking";
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
    cashBooking,
    clearPayment,
  };
});
