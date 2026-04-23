<template>
  <div class="admin-card mb-6">
    <div class="admin-card-body">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText
            :modelValue="modelValue.search"
            @update:modelValue="update('search', $event)"
            placeholder="Search by user, hotel..."
            class="w-full"
          />
        </IconField>

        <Select
          :modelValue="modelValue.rating"
          @update:modelValue="update('rating', $event)"
          :options="ratingOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Ratings"
          showClear
          class="w-full"
        />

        <div class="flex gap-2">
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            v-tooltip.top="'Reset filters'"
            @click="emit('reset')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from "primevue/select";
import Button from "primevue/button";

export interface FeedbackFiltersModel {
  search: string;
  rating: number | null;
}

const props = defineProps<{ modelValue: FeedbackFiltersModel }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: FeedbackFiltersModel): void;
  (e: "reset"): void;
}>();

const ratingOptions = [
  { label: "⭐⭐⭐⭐⭐ 5 Stars", value: 5 },
  { label: "⭐⭐⭐⭐ 4 Stars", value: 4 },
  { label: "⭐⭐⭐ 3 Stars", value: 3 },
  { label: "⭐⭐ 2 Stars", value: 2 },
  { label: "⭐ 1 Star", value: 1 },
];

function update<K extends keyof FeedbackFiltersModel>(
  key: K,
  value: FeedbackFiltersModel[K],
) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
