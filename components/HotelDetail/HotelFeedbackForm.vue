<template>
  <section class="py-10">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Section heading -->
      <div class="flex items-center gap-3 mb-6">
        <span class="inline-block w-1 h-7 rounded-full bg-amber-400" />
        <h2 class="text-2xl font-bold text-gray-900">
          {{ t("Leave a Review") }}
        </h2>
      </div>

      <div
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <!-- NOT LOGIN -->
        <div
          v-if="!isLoggedIn"
          class="flex flex-col items-center py-14 px-6 text-center"
        >
          <div
            class="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-4"
          >
            <i class="pi pi-lock text-2xl text-amber-400" />
          </div>
          <p class="text-gray-600 font-medium mb-1">
            {{ t("Sign in to share your experience") }}
          </p>
          <p class="text-gray-400 text-sm mb-6">
            {{ t("Your review helps other travelers make better choices") }}
          </p>
          <Button
            :label="t('Log In to Review')"
            icon="pi pi-sign-in"
            class="bg-amber-400! border-amber-400! hover:bg-amber-500! hover:border-amber-500! text-white! font-semibold! rounded-xl! px-6!"
            @click="router.push('/login')"
          />
        </div>

        <!-- NOT ELIGIBLE -->
        <div
          v-else-if="!canLeaveFeedback && !existingFeedback"
          class="flex flex-col items-center py-14 px-6 text-center"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4"
          >
            <i class="pi pi-calendar-times text-2xl text-blue-400" />
          </div>
          <p class="text-gray-600 font-medium mb-1">
            {{ t("Stay first, then review") }}
          </p>
          <p class="text-gray-400 text-sm mb-6">
            {{ t("Only guests who have completed a stay can leave a review") }}
          </p>
          <Button
            :label="t('Book a Room')"
            icon="pi pi-arrow-down"
            class="bg-amber-400! border-amber-400! text-white! font-semibold! rounded-xl! px-6!"
            @click="emit('scrollToRooms')"
          />
        </div>

        <template v-else>
          <!-- EXISTING REVIEW -->
          <div v-if="existingFeedback && !isEditing" class="p-6 md:p-8">
            <div class="flex items-start gap-4">
              <div
                class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm"
                :style="{ background: avatarColor }"
              >
                {{ userInitial }}
              </div>

              <div class="flex-1 min-w-0">
                <div
                  class="flex flex-wrap items-start justify-between gap-3 mb-2"
                >
                  <div>
                    <p class="font-semibold text-gray-900 text-sm">
                      {{ displayName }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <Rating
                        :model-value="existingFeedback.rating"
                        :stars="5"
                        readonly
                        :cancel="false"
                      />
                      <Tag
                        :value="`${existingFeedback.rating}/5`"
                        severity="warn"
                        class="rounded-full! text-xs! font-bold!"
                      />
                    </div>
                  </div>

                  <div class="flex gap-2 shrink-0">
                    <Button
                      :label="t('Edit')"
                      icon="pi pi-pencil"
                      size="small"
                      severity="info"
                      outlined
                      class="rounded-lg! text-xs!"
                      @click="startEdit"
                    />
                    <Button
                      :label="t('Delete')"
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      outlined
                      class="rounded-lg! text-xs!"
                      @click="showDeleteDialog = true"
                    />
                  </div>
                </div>

                <p class="text-gray-600 text-sm leading-relaxed">
                  {{ existingFeedback.comment }}
                </p>

                <div class="flex items-center gap-3 mt-3">
                  <span
                    class="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium"
                  >
                    <i class="pi pi-verified text-[10px]" />
                    {{ t("Verified") }}
                  </span>
                  <span class="text-xs text-gray-400">
                    <i class="pi pi-calendar mr-1" />
                    {{ formatDate(existingFeedback.createdAt) }}
                  </span>
                </div>
              </div>
            </div>

            <Message
              v-if="successMsg"
              severity="success"
              class="mt-4 rounded-xl!"
              :closable="false"
            >
              {{ successMsg }}
            </Message>
          </div>

          <!-- FORM -->
          <form v-else class="p-6 md:p-8" @submit.prevent="handleSubmit">
            <Message
              v-if="isEditing"
              severity="info"
              class="mb-5 rounded-xl!"
              :closable="false"
            >
              {{ t("You are editing your existing review") }}
            </Message>

            <!-- Rating -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ t("Your Rating") }}
                <span class="text-red-400 ml-0.5">*</span>
              </label>

              <div class="flex flex-wrap items-center gap-3">
                <Rating
                  v-model="form.rating"
                  :stars="5"
                  :cancel="false"
                  :pt="{
                    onIcon: { class: 'text-amber-400! text-2xl!' },
                    offIcon: { class: 'text-gray-300! text-2xl!' },
                  }"
                />

                <Tag
                  v-if="form.rating"
                  :value="t(ratingLabels[form.rating] ?? '')"
                  :severity="ratingTagSeverity"
                  class="rounded-full! text-xs! font-semibold!"
                />
              </div>

              <small
                v-if="errors.rating"
                class="block mt-1.5 text-red-400 text-xs"
              >
                <i class="pi pi-exclamation-circle mr-1" />
                {{ errors.rating }}
              </small>
            </div>

            <!-- Comment -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ t("Your Comment") }}
                <span class="text-red-400 ml-0.5">*</span>
              </label>

              <Textarea
                v-model="form.comment"
                rows="4"
                maxlength="1000"
                class="w-full rounded-xl! text-sm! resize-none!"
                :invalid="!!errors.comment"
              />

              <div class="flex justify-between mt-1.5">
                <small v-if="errors.comment" class="text-red-400 text-xs">
                  <i class="pi pi-exclamation-circle mr-1" />
                  {{ errors.comment }}
                </small>
                <span />
                <small class="text-gray-400 text-xs">
                  {{ form.comment.length }}/1000
                </small>
              </div>
            </div>

            <Message
              v-if="feedbackStore.error"
              severity="error"
              class="mb-5 rounded-xl!"
              :closable="false"
            >
              {{ feedbackStore.error }}
            </Message>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3">
              <Button
                v-if="isEditing"
                :label="t('Cancel')"
                icon="pi pi-times"
                severity="secondary"
                outlined
                class="rounded-xl! font-semibold!"
                type="button"
                @click="cancelEdit"
              />
              <Button
                type="submit"
                :label="isEditing ? t('Save Changes') : t('Submit Review')"
                :icon="
                  feedbackStore.isLoading
                    ? 'pi pi-spin pi-spinner'
                    : 'pi pi-send'
                "
                :loading="feedbackStore.isLoading"
                :disabled="feedbackStore.isLoading"
                class="bg-amber-400! border-amber-400! hover:bg-amber-500! hover:border-amber-500! text-white! font-semibold! rounded-xl! px-6!"
              />
            </div>
          </form>
        </template>
      </div>
    </div>

    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      :closable="true"
      :draggable="false"
      :style="{ width: '380px' }"
      :pt="{
        root: { class: 'rounded-2xl! overflow-hidden!' },
        header: { class: 'pb-0! pt-5! px-6!' },
        content: { class: 'px-6! pb-6! pt-3!' },
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0"
          >
            <i class="pi pi-trash text-red-500 text-base" />
          </div>
          <span class="font-bold text-gray-900">
            {{ t("Delete Review") }}
          </span>
        </div>
      </template>

      <p class="text-gray-500 text-sm mb-6">
        {{
          t(
            "Are you sure you want to delete your review? This action cannot be undone.",
          )
        }}
      </p>

      <div class="flex justify-end gap-3">
        <Button
          :label="t('Cancel')"
          severity="secondary"
          outlined
          class="rounded-xl! font-semibold!"
          @click="showDeleteDialog = false"
        />
        <Button
          :label="t('Delete')"
          icon="pi pi-trash"
          severity="danger"
          :loading="feedbackStore.isLoading"
          class="rounded-xl! font-semibold!"
          @click="handleDelete"
        />
      </div>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Rating from "primevue/rating";
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import Message from "primevue/message";
import { useFeedbackStore } from "~/stores/feedback";
import { useAuthStore } from "~/stores/auth";
import type { Feedback } from "~/stores/interface/response/feedback";

