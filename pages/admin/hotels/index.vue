<template>
  <div>
    <!-- Page Header -->
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

    <!-- Filters Card -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Search hotels..."
              class="w-full"
            />
          </IconField>
          <Dropdown
            v-model="filters.city"
            :options="cityOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="All Cities"
            showClear
            class="w-full"
          />
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Status"
            showClear
            class="w-full"
          />
          <Dropdown
            v-model="filters.rating"
            :options="ratingOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Ratings"
            showClear
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Hotels Table -->
    <div class="admin-card">
      <DataTable
        :value="filteredHotels"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :loading="loading"
        dataKey="id"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} hotels"
        responsiveLayout="scroll"
        v-model:selection="selectedHotels"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-[var(--admin-text-secondary)]">
              {{ filteredHotels.length }} hotels found
            </span>
            <div
              class="flex items-center gap-2"
              v-if="selectedHotels.length > 0"
            >
              <Button
                label="Delete Selected"
                icon="pi pi-trash"
                severity="danger"
                outlined
                size="small"
                @click="confirmDeleteSelected"
              />
            </div>
          </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" />

        <Column field="id" header="ID" sortable style="min-width: 80px">
          <template #body="{ data }">
            <span class="font-medium">#{{ data.id }}</span>
          </template>
        </Column>

        <Column field="name" header="Hotel" sortable style="min-width: 280px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <img
                :src="data.image"
                :alt="data.name"
                class="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <p class="font-semibold text-[var(--admin-text-color)]">
                  {{ data.name }}
                </p>
                <p class="text-sm text-[var(--admin-text-muted)]">
                  {{ data.address }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="city" header="City" sortable style="min-width: 120px" />

        <Column
          field="rating"
          header="Rating"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <i class="pi pi-star-fill text-yellow-400"></i>
              <span class="font-medium">{{ data.rating }}</span>
              <span class="text-[var(--admin-text-muted)]"
                >({{ data.reviews }})</span
              >
            </div>
          </template>
        </Column>

        <Column field="rooms" header="Rooms" sortable style="min-width: 100px">
          <template #body="{ data }">
            <span>{{ data.rooms }} rooms</span>
          </template>
        </Column>

        <Column
          field="priceRange"
          header="Price Range"
          style="min-width: 140px"
        >
          <template #body="{ data }">
            <span class="font-medium">
              ${{ data.priceMin }} - ${{ data.priceMax }}
            </span>
          </template>
        </Column>

        <Column
          field="status"
          header="Status"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="data.status === 'Active' ? 'success' : 'danger'"
            />
          </template>
        </Column>

        <Column header="Actions" style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                size="small"
                v-tooltip.top="'View'"
                @click="viewHotel(data)"
              />
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Edit'"
                @click="editHotel(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="'Delete'"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="hotelDialog"
      :style="{ width: '800px' }"
      :header="isEditing ? 'Edit Hotel' : 'Add New Hotel'"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div class="field md:col-span-2">
          <label for="name" class="font-medium mb-2 block">Hotel Name *</label>
          <InputText
            id="name"
            v-model="hotelForm.name"
            placeholder="Enter hotel name"
            :class="{ 'p-invalid': submitted && !hotelForm.name }"
          />
          <small v-if="submitted && !hotelForm.name" class="p-error">
            Hotel name is required
          </small>
        </div>

        <div class="field md:col-span-2">
          <label for="description" class="font-medium mb-2 block"
            >Description</label
          >
          <Textarea
            id="description"
            v-model="hotelForm.description"
            rows="3"
            placeholder="Enter hotel description"
          />
        </div>

        <div class="field">
          <label for="city" class="font-medium mb-2 block">City *</label>
          <Dropdown
            id="city"
            v-model="hotelForm.cityId"
            :options="cityOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a city"
            :class="{ 'p-invalid': submitted && !hotelForm.cityId }"
          />
        </div>

        <div class="field">
          <label for="address" class="font-medium mb-2 block">Address *</label>
          <InputText
            id="address"
            v-model="hotelForm.address"
            placeholder="Enter address"
          />
        </div>

        <div class="field">
          <label for="rating" class="font-medium mb-2 block">Star Rating</label>
          <Rating v-model="hotelForm.starRating" :cancel="false" />
        </div>

        <div class="field">
          <label for="rooms" class="font-medium mb-2 block"
            >Number of Rooms</label
          >
          <InputNumber
            id="rooms"
            v-model="hotelForm.rooms"
            placeholder="0"
            :min="1"
          />
        </div>

        <div class="field">
          <label for="priceMin" class="font-medium mb-2 block"
            >Min Price ($)</label
          >
          <InputNumber
            id="priceMin"
            v-model="hotelForm.priceMin"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>

        <div class="field">
          <label for="priceMax" class="font-medium mb-2 block"
            >Max Price ($)</label
          >
          <InputNumber
            id="priceMax"
            v-model="hotelForm.priceMax"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>

        <div class="field md:col-span-2">
          <label for="amenities" class="font-medium mb-2 block"
            >Amenities</label
          >
          <MultiSelect
            id="amenities"
            v-model="hotelForm.amenities"
            :options="amenityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select amenities"
            display="chip"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="status" class="font-medium mb-2 block">Status</label>
          <Dropdown
            id="status"
            v-model="hotelForm.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="hideDialog"
        />
        <Button label="Save" icon="pi pi-check" @click="saveHotel" />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Confirm Delete"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-4xl text-yellow-500"></i>
        <span
          >Are you sure you want to delete
          <strong>{{ hotelToDelete?.name }}</strong
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="deleteDialog = false"
        />
        <Button
          label="Yes, Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="deleteHotel"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Rating from "primevue/rating";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "Hotel Management",
});

