import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "./api";
import type { PaymentPayload } from "./interface/request/payments";
import type { CreatePaymentRes } from "./interface/response/payments";

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

  function clearPayment() {
    paymentUrl.value = null;
    error.value = null;
  }

  return { paymentUrl, isLoading, error, createPayment, clearPayment };
});
