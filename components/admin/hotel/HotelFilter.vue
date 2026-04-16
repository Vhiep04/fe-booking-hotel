<template>
  <div class="admin-card mb-6">
    <div class="admin-card-body">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText
            :modelValue="modelValue.search"
            @update:modelValue="update('search', $event)"
            placeholder="Search hotels..."
            class="w-full"
          />
        </IconField>

        <Dropdown
          :modelValue="modelValue.cityId"
          @update:modelValue="update('cityId', $event)"
          :options="cities"
          optionLabel="name"
          optionValue="cityId"
          placeholder="All Cities"
          showClear
          class="w-full"
        />

        <Dropdown
          :modelValue="modelValue.status"
          @update:modelValue="update('status', $event)"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Status"
          showClear
          class="w-full"
        />

        <Dropdown
          :modelValue="modelValue.rating"
          @update:modelValue="update('rating', $event)"
          :options="ratingOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Ratings"
          showClear
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

export interface HotelFiltersModel {
  search: string;
  cityId: number | null;
  status: string | null;
  rating: number | null;
}

interface CityOption {
  cityId: number;
  name: string;
}

const props = defineProps<{
  modelValue: HotelFiltersModel;
  cities: CityOption[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: HotelFiltersModel): void;
}>();

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const ratingOptions = [
  { label: "5 Stars", value: 5 },
  { label: "4 Stars", value: 4 },
  { label: "3 Stars", value: 3 },
  { label: "2 Stars", value: 2 },
  { label: "1 Star", value: 1 },
];

function update<K extends keyof HotelFiltersModel>(
  key: K,
  value: HotelFiltersModel[K],
) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
