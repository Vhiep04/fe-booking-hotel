import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiHost: process.env.NUXT_PUBLIC_API_HOST,
    },
  },
  css: [
    "~/assets/css/main.css", // Tailwind phải ở đầu
    "primeicons/primeicons.css",
    // PrimeVue CSS khác (nếu có)
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@pinia/nuxt"],

  build: {
    transpile: ["primevue"],
  },
});
