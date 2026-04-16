<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    header="Confirm Delete"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl text-yellow-500"></i>
      <span>
        Are you sure you want to delete <strong>{{ hotel?.name }}</strong
        >? This action cannot be undone.
      </span>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="deleting"
        @click="emit('update:modelValue', false)"
      />
      <Button
        label="Yes, Delete"
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
