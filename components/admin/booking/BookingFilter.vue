<template>
  <div class="admin-card mb-6">
    <div class="admin-card-body">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters.search"
            placeholder="Search bookings..."
            class="w-full"
          />
        </IconField>

        <Dropdown
          v-model="filters.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Status"
          showClear
          class="w-full"
        />

        <Calendar
          v-model="filters.dateFrom"
          placeholder="From Date"
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
        />

        <Calendar
          v-model="filters.dateTo"
          placeholder="To Date"
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

const filters = defineModel<BookingFiltersModel>({ required: true });

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Refunded", value: "Refunded" },
];
</script>
