<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '560px' }"
    :header="t('Feedback Details')"
    :modal="true"
  >
    <div v-if="feedback" class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-(--admin-text-muted)">{{
            t("User")
          }}</label>
          <div class="flex items-center gap-2 mt-1">
            <Avatar
              :label="getInitial(feedback)"
              shape="circle"
              class="bg-(--admin-primary) text-white"
            />
            <div>
              <p class="font-medium text-(--admin-text-color)">
                {{ feedback.userName ?? t("Anonymous") }}
              </p>
              <p class="text-xs text-(--admin-text-muted)">
                {{ feedback.userEmail }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label class="text-sm text-(--admin-text-muted)">{{
            t("Hotel")
          }}</label>
          <p class="font-medium text-(--admin-text-color) mt-1">
            {{ feedback.hotelName }}
          </p>
          <p class="text-xs text-(--admin-text-muted)">
            {{ t("Hotel ID: {id}", { id: feedback.hotelId }) }}
          </p>
        </div>
      </div>

      <Divider />

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-(--admin-text-muted)">{{
            t("Rating")
          }}</label>
          <div class="flex items-center gap-1 mt-1">
            <span
              v-for="i in 5"
              :key="i"
              class="pi"
              :class="
                i <= feedback.rating
                  ? 'pi-star-fill text-yellow-400'
                  : 'pi-star text-gray-300'
              "
            />
            <span class="ml-1 font-bold text-(--admin-text-color)">
              {{ feedback.rating }} / 5
            </span>
          </div>
        </div>

        <div>
          <label class="text-sm text-(--admin-text-muted)">{{
            t("Submitted")
          }}</label>
          <p class="font-medium text-(--admin-text-color) mt-1">
            {{ formatDate(feedback.createdAt) }}
          </p>
        </div>
      </div>

      <div v-if="feedback.reservationId">
        <label class="text-sm text-(--admin-text-muted)">{{
          t("Reservation")
        }}</label>
        <p class="font-medium text-(--admin-primary) mt-1">
          #{{ feedback.reservationId }}
        </p>
      </div>

      <Divider />

      <div>
        <label class="text-sm text-(--admin-text-muted)">{{
          t("Comment")
        }}</label>
        <p
          class="mt-2 text-(--admin-text-color) leading-relaxed bg-(--admin-surface-hover) rounded-lg p-3 text-sm"
        >
          {{ feedback.comment || t("No comment provided.") }}
        </p>
      </div>
    </div>

    <template #footer>
      <!-- <Button
        :label="t('Edit')"
        icon="pi pi-pencil"
        severity="secondary"
        outlined
        @click="emit('edit', feedback!)"
      /> -->
      <!-- <Button :label="t('Close')" @click="emit('update:modelValue', false)" /> -->
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import type { AdminFeedbackDto } from "~/stores/admin/interfaces/feedbacks";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  feedback: AdminFeedbackDto | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "edit", feedback: AdminFeedbackDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function getInitial(f: AdminFeedbackDto) {
  return (f.userName ?? f.userEmail ?? "?").charAt(0).toUpperCase();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
