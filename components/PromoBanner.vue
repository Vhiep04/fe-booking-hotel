<template>
  <section class="py-4">
    <div
      class="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-400 to-amber-500 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div
        class="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none"
      />
      <div
        class="absolute -bottom-10 right-24 w-28 h-28 rounded-full bg-white/10 pointer-events-none"
      />

      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-gift text-white text-base" />
          <span
            class="text-white/80 text-sm font-semibold uppercase tracking-widest"
          >
            {{ t("Member Exclusive") }}
          </span>
        </div>
        <h3 class="text-white font-bold text-xl mb-2">
          {{ t("Sign up & unlock member-only deals") }}
        </h3>
        <p class="text-white/80 text-base">
          {{
            t("Lower prices, early access to promotions, and faster checkout")
          }}
        </p>
      </div>

      <div class="relative z-10 flex gap-3 shrink-0">
        <Button
          :label="t('Log In')"
          outlined
          class="rounded-xl! font-bold! text-white! border-white/60! hover:bg-white/10! text-base!"
          @click="router.push('/login')"
        />
        <Button
          :label="t('Sign Up Free')"
          class="rounded-xl! font-bold! bg-white! border-white! text-amber-500! hover:bg-amber-50! text-base!"
          @click="router.push('/register')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "primevue/button";

const router = useRouter();
const { t } = useI18n();
</script>
