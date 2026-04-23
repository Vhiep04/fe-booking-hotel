<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '500px' }"
    header="Edit Feedback"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-5 pt-3">
      <!-- Read-only info -->
      <div
        class="p-3 rounded-lg bg-(--admin-surface-hover) flex items-center gap-3"
      >
        <Avatar
          :label="getInitial()"
          shape="circle"
          class="bg-(--admin-primary) text-white shrink-0"
        />
        <div>
          <p class="font-medium text-(--admin-text-color)">
            {{ feedback?.userName ?? "Anonymous" }}
          </p>
          <p class="text-xs text-(--admin-text-muted)">
            {{ feedback?.hotelName }}
          </p>
        </div>
      </div>

      <!-- Rating -->
      <div class="field">
        <label class="font-medium mb-2 block">
          Rating <span class="text-red-500">*</span>
        </label>
        <div class="flex items-center gap-2">
          <span
            v-for="i in 5"
            :key="i"
            class="pi cursor-pointer text-2xl transition-colors"
            :class="
              i <= form.rating
                ? 'pi-star-fill text-yellow-400'
                : 'pi-star text-gray-300 hover:text-yellow-300'
            "
            @click="form.rating = i"
          />
          <span class="ml-2 font-semibold text-(--admin-text-color)"
            >{{ form.rating }} / 5</span
          >
        </div>
        <small v-if="submitted && !form.rating" class="p-error"
          >Rating is required</small
        >
      </div>

      <!-- Comment -->
      <div class="field">
        <label class="font-medium mb-2 block">Comment</label>
        <Textarea
          v-model="form.comment"
          rows="4"
          placeholder="Enter feedback comment..."
          class="w-full resize-none"
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="saving"
        @click="emit('hide')"
      />
      <Button
        label="Save Changes"
        icon="pi pi-check"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import type { AdminFeedbackDto } from "~/stores/admin/interfaces/feedbacks";
import type { UpdateFeedbackPayload } from "~/stores/interface/request/feedback";

const props = defineProps<{
  modelValue: boolean;
  feedback: AdminFeedbackDto | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "hide"): void;
  (e: "save", id: number, payload: UpdateFeedbackPayload): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const submitted = ref(false);
const form = ref({ rating: 0, comment: "" });

watch(
  () => props.feedback,
  (f) => {
    form.value = { rating: f?.rating ?? 0, comment: f?.comment ?? "" };
    submitted.value = false;
  },
  { immediate: true },
);

function getInitial() {
  return (props.feedback?.userName ?? props.feedback?.userEmail ?? "?")
    .charAt(0)
    .toUpperCase();
}

function handleSave() {
  submitted.value = true;
  if (!form.value.rating) return;
  if (!props.feedback) return;
  emit("save", props.feedback.feedbackId, {
    rating: form.value.rating,
    comment: form.value.comment,
  });
}
</script>
