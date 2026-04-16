<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Hotels Management</h1>
        <p class="admin-page-subtitle">Manage all hotels in your platform</p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          label="Export"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportData"
        />
        <Button label="Add Hotel" icon="pi pi-plus" @click="openCreateDialog" />
      </div>
    </div>

    <HotelFilter v-model="filters" :cities="cityOptions" />

    <HotelTable
      :hotels="hotels"
      :totalCount="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :loading="loading"
      @view="viewHotel"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @delete-selected="confirmDeleteSelected"
      @page="onPageChange"
    />

    <HotelFormDialog
      v-model="hotelDialog"
      :isEditing="isEditing"
      :editingHotel="editingHotel"
      :cities="cityOptions"
      :saving="saving"
      @hide="closeHotelDialog"
      @save-create="handleCreate"
      @save-update="handleUpdate"
    />

    <HotelDeleteDialog
      v-model="deleteDialog"
      :hotel="hotelToDelete"
      :deleting="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import HotelDeleteDialog from "~/components/admin/hotel/HotelDeleteDialog.vue";
import type { HotelFiltersModel } from "~/components/admin/hotel/HotelFilter.vue";
import HotelFilter from "~/components/admin/hotel/HotelFilter.vue";
import HotelFormDialog from "~/components/admin/hotel/HotelFormDialog.vue";
import HotelTable from "~/components/admin/hotel/HotelTable.vue";
import { useCitiesStore } from "~/stores/admin/cities";
import {
  useAdminHotelStore,
  type Hotel,
  type HotelPayload,
} from "~/stores/admin/hotels";

definePageMeta({ layout: "admin", middleware: ["admin"] });
useHead({ title: "Hotel Management" });

const toast = useToast();
const hotelStore = useAdminHotelStore();
const citiesStore = useCitiesStore();

const hotels = ref<Hotel[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const hotelDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editingHotel = ref<Hotel | null>(null);
const hotelToDelete = ref<Hotel | null>(null);

const pagination = ref({ page: 1, pageSize: 10, totalCount: 0 });

const filters = ref<HotelFiltersModel>({
  search: "",
  cityId: null,
  status: null,
  rating: null,
});

// City options loaded from API for filter + form dropdown
const cityOptions = ref<{ cityId: number; name: string }[]>([]);

onMounted(async () => {
  await Promise.all([fetchHotels(), fetchCities()]);
});

async function fetchCities() {
  try {
    const res = await citiesStore.getCities({ pageSize: 200 });
    if (res.success) {
      cityOptions.value = res.data.items.map((c) => ({
        cityId: c.cityId,
        name: c.name,
      }));
    }
  } catch {
    // non-critical — filters just won't have city options
  }
}

async function fetchHotels() {
  loading.value = true;
  try {
    const res = await hotelStore.fetchHotels({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      cityId: filters.value.cityId ?? undefined,
    });

    if (res?.success) {
      // API doesn't support status/rating filter — apply client-side
      let items = res.data.items;
      if (filters.value.status) {
        // Hotel model has no status field from API — skip for now
      }
      if (filters.value.rating !== null) {
        items = items.filter(
          (h) => Math.floor(h.averageRating ?? 0) === filters.value.rating,
        );
      }
      hotels.value = items;
      pagination.value.totalCount = res.data.totalCount;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to load hotels",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading hotels",
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
    debounceTimer = setTimeout(fetchHotels, 400);
  },
  { deep: true },
);

function onPageChange({ page, rows }: { page: number; rows: number }) {
  pagination.value.page = page;
  pagination.value.pageSize = rows;
  fetchHotels();
}

function openCreateDialog() {
  editingHotel.value = null;
  isEditing.value = false;
  hotelDialog.value = true;
}

function openEditDialog(hotel: Hotel) {
  editingHotel.value = hotel;
  isEditing.value = true;
  hotelDialog.value = true;
}

function openDeleteDialog(hotel: Hotel) {
  hotelToDelete.value = hotel;
  deleteDialog.value = true;
}

function closeHotelDialog() {
  hotelDialog.value = false;
  editingHotel.value = null;
}

function viewHotel(hotel: Hotel) {
  navigateTo(`/admin/hotels/${hotel.hotelId}`);
}

async function handleCreate(payload: HotelPayload) {
  saving.value = true;
  try {
    const res = await hotelStore.createHotel(payload);
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Hotel created successfully",
        life: 3000,
      });
      closeHotelDialog();
      await fetchHotels();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to create hotel",
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

async function handleUpdate(id: number, payload: HotelPayload) {
  saving.value = true;
  try {
    const res = await hotelStore.updateHotel(id, payload);
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Hotel updated successfully",
        life: 3000,
      });
      closeHotelDialog();
      await fetchHotels();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to update hotel",
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
  if (!hotelToDelete.value) return;
  deleting.value = true;
  try {
    const res = await hotelStore.deleteHotel(hotelToDelete.value.hotelId);
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Hotel deleted successfully",
        life: 3000,
      });
      deleteDialog.value = false;
      hotelToDelete.value = null;
      await fetchHotels();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to delete hotel",
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

function confirmDeleteSelected(selected: Hotel[]) {
  toast.add({
    severity: "warn",
    summary: "Not implemented",
    detail: "Bulk delete coming soon",
    life: 3000,
  });
}

function exportData() {
  toast.add({
    severity: "info",
    summary: "Export",
    detail: "Exporting data...",
    life: 3000,
  });
}
</script>
