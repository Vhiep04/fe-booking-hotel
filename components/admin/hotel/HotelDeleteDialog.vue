<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    :header="t('Confirm Delete')"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl text-yellow-500"></i>
      <span
        v-html="
          t(
            'Are you sure you want to delete hotel {name}? This action cannot be undone.',
            { name: `<strong>${hotel?.name}</strong>` },
          )
        "
      />
    </div>
    <template #footer>
      <Button
        :label="t('No')"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="deleting"
        @click="emit('update:modelValue', false)"
      />
      <Button
        :label="t('Yes, Delete')"
        icon="pi pi-trash"
        severity="danger"
        :loading="deleting"
        @click="emit('confirm')"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { Hotel } from "~/stores/admin/interfaces/hotels";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  hotel: Hotel | null;
  deleting: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