const toast = useToast();

const loading = ref(false);
const hotelDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const isEditing = ref(false);
const selectedHotels = ref<any[]>([]);
const hotelToDelete = ref<any>(null);

const filters = ref({
  search: "",
  city: null,
  status: null,
  rating: null,
});

const defaultForm = {
  name: "",
  description: "",
  cityId: null,
  address: "",
  starRating: 0,
  rooms: null,
  priceMin: null,
  priceMax: null,
  amenities: [],
  status: "Active",
};
const hotelForm = ref({ ...defaultForm });

// Options
const cityOptions = ref([
  { id: 1, name: "New York" },
  { id: 2, name: "Miami" },
  { id: 3, name: "Los Angeles" },
  { id: 4, name: "Chicago" },
  { id: 5, name: "Las Vegas" },
]);

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const ratingOptions = [
  { label: "5 Stars", value: 5 },
  { label: "4 Stars", value: 4 },
  { label: "3 Stars", value: 3 },
  { label: "2 Stars", value: 2 },
  { label: "1 Star", value: 1 },
];

const amenityOptions = [
  { label: "WiFi", value: "wifi" },
  { label: "Pool", value: "pool" },
  { label: "Spa", value: "spa" },
  { label: "Gym", value: "gym" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Parking", value: "parking" },
  { label: "Room Service", value: "room_service" },
  { label: "Bar", value: "bar" },
];

// Mock data
const hotels = ref([
  {
    id: 1,
    name: "Grand Plaza Hotel",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
    address: "123 Main Street",
    city: "New York",
    rating: 4.8,
    reviews: 245,
    rooms: 150,
    priceMin: 199,
    priceMax: 599,
    status: "Active",
  },
  {
    id: 2,
    name: "Seaside Resort & Spa",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop",
    address: "456 Beach Road",
    city: "Miami",
    rating: 4.6,
    reviews: 189,
    rooms: 85,
    priceMin: 249,
    priceMax: 799,
    status: "Active",
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=200&fit=crop",
    address: "789 Mountain Ave",
    city: "Denver",
    rating: 4.5,
    reviews: 156,
    rooms: 45,
    priceMin: 149,
    priceMax: 399,
    status: "Active",
  },
  {
    id: 4,
    name: "City Center Boutique",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&h=200&fit=crop",
    address: "321 Downtown Blvd",
    city: "Chicago",
    rating: 4.3,
    reviews: 98,
    rooms: 32,
    priceMin: 129,
    priceMax: 299,
    status: "Active",
  },
  {
    id: 5,
    name: "Desert Oasis Resort",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop",
    address: "555 Desert Highway",
    city: "Las Vegas",
    rating: 4.7,
    reviews: 312,
    rooms: 200,
    priceMin: 179,
    priceMax: 699,
    status: "Inactive",
  },
]);

// Computed
const filteredHotels = computed(() => {
  return hotels.value.filter((hotel) => {
    const matchSearch =
      !filters.value.search ||
      hotel.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      hotel.address.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchCity =
      !filters.value.city ||
      hotel.city ===
        cityOptions.value.find((c) => c.id === filters.value.city)?.name;
    const matchStatus =
      !filters.value.status || hotel.status === filters.value.status;
    const matchRating =
      !filters.value.rating ||
      Math.floor(hotel.rating) === filters.value.rating;

    return matchSearch && matchCity && matchStatus && matchRating;
  });
});

// Methods
function openCreateDialog() {
  hotelForm.value = { ...defaultForm };
  isEditing.value = false;
  submitted.value = false;
  hotelDialog.value = true;
}

function editHotel(hotel: any) {
  hotelForm.value = { ...hotel };
  isEditing.value = true;
  submitted.value = false;
  hotelDialog.value = true;
}

function viewHotel(hotel: any) {
  navigateTo(`/admin/hotels/${hotel.id}`);
}

function hideDialog() {
  hotelDialog.value = false;
  submitted.value = false;
}

function saveHotel() {
  submitted.value = true;

  if (!hotelForm.value.name) {
    return;
  }

  if (isEditing.value) {
    const index = hotels.value.findIndex((h) => h.id === hotelForm.value.id);
    if (index !== -1) {
      hotels.value[index] = { ...hotelForm.value };
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Hotel updated successfully",
      life: 3000,
    });
  } else {
    const newHotel = {
      ...hotelForm.value,
      id: hotels.value.length + 1,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
      rating: 0,
      reviews: 0,
    };
    hotels.value.push(newHotel);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Hotel created successfully",
      life: 3000,
    });
  }

  hideDialog();
}

function confirmDelete(hotel: any) {
  hotelToDelete.value = hotel;
  deleteDialog.value = true;
}

function confirmDeleteSelected() {
  // TODO: Implement bulk delete
}

function deleteHotel() {
  hotels.value = hotels.value.filter((h) => h.id !== hotelToDelete.value.id);
  deleteDialog.value = false;
  hotelToDelete.value = null;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Hotel deleted successfully",
    life: 3000,
  });
}

function exportData() {
  // TODO: Implement export functionality
  toast.add({
    severity: "info",
    summary: "Export",
    detail: "Exporting data...",
    life: 3000,
  });
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
