<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="admin-page-title">Facilities</h2>
        <p class="admin-page-subtitle">Manage hotel facilities and amenities</p>
      </div>
      <Button label="Add Facility" icon="pi pi-plus" @click="openCreateModal" />
    </div>

    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="flex items-center gap-4">
          <IconField class="flex-1 max-w-md">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="search"
              placeholder="Search facilities..."
              class="w-full"
            />
          </IconField>
          <Button
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            v-tooltip.top="'Clear search'"
            @click="search = ''"
          />
        </div>
      </div>
    </div>

    <div class="admin-card">
      <DataTable
        :value="filteredFacilities"
        :loading="isLoading"
        :rows="10"
        :paginator="filteredFacilities.length > 10"
        :rows-per-page-options="[10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} facilities"
        class="p-datatable-sm"
      >
        <template #header>
          <span class="text-(--admin-text-secondary)">
            {{ filteredFacilities.length }} facilities found
          </span>
        </template>

        <template #empty>
          <div class="text-center py-8 text-(--admin-text-muted)">
            <i class="pi pi-inbox text-4xl mb-2 block" />
            <p>No facilities found</p>
          </div>
        </template>

        <Column field="facilityId" header="ID" style="width: 100px" sortable>
          <template #body="{ data }">
            <span class="font-medium">#{{ data.facilityId }}</span>
          </template>
        </Column>

        <Column field="name" header="Name" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-cog text-(--admin-primary)" />
              <span class="font-medium text-(--admin-text-color)">{{
                data.name
              }}</span>
            </div>
          </template>
        </Column>

        <Column header="Actions" style="width: 120px">
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Edit'"
                @click="openEditModal(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="'Delete'"
                @click="openDeleteModal(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="isModalOpen"
      :header="isEditing ? 'Edit Facility' : 'Add Facility'"
      modal
      :style="{ width: '450px' }"
    >
      <div class="pt-4">
        <label class="font-medium mb-2 block">Name *</label>
        <InputText
          v-model="formName"
          placeholder="Enter facility name"
          class="w-full"
          :class="{ 'p-invalid': submitted && !formName.trim() }"
          @keyup.enter="onSubmit"
        />
        <small v-if="submitted && !formName.trim()" class="p-error">
          Facility name is required
        </small>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          outlined
          :disabled="isSaving"
          @click="isModalOpen = false"
        />
        <Button
          :label="isEditing ? 'Update' : 'Create'"
          :loading="isSaving"
          @click="onSubmit"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="isDeleteModalOpen"
      header="Delete Facility"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-4xl text-yellow-500" />
        <p>
          Are you sure you want to delete
          <strong>{{ deletingFacility?.name }}</strong
          >? This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          outlined
          :disabled="isDeleting"
          @click="isDeleteModalOpen = false"
        />
        <Button
          label="Delete"
          severity="danger"
          icon="pi pi-trash"
          :loading="isDeleting"
          @click="confirmDelete"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import type { FacilityDto } from "~/stores/admin/interfaces/facility";
import { useFacilitiesStore } from "~/stores/admin/facilties";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "Facility Management",
});

const toast = useToast();
const facilitiesStore = useFacilitiesStore();

const facilities = ref<FacilityDto[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const search = ref("");
const submitted = ref(false);

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const formName = ref("");

// Delete modal state
const isDeleteModalOpen = ref(false);
const deletingFacility = ref<FacilityDto | null>(null);

const filteredFacilities = computed(() => {
  if (!search.value.trim()) return facilities.value;
  return facilities.value.filter((f) =>
    f.name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

async function fetchFacilities() {
  isLoading.value = true;
  try {
    const res = await facilitiesStore.getAllFacilities();
    if (res.success) {
      facilities.value = res.data;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to load facilities",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading facilities",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchFacilities);

function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  formName.value = "";
  submitted.value = false;
  isModalOpen.value = true;
}

function openEditModal(facility: FacilityDto) {
  isEditing.value = true;
  editingId.value = facility.facilityId;
  formName.value = facility.name;
  submitted.value = false;
  isModalOpen.value = true;
}

function openDeleteModal(facility: FacilityDto) {
  deletingFacility.value = facility;
  isDeleteModalOpen.value = true;
}

async function onSubmit() {
  submitted.value = true;
  if (!formName.value.trim()) return;

  isSaving.value = true;
  try {
    if (isEditing.value && editingId.value !== null) {
      const res = await facilitiesStore.updateFacility(editingId.value, {
        name: formName.value.trim(),
      });
      if (res.success) {
        // Update in-place — no need to re-fetch the full list
        const index = facilities.value.findIndex(
          (f) => f.facilityId === editingId.value,
        );
        if (index !== -1) facilities.value[index] = res.data;
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Facility updated successfully",
          life: 3000,
        });
        isModalOpen.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: res.message ?? "Failed to update facility",
          life: 3000,
        });
      }
    } else {
      const res = await facilitiesStore.createFacility({
        name: formName.value.trim(),
      });
      if (res.success) {
        facilities.value.push(res.data);
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Facility created successfully",
          life: 3000,
        });
        isModalOpen.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: res.message ?? "Failed to create facility",
          life: 3000,
        });
      }
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    isSaving.value = false;
  }
}

async function confirmDelete() {
  if (!deletingFacility.value) return;
  isDeleting.value = true;
  try {
    const res = await facilitiesStore.deleteFacility(
      deletingFacility.value.facilityId,
    );
    if (res.success) {
      facilities.value = facilities.value.filter(
        (f) => f.facilityId !== deletingFacility.value!.facilityId,
      );
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Facility deleted successfully",
        life: 3000,
      });
      isDeleteModalOpen.value = false;
      deletingFacility.value = null;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res.message ?? "Failed to delete facility",
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
    isDeleting.value = false;
  }
}
</script>

<style scoped>
:deep(.p-datatable) {
  background: transparent;
}
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--admin-table-header-bg);
  border-color: var(--admin-table-border);
  color: var(--admin-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:deep(.p-datatable .p-datatable-tbody > tr) {
  background: transparent;
  border-color: var(--admin-table-border);
}
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: var(--admin-table-row-hover);
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: var(--admin-table-border);
  color: var(--admin-text-color);
}
</style>
