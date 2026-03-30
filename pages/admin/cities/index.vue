<template>
  <div>
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Cities Management</h1>
        <p class="admin-page-subtitle">Manage cities and destinations</p>
      </div>
      <div class="flex items-center gap-3">
        <Button label="Add City" icon="pi pi-plus" @click="openCreateDialog" />
      </div>
    </div>

    <!-- Filters Card -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Search cities..."
              class="w-full"
            />
          </IconField>
          <Dropdown
            v-model="filters.country"
            :options="countryOptions"
            optionLabel="name"
            optionValue="code"
            placeholder="All Countries"
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
        </div>
      </div>
    </div>

    <!-- Cities Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="city in filteredCities"
        :key="city.id"
        class="admin-card overflow-hidden group"
      >
        <!-- City Image -->
        <div class="relative h-48 overflow-hidden">
          <img
            :src="city.image"
            :alt="city.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-bold text-xl">{{ city.name }}</h3>
            <p class="text-white/80 text-sm">{{ city.country }}</p>
          </div>
          <div class="absolute top-3 right-3">
            <Tag
              :value="city.status"
              :severity="city.status === 'Active' ? 'success' : 'danger'"
            />
          </div>
          <div v-if="city.featured" class="absolute top-3 left-3">
            <Tag value="Featured" severity="warn" icon="pi pi-star" />
          </div>
        </div>

        <!-- City Info -->
        <div class="p-4">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div
              class="text-center p-3 rounded-lg bg-[var(--admin-surface-hover)]"
            >
              <i class="pi pi-building text-[var(--admin-primary)] mb-1"></i>
              <p class="text-lg font-bold text-[var(--admin-text-color)]">
                {{ city.hotels }}
              </p>
              <p class="text-xs text-[var(--admin-text-muted)]">Hotels</p>
            </div>
            <div
              class="text-center p-3 rounded-lg bg-[var(--admin-surface-hover)]"
            >
              <i class="pi pi-calendar text-[var(--admin-success)] mb-1"></i>
              <p class="text-lg font-bold text-[var(--admin-text-color)]">
                {{ city.bookings }}
              </p>
              <p class="text-xs text-[var(--admin-text-muted)]">Bookings</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <Button
              :label="city.featured ? 'Unfeature' : 'Feature'"
              :icon="city.featured ? 'pi pi-star-fill' : 'pi pi-star'"
              :severity="city.featured ? 'warn' : 'secondary'"
              outlined
              size="small"
              @click="toggleFeatured(city)"
            />
            <div class="flex items-center gap-1">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Edit'"
                @click="editCity(city)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                v-tooltip.top="'Delete'"
                @click="confirmDelete(city)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Add City Card -->
      <div
        class="admin-card overflow-hidden border-2 border-dashed border-[var(--admin-surface-border)] hover:border-[var(--admin-primary)] cursor-pointer transition-colors flex items-center justify-center min-h-[350px]"
        @click="openCreateDialog"
      >
        <div class="text-center p-6">
          <div
            class="w-16 h-16 rounded-full bg-[var(--admin-primary-light)] flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-plus text-2xl text-[var(--admin-primary)]"></i>
          </div>
          <p class="font-semibold text-[var(--admin-text-color)]">
            Add New City
          </p>
          <p class="text-sm text-[var(--admin-text-muted)]">
            Click to add a new destination
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredCities.length === 0 && filters.search"
      class="admin-card p-12 text-center"
    >
      <i class="pi pi-search text-5xl text-[var(--admin-text-muted)] mb-4"></i>
      <h3 class="text-xl font-semibold text-[var(--admin-text-color)] mb-2">
        No cities found
      </h3>
      <p class="text-[var(--admin-text-muted)]">
        Try adjusting your search or filters
      </p>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="cityDialog"
      :style="{ width: '600px' }"
      :header="isEditing ? 'Edit City' : 'Add New City'"
      :modal="true"
      class="p-fluid"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div class="field md:col-span-2">
          <label for="name" class="font-medium mb-2 block">City Name *</label>
          <InputText
            id="name"
            v-model="cityForm.name"
            placeholder="Enter city name"
            :class="{ 'p-invalid': submitted && !cityForm.name }"
          />
          <small v-if="submitted && !cityForm.name" class="p-error">
            City name is required
          </small>
        </div>

        <div class="field">
          <label for="country" class="font-medium mb-2 block">Country *</label>
          <Dropdown
            id="country"
            v-model="cityForm.country"
            :options="countryOptions"
            optionLabel="name"
            optionValue="name"
            placeholder="Select country"
            :class="{ 'p-invalid': submitted && !cityForm.country }"
          />
        </div>

        <div class="field">
          <label for="status" class="font-medium mb-2 block">Status</label>
          <Dropdown
            id="status"
            v-model="cityForm.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
          />
        </div>

        <div class="field md:col-span-2">
          <label for="description" class="font-medium mb-2 block"
            >Description</label
          >
          <Textarea
            id="description"
            v-model="cityForm.description"
            rows="3"
            placeholder="Enter city description"
          />
        </div>

        <div class="field md:col-span-2">
          <label for="image" class="font-medium mb-2 block">Image URL</label>
          <InputText
            id="image"
            v-model="cityForm.image"
            placeholder="Enter image URL"
          />
          <div v-if="cityForm.image" class="mt-2">
            <img
              :src="cityForm.image"
              alt="Preview"
              class="w-full h-32 object-cover rounded-lg"
            />
          </div>
        </div>

        <div class="field md:col-span-2">
          <div class="flex items-center gap-2">
            <Checkbox
              id="featured"
              v-model="cityForm.featured"
              :binary="true"
            />
            <label for="featured" class="cursor-pointer"
              >Mark as featured destination</label
            >
          </div>
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
        <Button label="Save" icon="pi pi-check" @click="saveCity" />
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
        <span>
          Are you sure you want to delete
          <strong>{{ cityToDelete?.name }}</strong
          >? This will not delete the hotels in this city.
        </span>
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
          @click="deleteCity"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const toast = useToast();

