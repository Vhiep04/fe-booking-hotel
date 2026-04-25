<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    :header="t('Delete Feedback')"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle text-4xl text-yellow-500"></i>
      <div>
        <p>
          {{
            t(
              "Are you sure you want to delete this feedback from {user} on {hotel}?",
              {
                user: feedback?.userName ?? t("Anonymous"),
                hotel: feedback?.hotelName,
              },
            )
          }}
        </p>
        <p class="text-sm text-(--admin-text-muted) mt-1">
          {{ t("This action cannot be undone.") }}
        </p>
      </div>
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
import type { AdminFeedbackDto } from "~/stores/admin/interfaces/feedbacks";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  feedback: AdminFeedbackDto | null;
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
