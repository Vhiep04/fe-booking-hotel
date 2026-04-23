<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Feedbacks Management</h1>
        <p class="admin-page-subtitle">View and moderate guest reviews</p>
      </div>
    </div>

    <!-- Stats -->
    <FeedbackStatsCard
      :feedbacks="feedbacks"
      :totalCount="pagination.totalCount"
    />

    <!-- Filters -->
    <FeedbackFilter v-model="filters" @reset="resetFilters" />

    <!-- Table -->
    <FeedbackTable
      :feedbacks="feedbacks"
      :totalCount="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :loading="loading"
      @view="openDetailDialog"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @page="onPageChange"
    />

    <!-- Detail Dialog -->
    <FeedbackDetailDialog
      v-model="detailDialog"
      :feedback="selectedFeedback"
      @edit="openEditDialog"
    />

    <!-- Edit Dialog -->
    <FeedbackEditDialog
      v-model="editDialog"
      :feedback="editingFeedback"
      :saving="saving"
      @hide="closeEditDialog"
      @save="handleUpdate"
    />

    <!-- Delete Dialog -->
    <FeedbackDeleteDialog
      v-model="deleteDialog"
      :feedback="feedbackToDelete"
      :deleting="deleting"
      @confirm="handleDelete"
    />
  </div>
  <Toast />
</template>

<script setup lang="ts">
import { Toast } from "primevue";
import { useToast } from "primevue/usetoast";
import FeedbackDeleteDialog from "~/components/admin/feedback/FeedbackDeleteDialog.vue";
import FeedbackDetailDialog from "~/components/admin/feedback/FeedbackDetailDialog.vue";
import FeedbackEditDialog from "~/components/admin/feedback/FeedbackEditDialog.vue";
import type { FeedbackFiltersModel } from "~/components/admin/feedback/FeedbackFilter.vue";
import FeedbackFilter from "~/components/admin/feedback/FeedbackFilter.vue";
import FeedbackStatsCard from "~/components/admin/feedback/FeedbackStatsCard.vue";
import FeedbackTable from "~/components/admin/feedback/FeedbackTable.vue";
import { useAdminFeedbackStore } from "~/stores/admin/feedbacks";
import type { AdminFeedbackDto } from "~/stores/admin/interfaces/feedbacks";
import type { UpdateFeedbackPayload } from "~/stores/interface/request/feedback";

definePageMeta({ layout: "admin", middleware: ["admin"] });
useHead({ title: "Feedback Management" });

const toast = useToast();
const feedbackStore = useAdminFeedbackStore();

const feedbacks = ref<AdminFeedbackDto[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const detailDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

const selectedFeedback = ref<AdminFeedbackDto | null>(null);
const editingFeedback = ref<AdminFeedbackDto | null>(null);
const feedbackToDelete = ref<AdminFeedbackDto | null>(null);

const pagination = ref({ page: 1, pageSize: 10, totalCount: 0 });

const filters = ref<FeedbackFiltersModel>({ search: "", rating: null });

async function fetchFeedbacks() {
  loading.value = true;
  try {
    const res = await feedbackStore.getFeedbacks({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      rating: filters.value.rating ?? undefined,
    });

    if (res?.success) {
      feedbacks.value = res.data.items;
      pagination.value.totalCount = res.data.totalCount;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to load feedbacks",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading feedbacks",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  filters,
  () => {
    pagination.value.page = 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchFeedbacks, 400);
  },
  { deep: true },
);

onMounted(fetchFeedbacks);

function onPageChange({ page, rows }: { page: number; rows: number }) {
  pagination.value.page = page;
  pagination.value.pageSize = rows;
  fetchFeedbacks();
}

function resetFilters() {
  filters.value = { search: "", rating: null };
}

function openDetailDialog(feedback: AdminFeedbackDto) {
  selectedFeedback.value = feedback;
  detailDialog.value = true;
}

function openEditDialog(feedback: AdminFeedbackDto) {
  editingFeedback.value = feedback;
  editDialog.value = true;
  detailDialog.value = false;
}

function openDeleteDialog(feedback: AdminFeedbackDto) {
  feedbackToDelete.value = feedback;
  deleteDialog.value = true;
}

function closeEditDialog() {
  editDialog.value = false;
  editingFeedback.value = null;
}

async function handleUpdate(id: number, payload: UpdateFeedbackPayload) {
  saving.value = true;
  try {
    const res = await feedbackStore.updateFeedback(id, payload);
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Feedback updated successfully",
        life: 3000,
      });
      closeEditDialog();
      // Update in-place — no need to re-fetch full list
      const idx = feedbacks.value.findIndex((f) => f.feedbackId === id);
      if (idx !== -1) feedbacks.value[idx] = res.data;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to update feedback",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!feedbackToDelete.value) return;
  deleting.value = true;
  try {
    const res = await feedbackStore.deleteFeedback(
      feedbackToDelete.value.feedbackId,
    );
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Feedback deleted successfully",
        life: 3000,
      });
      deleteDialog.value = false;
      fetchFeedbacks();
      feedbackToDelete.value = null;
      // Remove from list instantly
      feedbacks.value = feedbacks.value.filter(
        (f) => f.feedbackId !== feedbackToDelete.value?.feedbackId,
      );
      pagination.value.totalCount = Math.max(
        0,
        pagination.value.totalCount - 1,
      );
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to delete feedback",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    deleting.value = false;
  }
}
</script>