// State
const cityDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const isEditing = ref(false);
const cityToDelete = ref<any>(null);

// Filters
const filters = ref({
  search: "",
  country: null,
  status: null,
});

// Form
const defaultForm = {
  name: "",
  country: "",
  description: "",
  image: "",
  status: "Active",
  featured: false,
};
const cityForm = ref({ ...defaultForm });

// Options
const countryOptions = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "UK" },
  { name: "France", code: "FR" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Germany", code: "DE" },
  { name: "Japan", code: "JP" },
  { name: "Thailand", code: "TH" },
  { name: "Australia", code: "AU" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

// Mock cities data
const cities = ref([
  {
    id: 1,
    name: "New York",
    country: "United States",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop",
    hotels: 156,
    bookings: 2840,
    status: "Active",
    featured: true,
  },
  {
    id: 2,
    name: "Miami",
    country: "United States",
    image:
      "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=500&h=300&fit=crop",
    hotels: 98,
    bookings: 1920,
    status: "Active",
    featured: true,
  },
  {
    id: 3,
    name: "Los Angeles",
    country: "United States",
    image:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=500&h=300&fit=crop",
    hotels: 124,
    bookings: 2150,
    status: "Active",
    featured: false,
  },
  {
    id: 4,
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=300&fit=crop",
    hotels: 210,
    bookings: 3200,
    status: "Active",
    featured: true,
  },
  {
    id: 5,
    name: "London",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop",
    hotels: 185,
    bookings: 2890,
    status: "Active",
    featured: true,
  },
  {
    id: 6,
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
    hotels: 142,
    bookings: 1850,
    status: "Active",
    featured: false,
  },
  {
    id: 7,
    name: "Rome",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&h=300&fit=crop",
    hotels: 95,
    bookings: 1420,
    status: "Active",
    featured: false,
  },
  {
    id: 8,
    name: "Bangkok",
    country: "Thailand",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=500&h=300&fit=crop",
    hotels: 78,
    bookings: 980,
    status: "Inactive",
    featured: false,
  },
]);

// Computed
const filteredCities = computed(() => {
  return cities.value.filter((city) => {
    const matchSearch =
      !filters.value.search ||
      city.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      city.country.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchCountry =
      !filters.value.country ||
      city.country ===
        countryOptions.find((c) => c.code === filters.value.country)?.name;
    const matchStatus =
      !filters.value.status || city.status === filters.value.status;

    return matchSearch && matchCountry && matchStatus;
  });
});

// Methods
function openCreateDialog() {
  cityForm.value = { ...defaultForm };
  isEditing.value = false;
  submitted.value = false;
  cityDialog.value = true;
}

function editCity(city: any) {
  cityForm.value = { ...city };
  isEditing.value = true;
  submitted.value = false;
  cityDialog.value = true;
}

function hideDialog() {
  cityDialog.value = false;
  submitted.value = false;
}

function saveCity() {
  submitted.value = true;

  if (!cityForm.value.name || !cityForm.value.country) {
    return;
  }

  if (isEditing.value) {
    const index = cities.value.findIndex((c) => c.id === cityForm.value.id);
    if (index !== -1) {
      cities.value[index] = { ...cities.value[index], ...cityForm.value };
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "City updated successfully",
      life: 3000,
    });
  } else {
    const newCity = {
      ...cityForm.value,
      id: cities.value.length + 1,
      hotels: 0,
      bookings: 0,
      image:
        cityForm.value.image ||
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop",
    };
    cities.value.push(newCity);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "City created successfully",
      life: 3000,
    });
  }

  hideDialog();
}

function confirmDelete(city: any) {
  cityToDelete.value = city;
  deleteDialog.value = true;
}

function deleteCity() {
  cities.value = cities.value.filter((c) => c.id !== cityToDelete.value.id);
  deleteDialog.value = false;
  cityToDelete.value = null;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "City deleted successfully",
    life: 3000,
  });
}

function toggleFeatured(city: any) {
  city.featured = !city.featured;
  toast.add({
    severity: "success",
    summary: "Updated",
    detail: city.featured
      ? "City marked as featured"
      : "City removed from featured",
    life: 3000,
  });
}
</script>