const props = defineProps<{
  hotelId: number;
  existingFeedback?: Feedback | null;
  canLeaveFeedback?: boolean;
  reservationId?: number;
}>();

const emit = defineEmits<{
  (e: "feedbackSubmitted"): void;
  (e: "feedbackDeleted"): void;
  (e: "scrollToRooms"): void;
}>();

const { t } = useI18n();
const router = useRouter();
const feedbackStore = useFeedbackStore();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);

// userInfo có: fullName, email, ... — dùng fullName hoặc email để lấy initial
const displayName = computed(
  () => authStore.userInfo?.fullName ?? authStore.userInfo?.email ?? "User",
);

const userInitial = computed(() => displayName.value.charAt(0).toUpperCase());

const avatarPalette = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];
const avatarColor = computed(() => {
  const name = displayName.value;
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
});

const isEditing = ref(false);
const showDeleteDialog = ref(false);
const successMsg = ref("");

const form = ref({ rating: 0, comment: "" });
const errors = ref({ rating: "", comment: "" });

const ratingLabels: Record<number, string> = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

const ratingTagSeverity = computed(
  (): "danger" | "warn" | "info" | "success" => {
    const map: Record<number, "danger" | "warn" | "info" | "success"> = {
      1: "danger",
      2: "warn",
      3: "info",
      4: "success",
      5: "success",
    };
    return map[form.value.rating] ?? "info";
  },
);

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function validate(): boolean {
  errors.value = { rating: "", comment: "" };
  let valid = true;
  if (!form.value.rating) {
    errors.value.rating = t("Please select a rating");
    valid = false;
  }
  if (form.value.comment.trim().length < 10) {
    errors.value.comment = t("Comment must be at least 10 characters");
    valid = false;
  }
  return valid;
}

