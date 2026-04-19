<template>
  <div
    class="min-h-screen mt-4 mx-auto max-w-6xl px-4 md:px-8 pb-12 dark:bg-slate-900"
  >
    <!-- Header -->
    <div class="mb-8 max-w-6xl">
      <p class="text-[#07689F] font-bold text-2xl mb-2">
        {{ t("My Reviews") }}
      </p>
      <p class="text-[#07689F]">
        {{ t("All your hotel reviews and ratings in one place.") }}
      </p>
    </div>

    <!-- Stats Bar -->
    <div
      v-if="!feedbackStore.isLoading && feedbackStore.myFeedbacks.length > 0"
      class="flex flex-wrap gap-4 mb-6"
    >
      <div
        class="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm"
      >
        <i class="pi pi-star-fill text-amber-400" />
        <span class="text-sm text-gray-600">
          {{ t("Average rating:") }}
          <span class="font-bold text-gray-900">{{ averageRating }}</span>
        </span>
      </div>
      <div
        class="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm"
      >
        <i class="pi pi-comment text-[#07689F]" />
        <span class="text-sm text-gray-600">
          {{ t("Total reviews:") }}
          <span class="font-bold text-gray-900">{{
            feedbackStore.totalCount
          }}</span>
        </span>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 max-w-6xl mb-6 border-b border-gray-200">
      <button
        v-for="tab in ratingTabs"
        :key="tab.value"
        @click="selectTab(tab.value)"
        :class="[
          'px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-0.5',
          activeTab === tab.value
            ? 'border-[#07689F] text-[#07689F] bg-white'
            : 'border-transparent text-gray-500 hover:text-[#07689F] hover:bg-white/60',
        ]"
      >
        {{ tab.label }}
        <span
          v-if="tab.value === activeTab && filteredFeedbacks.length > 0"
          class="ml-1.5 px-1.5 py-0.5 text-xs bg-[#07689F] text-white rounded-full"
        >
          {{ filteredFeedbacks.length }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <template v-if="feedbackStore.isLoading">
      <div class="space-y-4">
        <FeedbackCardSkeleton v-for="i in 3" :key="i" />
      </div>
    </template>

    <!-- List -->
    <template v-else-if="filteredFeedbacks.length > 0">
      <div class="space-y-4">
        <FeedbackCard
          v-for="fb in filteredFeedbacks"
          :key="fb.feedbackId"
          :feedback="fb"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </template>

    <!-- Empty -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <div
        class="w-20 h-20 mb-4 rounded-full bg-[#E8F4FB] flex items-center justify-center"
      >
        <i class="pi pi-star text-3xl text-[#07689F]" />
      </div>
      <p class="text-gray-600 font-semibold text-lg mb-1">
        {{ t("No reviews found") }}
      </p>
      <p class="text-gray-400 text-sm">
        {{ t("You have no") }}
        {{ activeTab !== "all" ? activeTab + "-star" : "" }}
        {{ t("reviews yet.") }}
      </p>
      <NuxtLink
        to="/"
        class="mt-6 px-6 py-2.5 bg-[#07689F] text-white rounded-lg text-sm font-semibold hover:bg-[#055a8a] transition-colors"
      >
        {{ t("Explore Hotels") }}
      </NuxtLink>
    </div>

    <!-- Edit Dialog -->
    <Dialog
      v-model:visible="showEditDialog"
      modal
      :header="t('Edit Review')"
      :style="{ width: '480px' }"
      pt:root:class="rounded-2xl! overflow-hidden!"
    >
      <div class="py-2">
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t("Your Rating") }} <span class="text-red-400">*</span>
          </label>
          <div class="flex items-center gap-3">
            <Rating
              v-model="editForm.rating"
              :stars="5"
              :cancel="false"
              :pt="{
                onIcon: { class: 'text-amber-400! text-2xl!' },
                offIcon: { class: 'text-gray-300! text-2xl!' },
              }"
            />
            <Tag
              v-if="editForm.rating"
              :value="t(ratingLabels[editForm.rating] ?? '')"
              :severity="editTagSeverity"
              class="rounded-full! text-xs! font-semibold!"
            />
          </div>
          <small
            v-if="editErrors.rating"
            class="text-red-400 text-xs mt-1 block"
          >
            <i class="pi pi-exclamation-circle mr-1" />{{
              t(editErrors.rating ?? "")
            }}
          </small>
        </div>

        <div class="mb-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t("Your Comment") }} <span class="text-red-400">*</span>
          </label>
          <Textarea
            v-model="editForm.comment"
            rows="4"
            maxlength="1000"
            class="w-full rounded-xl! text-sm! resize-none!"
            :invalid="!!editErrors.comment"
          />
          <div class="flex justify-between mt-1">
            <small v-if="editErrors.comment" class="text-red-400 text-xs">
              <i class="pi pi-exclamation-circle mr-1" />{{
                t(editErrors.comment ?? "")
              }}
            </small>
            <span />
            <small class="text-gray-400 text-xs"
              >{{ editForm.comment.length }}/1000</small
            >
          </div>
        </div>

        <Message
          v-if="feedbackStore.error"
          severity="error"
          class="mt-3 rounded-xl!"
          :closable="false"
        >
          {{ feedbackStore.error }}
        </Message>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 px-1 pb-1">
          <Button
            :label="t('Cancel')"
            severity="secondary"
            outlined
            class="rounded-xl! font-semibold!"
            @click="showEditDialog = false"
          />
          <Button
            :label="t('Save Changes')"
            icon="pi pi-check"
            :loading="feedbackStore.isLoading"
            class="bg-amber-400! border-amber-400! hover:bg-amber-500! text-white! font-semibold! rounded-xl!"
            @click="confirmEdit"
          />
        </div>
      </template>
    </Dialog>

    <!-- Delete Dialog -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      :style="{ width: '400px' }"
      pt:root:class="rounded-2xl! overflow-hidden!"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0"
          >
            <i class="pi pi-trash text-red-500 text-base" />
          </div>
          <span class="font-bold text-gray-900">{{ t("Delete Review") }}</span>
        </div>
      </template>

      <p class="text-gray-600 mb-2">
        {{ t("Are you sure you want to delete your review for") }}
      </p>
      <p class="font-semibold text-gray-800">{{ deleteTarget?.hotelName }}?</p>
      <p class="text-sm text-red-500 mt-3">
        {{ t("This action cannot be undone.") }}
      </p>

      <template #footer>
        <Button
          :label="t('Keep Review')"
          severity="secondary"
          outlined
          class="mr-2 rounded-xl! font-semibold!"
          @click="showDeleteDialog = false"
        />
        <Button
          :label="t('Yes, Delete')"
          severity="danger"
          icon="pi pi-trash"
          :loading="feedbackStore.isLoading"
          class="rounded-xl! font-semibold!"
          @click="confirmDelete"
        />
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFeedbackStore } from "~/stores/feedback";
import type { Feedback } from "~/stores/interface/response/feedback";
import type { UpdateFeedbackPayload } from "~/stores/interface/request/feedback";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Rating from "primevue/rating";
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import Message from "primevue/message";
import { useToast } from "primevue/usetoast";
import FeedbackCardSkeleton from "~/components/admin/feedback/FeedbackCardSkeleton.vue";
import FeedbackCard from "~/components/admin/feedback/FeedbackCard.vue";

