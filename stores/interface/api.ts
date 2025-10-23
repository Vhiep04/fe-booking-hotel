export type Method =
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "get"
  | "head"
  | "patch"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace";

export interface Payload {
  endpoint?: string;
  method?: Method;
  headers?: HeadersInit;
  baseURL?: string;
  params?: object;
  data?: object;
  uri?: string;
  auth?: boolean;
  extra?: string;
  proxy?: boolean;
}
