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
}: Payload): Promise<ResponseDataType> =>
  $fetch(uri || `${baseURL}${endpoint}`, {
    headers,
    ...(method.toUpperCase() === "GET"
      ? { query: { ...params } }
      : { method, body: { ...data } }),
  });