function resetForm() {
  form.value = { rating: 0, comment: "" };
  errors.value = { rating: "", comment: "" };
}

function startEdit() {
  if (!props.existingFeedback) return;
  form.value.rating = props.existingFeedback.rating;
  form.value.comment = props.existingFeedback.comment;
  isEditing.value = true;
  feedbackStore.clearError();
}

function cancelEdit() {
  isEditing.value = false;
  resetForm();
  feedbackStore.clearError();
}

async function handleDelete() {
  if (!props.existingFeedback) return;
  const res = await feedbackStore.deleteFeedback(
    props.existingFeedback.feedbackId,
  );
  if (res?.success) {
    showDeleteDialog.value = false;
    emit("feedbackDeleted");
  }
}

async function handleSubmit() {
  if (!validate()) return;

  const payload = {
    hotelId: props.hotelId,
    rating: form.value.rating,
    comment: form.value.comment.trim(),
    reservationId: props.reservationId!,
  };

  let res;
  const editing = isEditing.value;

  if (editing && props.existingFeedback) {
    res = await feedbackStore.updateFeedback(
      props.existingFeedback.feedbackId,
      {
        rating: payload.rating,
        comment: payload.comment,
      },
    );
  } else {
    res = await feedbackStore.createFeedback(payload);
  }

  if (res?.success) {
    isEditing.value = false;
    resetForm();
    successMsg.value = editing
      ? t("Review updated successfully!")
      : t("Thank you! Your review has been submitted.");
    setTimeout(() => (successMsg.value = ""), 4000);
    emit("feedbackSubmitted");
  }
}

onMounted(() => feedbackStore.clearError());
</script>
