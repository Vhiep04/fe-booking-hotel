import { $fetch } from "ofetch";
import { useRuntimeConfig } from "#app";
import type { Payload } from "../stores/interface/api";

export default <ResponseDataType>({
  endpoint = "",
  baseURL = useRuntimeConfig().public.apiHost,
  method = "GET",
  params = {},
  data = {},
  uri = "",
  headers = {},
  credentials,
}: Payload): Promise<ResponseDataType> => {
  const isFormData = data instanceof FormData;

  // Xóa Content-Type nếu là FormData để browser tự set boundary
  const finalHeaders = isFormData
    ? Object.fromEntries(
        Object.entries(headers as Record<string, string>).filter(
          ([k]) => k.toLowerCase() !== "content-type",
        ),
      )
    : headers;

  return $fetch(uri || `${baseURL}${endpoint}`, {
    method,
    headers: finalHeaders,
    credentials: credentials || "include",
    ...(method.toUpperCase() === "GET"
      ? { query: { ...params } }
      : { body: isFormData ? data : { ...data } }), // ✅ giữ nguyên FormData
  });
};
