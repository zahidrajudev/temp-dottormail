import axios from "axios";
import { getCookie } from "cookies-next";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-url-not-found",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  withXSRFToken: true,
});

api.interceptors.request.use((config) => {
  // If locale already provided manually → don't touch
  if (config.params?.locale) {
    return config;
  }

  let currentLocale = "";

  // 🥇 1. First priority → Zustand runtime state
  const storeLocale = useLanguageStore.getState().appSelectedLocale;

  if (storeLocale?.code) {
    currentLocale = storeLocale.code;
  }

  // 🥈 2. If store empty (first load) → URL
  if (!currentLocale && typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    currentLocale = urlParams.get("locale") || "";
  }

  // 🥉 3. Fallback → Cookie
  if (!currentLocale) {
    currentLocale = (getCookie("locale") as string) || "en";
  }

  config.params = {
    locale: currentLocale,
    ...config.params,
  };

  return config;
});

export default api;
