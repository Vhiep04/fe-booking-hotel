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

  modules: ["@pinia/nuxt"],

  build: {
    transpile: ["primevue"],
  },

  // Config cho ofetch global
  app: {
    head: {
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
