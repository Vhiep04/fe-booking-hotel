<template>
  <Dialog
    v-model:visible="visible"
    :header="t('Delete Room')"
    modal
    :style="{ width: '450px' }"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl text-yellow-500" />
      <p>
        {{ t("Are you sure you want to delete room") }}
        <strong>{{ room?.roomNumber }}</strong>
        ({{ room?.roomType }})?
        {{ t("This action cannot be undone.") }}
      </p>
    </div>
    <template #footer>
      <Button
        :label="t('Cancel')"
        severity="secondary"
        outlined
        :disabled="deleting"
        @click="emit('update:modelValue', false)"
      />
      <Button
        :label="t('Delete')"
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
import type { RoomDto } from "~/stores/admin/interfaces/rooms";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  room: RoomDto | null;
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
