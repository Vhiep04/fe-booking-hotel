<template>
  <div class="admin-card mb-6">
    <div class="admin-card-body">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText
            :modelValue="modelValue.search"
            @update:modelValue="
              emit('update:modelValue', { ...modelValue, search: $event })
            "
            :placeholder="t('Search users...')"
            class="w-full"
          />
        </IconField>

        <Dropdown
          :modelValue="modelValue.role"
          @update:modelValue="
            emit('update:modelValue', { ...modelValue, role: $event })
          "
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('All Roles')"
          showClear
          class="w-full"
        />

        <Dropdown
          :modelValue="modelValue.status"
          @update:modelValue="
            emit('update:modelValue', { ...modelValue, status: $event })
          "
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('All Status')"
          showClear
          class="w-full"
        />

        <Calendar
          :modelValue="modelValue.joinedDate"
          @update:modelValue="
            emit('update:modelValue', { ...modelValue, joinedDate: $event })
          "
          :placeholder="t('Joined After')"
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

export interface UserFiltersModel {
  search: string;
  role: string | null;
  status: string | null;
  joinedDate: Date | null;
}

const { t } = useI18n();

const props = defineProps<{ modelValue: UserFiltersModel }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: UserFiltersModel): void;
}>();

const roleOptions = computed(() => [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Customer", value: "Customer" },
]);

const statusOptions = computed(() => [
  { label: t("Active"), value: "Active" },
  { label: t("Locked"), value: "Locked" },
]);
</script>
