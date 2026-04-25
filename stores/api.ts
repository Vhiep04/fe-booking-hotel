import { useAuthStore } from "@/stores/auth";
import { defineStore } from "pinia";
import type { Payload } from "./interface/api";
import { $fetch } from "ofetch";

export const useApiStore = defineStore("api", () => {
  const authStore = useAuthStore();

  async function apiRequest<ResponseDataType>(payload: Payload) {
    let { headers } = payload;

    if (payload.data instanceof FormData) {
      const { "Content-Type": _, ...rest } = (headers ?? {}) as Record<
        string,
        string
      >;
      headers = rest;
    }

    if (payload.auth) {
      headers = {
        ...headers,
        Authorization: `Bearer ${authStore.token}`,
      };
    }

    try {
      let response = null;
      if (payload?.proxy) {
        response = await $fetch<ResponseDataType>("/api/call", {
          method: "POST",
          body: { ...payload, headers },
          credentials: "include",
        });
      } else {
        response = await requestHelper<ResponseDataType>({
          ...payload,
          headers,
          credentials: "include",
        });
      }
      return response;
    } catch (e: any) {
      console.log(e);

      if (e?.data) {
        return e.data as ResponseDataType;
      }

      throw e;
    }
  }

  return { apiRequest };
});

export default null;
