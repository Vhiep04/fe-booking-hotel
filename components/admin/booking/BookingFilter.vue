<template>
  <div class="admin-card mb-6">
    <div class="admin-card-body">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters.search"
            :placeholder="t('Search bookings...')"
            class="w-full"
          />
        </IconField>

        <Dropdown
          v-model="filters.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('All Status')"
          showClear
          class="w-full"
        />

        <Calendar
          v-model="filters.dateFrom"
          :placeholder="t('From Date')"
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
        />

        <Calendar
          v-model="filters.dateTo"
          :placeholder="t('To Date')"
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";

export interface BookingFiltersModel {
  search: string;
  status: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

const { t } = useI18n();

const filters = defineModel<BookingFiltersModel>({ required: true });

const statusOptions = computed(() => [
  { label: t("Pending"), value: "Pending" },
  { label: t("Confirmed"), value: "Confirmed" },
  { label: t("Completed"), value: "Completed" },
  { label: t("Cancelled"), value: "Cancelled" },
  { label: t("Refunded"), value: "Refunded" },
]);
</script>
