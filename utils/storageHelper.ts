import { Cookies } from "js-cookie";

interface CookieAttributes {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

const setStorage = (key: string, value: string | number) => {
  window.localStorage.setItem(key, value.toString());
};
const getStorage = (key: string) => window.localStorage.getItem(key) || "";

const deleteStorage = (key: string) => window.localStorage.removeItem(key);

const setSession = (key: string, value: string | number) => {
  window.sessionStorage.setItem(key, value.toString());
};

const getSession = (key: string) => window.sessionStorage.getItem(key) || "";

const deleteSession = (key: string) => window.sessionStorage.removeItem(key);

const setCookie = (
  key: string,
  value: string | number,
  attributes?: CookieAttributes
) => {
  Cookies.set(key, value.toString(), attributes);
};

const getCookie = (key: string) => Cookies.get(key) || "";

const deleteCookie = (key: string, attributes?: CookieAttributes) => {
  Cookies.remove(key, attributes);
};

export {
  setStorage,
  getStorage,
  deleteStorage,
  setSession,
  getSession,
  deleteSession,
  setCookie,
  getCookie,
  deleteCookie,
};