const { t } = useI18n();
useHead({ title: t("My Reviews") });

const feedbackStore = useFeedbackStore();
const toast = useToast();

const ratingTabs = computed(() => [
  { label: t("All"), value: "all" },
  { label: t("5 Stars"), value: "5" },
  { label: t("4 Stars"), value: "4" },
  { label: t("3 Stars"), value: "3" },
  { label: t("1–2 Stars"), value: "low" },
]);

const activeTab = ref("all");

const filteredFeedbacks = computed(() => {
  const list = feedbackStore.myFeedbacks;
  if (activeTab.value === "all") return list;
  if (activeTab.value === "low") return list.filter((f) => f.rating <= 2);
  return list.filter((f) => f.rating === Number(activeTab.value));
});

function selectTab(val: string) {
  activeTab.value = val;
}

const averageRating = computed(() => {
  const list = feedbackStore.myFeedbacks;
  if (!list.length) return "—";
  const avg = list.reduce((sum, f) => sum + f.rating, 0) / list.length;
  return avg.toFixed(1);
});

const showEditDialog = ref(false);
const editTarget = ref<Feedback | null>(null);
const editForm = ref<UpdateFeedbackPayload>({ rating: 0, comment: "" });
const editErrors = ref({ rating: "", comment: "" });

const ratingLabels: Record<number, string> = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

const editTagSeverity = computed((): "danger" | "warn" | "info" | "success" => {
  const map: Record<number, "danger" | "warn" | "info" | "success"> = {
    1: "danger",
    2: "warn",
    3: "info",
    4: "success",
    5: "success",
  };
  return map[editForm.value.rating] ?? "info";
});

function handleEdit(feedback: Feedback) {
  editTarget.value = feedback;
  editForm.value = { rating: feedback.rating, comment: feedback.comment };
  editErrors.value = { rating: "", comment: "" };
  feedbackStore.clearError();
  showEditDialog.value = true;
}

function validateEdit(): boolean {
  editErrors.value = { rating: "", comment: "" };
  let valid = true;
  if (!editForm.value.rating) {
    editErrors.value.rating = "Please select a rating";
    valid = false;
  }
  if (editForm.value.comment.trim().length < 10) {
    editErrors.value.comment = "Comment must be at least 10 characters";
    valid = false;
  }
  return valid;
}

async function confirmEdit() {
  if (!validateEdit() || !editTarget.value) return;
  const res = await feedbackStore.updateFeedback(editTarget.value.feedbackId, {
    rating: editForm.value.rating,
    comment: editForm.value.comment.trim(),
  });
  showEditDialog.value = false;
  if (res?.success) {
    toast.add({
      severity: "success",
      summary: t("Updated"),
      detail: t("Your review has been updated."),
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: feedbackStore.error ?? t("Failed to update review."),
      life: 3000,
    });
  }
}

const showDeleteDialog = ref(false);
const deleteTarget = ref<Feedback | null>(null);

function handleDelete(feedback: Feedback) {
  deleteTarget.value = feedback;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  const res = await feedbackStore.deleteFeedback(deleteTarget.value.feedbackId);
  showDeleteDialog.value = false;
  if (res?.success) {
    toast.add({
      severity: "success",
      summary: t("Deleted"),
      detail: t("Your review has been deleted."),
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: feedbackStore.error ?? t("Failed to delete review."),
      life: 3000,
    });
  }
}

onMounted(async () => {
  await feedbackStore.fetchMyFeedbacks();
});
</script>
