<template>
  <div class="admin-card mb-6">
    <div class="admin-card-body">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText
            :modelValue="modelValue.search"
            @update:modelValue="update('search', $event)"
            :placeholder="t('Search by user, hotel...')"
            class="w-full"
          />
        </IconField>

        <Select
          :modelValue="modelValue.rating"
          @update:modelValue="update('rating', $event)"
          :options="ratingOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('All Ratings')"
          showClear
          class="w-full"
        />

        <div class="flex gap-2">
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            v-tooltip.top="t('Reset filters')"
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

const { t } = useI18n();

const props = defineProps<{ modelValue: FeedbackFiltersModel }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: FeedbackFiltersModel): void;
  (e: "reset"): void;
}>();

const ratingOptions = computed(() => [
  { label: "⭐⭐⭐⭐⭐ 5 " + t("Stars"), value: 5 },
  { label: "⭐⭐⭐⭐ 4 " + t("Stars"), value: 4 },
  { label: "⭐⭐⭐ 3 " + t("Stars"), value: 3 },
  { label: "⭐⭐ 2 " + t("Stars"), value: 2 },
  { label: "⭐ 1 " + t("Star"), value: 1 },
]);

function update<K extends keyof FeedbackFiltersModel>(
  key: K,
  value: FeedbackFiltersModel[K],
) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
