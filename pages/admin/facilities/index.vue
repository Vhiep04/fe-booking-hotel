<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Facilities</h2>
        <p class="text-gray-500 mt-1">Manage hotel facilities and amenities</p>
      </div>
      <Button label="Add Facility" icon="pi pi-plus" @click="openCreateModal" />
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
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
          @click="search = ''"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <DataTable
        :value="filteredFacilities"
        :loading="isLoading"
        :rows="pageSize"
        :paginator="true"
        :rows-per-page-options="[10, 20, 50]"
        class="p-datatable-sm"
      >
        <template #empty>
          <div class="text-center py-8 text-gray-500">
            <i class="pi pi-inbox text-4xl mb-2" />
            <p>No facilities found</p>
          </div>
        </template>

        <Column field="facilityId" header="ID" style="width: 100px">
          <template #body="{ data }">
            <Tag severity="secondary">{{ data.facilityId }}</Tag>
          </template>
        </Column>

        <Column field="name" header="Name">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-cog text-blue-600" />
              <span class="font-medium">{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column header="Actions" style="width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                @click="openEditModal(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="openDeleteModal(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create/Edit Modal -->
    <Dialog
      v-model:visible="isModalOpen"
      :header="isEditing ? 'Edit Facility' : 'Add Facility'"
      modal
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium text-gray-700">Name *</label>
          <InputText
            id="name"
            v-model="formName"
            placeholder="Enter facility name"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            @click="isModalOpen = false"
          />
          <Button :label="isEditing ? 'Update' : 'Create'" @click="onSubmit" />
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation Modal -->
    <Dialog
      v-model:visible="isDeleteModalOpen"
      header="Delete Facility"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-3xl text-yellow-500" />
        <p>
          Are you sure you want to delete
          <strong>{{ deletingFacility?.name }}</strong
          >? This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            @click="isDeleteModalOpen = false"
          />
          <Button label="Delete" severity="danger" @click="confirmDelete" />
        </div>
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
import Tag from "primevue/tag";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface Facility {
  facilityId: number;
  name: string;
}

// State
const search = ref("");
const pageSize = ref(10);
const isLoading = ref(false);

// Mock data
const facilities = ref<Facility[]>([
  { facilityId: 1, name: "Free WiFi" },
  { facilityId: 2, name: "Swimming Pool" },
  { facilityId: 3, name: "Gym & Fitness Center" },
  { facilityId: 4, name: "Spa & Wellness" },
  { facilityId: 5, name: "Restaurant" },
  { facilityId: 6, name: "Bar & Lounge" },
  { facilityId: 7, name: "Room Service" },
  { facilityId: 8, name: "Parking" },
  { facilityId: 9, name: "Airport Shuttle" },
  { facilityId: 10, name: "Conference Room" },
  { facilityId: 11, name: "Air Conditioning" },
  { facilityId: 12, name: "Flat-screen TV" },
]);

// Computed filtered list
const filteredFacilities = computed(() => {
  if (!search.value) return facilities.value;
  return facilities.value.filter((f) =>
    f.name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

// Delete modal state
const isDeleteModalOpen = ref(false);
const deletingFacility = ref<Facility | null>(null);

// Form state
const formName = ref("");

// Open create modal
const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  formName.value = "";
  isModalOpen.value = true;
};

// Open edit modal
const openEditModal = (facility: Facility) => {
  isEditing.value = true;
  editingId.value = facility.facilityId;
  formName.value = facility.name;
  isModalOpen.value = true;
};

// Submit form
const onSubmit = () => {
  if (!formName.value.trim()) return;

  if (isEditing.value && editingId.value) {
    const index = facilities.value.findIndex(
      (f) => f.facilityId === editingId.value,
    );
    if (index !== -1) {
      facilities.value[index].name = formName.value;
    }
  } else {
    const newId = Math.max(...facilities.value.map((f) => f.facilityId)) + 1;
    facilities.value.push({ facilityId: newId, name: formName.value });
  }

  isModalOpen.value = false;
};

// Open delete confirmation
const openDeleteModal = (facility: Facility) => {
  deletingFacility.value = facility;
  isDeleteModalOpen.value = true;
};

// Confirm delete
const confirmDelete = () => {
  if (!deletingFacility.value) return;
  facilities.value = facilities.value.filter(
    (f) => f.facilityId !== deletingFacility.value!.facilityId,
  );
  isDeleteModalOpen.value = false;
  deletingFacility.value = null;
};
</script>
