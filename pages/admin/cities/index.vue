<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Cities Management</h1>
        <p class="admin-page-subtitle">Manage cities and destinations</p>
      </div>
      <Button label="Add City" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Search cities..."
              class="w-full"
            />
          </IconField>
          <InputText
            v-model="filters.country"
            placeholder="Filter by country..."
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="admin-card overflow-hidden animate-pulse"
      >
        <div class="h-48 bg-(--admin-surface-hover)" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-(--admin-surface-hover) rounded w-3/4" />
          <div class="h-4 bg-(--admin-surface-hover) rounded w-1/2" />
        </div>
      </div>
    </div>

    <div
      v-else-if="cities.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <CityCard
        v-for="city in cities"
        :key="city.cityId"
        :city="city"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />

      <!-- Add City Card -->
      <div
        class="admin-card overflow-hidden border-2 border-dashed border-(--admin-surface-border) hover:border-(--admin-primary) cursor-pointer transition-colors flex items-center justify-center min-h-[280px]"
        @click="openCreateDialog"
      >
        <div class="text-center p-6">
          <div
            class="w-16 h-16 rounded-full bg-(--admin-primary-light) flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-plus text-2xl text-(--admin-primary)"></i>
          </div>
          <p class="font-semibold text-(--admin-text-color)">Add New City</p>
          <p class="text-sm text-(--admin-text-muted)">
            Click to add a new destination
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="admin-card p-12 text-center">
      <i class="pi pi-map text-5xl text-(--admin-text-muted) mb-4"></i>
      <h3 class="text-xl font-semibold text-(--admin-text-color) mb-2">
        No cities found
      </h3>
      <p class="text-(--admin-text-muted)]">
        Try adjusting your search or add a new city
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.totalCount > pagination.pageSize"
      class="flex justify-center mt-6"
    >
      <Paginator
        :rows="pagination.pageSize"
        :totalRecords="pagination.totalCount"
        :first="(pagination.page - 1) * pagination.pageSize"
        :rowsPerPageOptions="[8, 16, 24]"
        @page="onPageChange"
      />
    </div>

    <CityFormDialog
      v-model="cityDialog"
      :isEditing="isEditing"
      :editingCity="editingCity"
      :saving="saving"
      @hide="closeCityDialog"
      @save-create="handleCreate"
      @save-update="handleUpdate"
    />

    <CityDeleteDialog
      v-model="deleteDialog"
      :city="cityToDelete"
      :deleting="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Paginator from "primevue/paginator";
import { useToast } from "primevue/usetoast";

import CityCard from "./CityCard.vue";
import CityFormDialog from "./CityFormDialog.vue";
import CityDeleteDialog from "./CityDeleteDialog.vue";
import { useCitiesStore } from "~/stores/admin/cities";
import type {
  CityDto,
  CreateCityPayload,
  UpdateCityPayload,
} from "~/stores/admin/interfaces/cities";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "City Management",
});

const toast = useToast();
const citiesStore = useCitiesStore();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const cities = ref<CityDto[]>([]);
const cityDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const editingCity = ref<CityDto | null>(null);
const cityToDelete = ref<CityDto | null>(null);

const pagination = ref({
  page: 1,
  pageSize: 8,
  totalCount: 0,
});

const filters = ref({
  search: "",
  country: "",
});

async function fetchCities() {
  loading.value = true;
  try {
    const res = await citiesStore.getCities({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      country: filters.value.country || undefined,
    });

    if (res.success) {
      cities.value = res.data.items;
      pagination.value.totalCount = res.data.totalCount;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to load cities",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading cities",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

// Debounce filter changes
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  filters,
  () => {
    pagination.value.page = 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchCities, 400);
  },
  { deep: true },
);

onMounted(fetchCities);

function onPageChange(event: { page: number; rows: number }) {
  pagination.value.page = event.page + 1;
  pagination.value.pageSize = event.rows;
  fetchCities();
}

function openCreateDialog() {
  editingCity.value = null;
  isEditing.value = false;
  cityDialog.value = true;
}

function openEditDialog(city: CityDto) {
  editingCity.value = city;
  isEditing.value = true;
  cityDialog.value = true;
}

function openDeleteDialog(city: CityDto) {
  cityToDelete.value = city;
  deleteDialog.value = true;
}

function closeCityDialog() {
  cityDialog.value = false;
  editingCity.value = null;
}

async function handleCreate(payload: CreateCityPayload) {
  saving.value = true;
  try {
    const res = await citiesStore.createCity(payload);
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "City created successfully",
        life: 3000,
      });
      closeCityDialog();
      await fetchCities();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to create city",
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

async function handleUpdate(id: number, payload: UpdateCityPayload) {
  saving.value = true;
  try {
    const res = await citiesStore.updateCity(id, payload);
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "City updated successfully",
        life: 3000,
      });
      closeCityDialog();
      await fetchCities();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to update city",
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
  if (!cityToDelete.value) return;
  deleting.value = true;
  try {
    const res = await citiesStore.deleteCity(cityToDelete.value.cityId);
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "City deleted successfully",
        life: 3000,
      });
      deleteDialog.value = false;
      cityToDelete.value = null;
      await fetchCities();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to delete city",
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
