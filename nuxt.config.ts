import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiHost: process.env.NUXT_PUBLIC_API_HOST || "http://localhost:5000",
    },
  },

  css: ["~/assets/css/main.css", "primeicons/primeicons.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],

  i18n: {
    defaultLocale: "en",

    strategy: "no_prefix",

    langDir: "locales/",

    locales: [
      {
        code: "en",
        iso: "en-US",
        file: "en.json",
        name: "English",
      },
      {
        code: "vi",
        iso: "vi-VN",
        file: "vi.json",
        name: "Tiếng Việt",
      },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_language",
      alwaysRedirect: false,
      fallbackLocale: "en",
    },
  },

  build: {
    transpile: ["primevue"],
  },

  // Config cho ofetch global
  app: {
    head: {
      // title: "Booking.com",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  // Nitro config cho proxy (development only)
  nitro: {
    devProxy: {
      "/api": {
        target: "https://localhost:44329",
        changeOrigin: true,
        secure: false, // Bỏ qua SSL certificate error
        ws: true,
      },
    },
  },

  experimental: {
    payloadExtraction: false, // Tắt nếu gặp lỗi hydration
  },
  plugins: ["~/plugins/dayjs"],
});
