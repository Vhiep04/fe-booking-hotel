import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiHost: process.env.NUXT_PUBLIC_API_HOST || "http://localhost:5000",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://localhost:44329",
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
  },

  css: ["~/assets/css/main.css", "primeicons/primeicons.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],

  i18n: {
    defaultLocale: "vi",

    strategy: "no_prefix",

    langDir: "locales/",

    locales: [
      {
        code: "en",
        iso: "en-US",
        files: ["en.json", "admin-en.json"],
        name: "English",
      },
      {
        code: "vi",
        iso: "vi-VN",
        files: ["vi.json", "admin-vi.json"],
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

  app: {
    head: {
      // title: "Booking.com",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

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
