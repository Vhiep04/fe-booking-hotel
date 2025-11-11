import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura"; // hoặc Lara / Saga tùy bạn

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });
});
