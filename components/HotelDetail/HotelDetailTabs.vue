<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
    <Tabs value="0">
      <TabList>
        <Tab
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="px-6 py-3 font-semibold text-gray-600 hover:text-blue-600 transition"
        >
          {{ tab.title }}
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0" class="p-6">
          <p class="text-gray-700 leading-relaxed">{{ description }}</p>
        </TabPanel>

        <TabPanel value="1" class="p-6">
          <div
            v-if="facilities && facilities.length"
            class="grid sm:grid-cols-2 md:grid-cols-3 gap-3"
          >
            <div
              v-for="facility in facilities"
              :key="facility"
              class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-gray-700"
            >
              <i
                :class="getFacilityIcon(facility)"
                class="text-blue-500 text-lg"
              ></i>
              <span class="text-sm font-medium">{{
                translateFacility(facility)
              }}</span>
            </div>
          </div>
          <div v-else class="text-gray-400 text-sm">
            {{ t("No amenities listed.") }}
          </div>
        </TabPanel>

        <!-- Place Rules Tab -->
        <TabPanel value="2" class="p-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold mb-3 text-gray-800">
                {{ t("Check-in/Check-out") }}
              </h3>
              <div class="space-y-2 text-gray-700">
                <div class="flex items-center gap-2">
                  <i class="pi pi-clock text-blue-600"></i>
                  <span>{{ t("Check-in: After 3:00 PM") }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-clock text-blue-600"></i>
                  <span>{{ t("Check-out: Before 11:00 AM") }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-3 text-gray-800">
                {{ t("House Rules") }}
              </h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start gap-2">
                  <i class="pi pi-ban text-red-500 mt-1"></i>
                  <span>{{ t("No smoking in the property") }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="pi pi-ban text-red-500 mt-1"></i>
                  <span>{{ t("No parties or events allowed") }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="pi pi-check text-green-600 mt-1"></i>
                  <span>{{ t("Pets allowed with prior approval") }}</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="pi pi-volume-off text-blue-600 mt-1"></i>
                  <span>{{ t("Quiet hours: 10:00 PM - 8:00 AM") }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-semibold mb-3 text-gray-800">
                {{ t("Cancellation Policy") }}
              </h3>
              <p class="text-gray-700 leading-relaxed">
                {{
                  t(
                    "Free cancellation up to 48 hours before check-in. After that, 50% of the booking amount will be charged. No refund for cancellations within 24 hours of check-in.",
                  )
                }}
              </p>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primevue";
import { useFacilityTranslation } from "~/composables/useTranslation";

const { translateFacility } = useFacilityTranslation();
interface Props {
  description: string;
  facilities?: string[];
}

defineProps<Props>();

const { t } = useI18n();

const tabs = computed(() => [
  { title: t("Place Details"), value: "0" },
  { title: t("Facilities"), value: "1" },
  { title: t("Place Rules"), value: "2" },
]);

const getFacilityIcon = (name: string): string => {
  const iconMap: Record<string, string> = {
    WiFi: "pi pi-wifi",
    "Own Bathroom": "pi pi-home",
    Kitchen: "pi pi-building",
    "Sea View": "pi pi-eye",
    "Baby Bed": "pi pi-heart",
    Bathtub: "pi pi-home",
    "Air Conditioning": "pi pi-sun",
    Balcony: "pi pi-building",
    "Mini Bar": "pi pi-ticket",
    "Safe Box": "pi pi-lock",
    TV: "pi pi-tablet",
    "Coffee Maker": "pi pi-ticket",
    "Breakfast Included": "pi pi-calendar",
    "Free Cancellation": "pi pi-check",
    Pool: "pi pi-heart",
    "All-Inclusive": "pi pi-star",
    "Pet Friendly": "pi pi-heart",
    Gym: "pi pi-heart",
    Spa: "pi pi-heart",
    Restaurant: "pi pi-building",
  };
  return iconMap[name] || "pi pi-check-circle";
};
</script>

<style scoped>
:deep(.p-tablist) {
  background: transparent;
}
:deep(.p-tab) {
  border-bottom: 2px solid transparent;
}
:deep(.p-tab.p-tab-active) {
  color: #2563eb;
  border-bottom-color: #2563eb;
}
</style>
