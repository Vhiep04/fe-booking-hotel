<template>
  <section class="max-w-6xl mx-auto px-4 md:px-8 py-6">
    <div class="text-center mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        {{ t("Flexible Payment Options") }}
      </h2>
      <p class="text-gray-500 text-base">
        {{ t("Pay online or at the property — we support both") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Online payment -->
      <div
        class="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5 items-start hover:shadow-md hover:border-[#07689F]/30 transition-all duration-300"
      >
        <div
          class="w-14 h-14 rounded-xl bg-[#E8F4FB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300"
        >
          <i class="pi pi-credit-card text-3xl text-[#07689F]" />
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-bold text-gray-900 text-base">
              {{ t("Pay Online") }}
            </h3>
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F4FB] text-[#07689F]"
            >
              {{ t("Instant Confirm") }}
            </span>
          </div>
          <p class="text-gray-500 text-base leading-relaxed mb-4">
            {{
              t(
                "Secure payment at checkout. Your room is reserved immediately — no waiting, no uncertainty.",
              )
            }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="key in onlinePerkKeys"
              :key="key"
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <i class="pi pi-check text-[#07689F] text-xs" />
              {{ t(key) }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Pay at property -->
      <div
        class="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5 items-start hover:shadow-md hover:border-emerald-300 transition-all duration-300"
      >
        <div
          class="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300"
        >
          <i class="pi pi-shield text-3xl text-emerald-600" />
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-bold text-gray-900 text-base">
              {{ t("Pay at Property") }}
            </h3>
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
            >
              {{ t("No Card Now") }}
            </span>
          </div>
          <p class="text-gray-500 text-base leading-relaxed mb-4">
            {{
              t(
                "No payment required today. Pay cash or card at the front desk when you check in.",
              )
            }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="key in propertyPerkKeys"
              :key="key"
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <i class="pi pi-check text-emerald-600 text-xs" />
              {{ t(key) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const onlinePerkKeys = [
  "Secured by SSL encryption",
  "Instant booking confirmation via email",
  "Easy refund for eligible cancellations",
];

const propertyPerkKeys = [
  "No upfront charge required",
  "Pay by cash, card, or transfer",
  "Free cancellation on most rooms",
];
</script>
