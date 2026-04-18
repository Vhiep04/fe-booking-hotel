<template>
  <div class="admin-layout">
    <!-- Breadcrumb -->
    <!-- <div class="mb-6">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/admin/hotels" class="text-blue-600 hover:text-blue-800"
          >Hotels</NuxtLink
        >
        <span class="text-gray-400">/</span>
        <span class="text-gray-700 dark:text-gray-300">{{
          form.name || "Hotel Detail"
        }}</span>
      </nav>
    </div> -->

    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="admin-page-title">Hotel Details</h1>
        <p class="admin-page-subtitle">Manage hotel information and rooms</p>
      </div>
      <div class="flex gap-3">
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          severity="secondary"
          @click="navigateTo('/admin/hotels')"
        />
        <Button
          label="Delete Hotel"
          icon="pi pi-trash"
          severity="danger"
          :loading="deleting"
          @click="confirmDelete"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <ProgressSpinner />
    </div>

    <!-- ✅ PrimeVue v4: Tabs -->
    <Tabs v-else v-model:value="activeTab" class="mb-6">
      <TabList>
        <Tab value="0">
          <i class="pi pi-info-circle mr-2" />Basic Information
        </Tab>
        <Tab value="1"> <i class="pi pi-home mr-2" />Rooms </Tab>
      </TabList>

      <TabPanels>
        <!-- Tab 1: Basic Information -->
        <TabPanel value="0">
          <div class="flex flex-col gap-6 pt-4">
            <!-- Basic Information Section -->
            <div class="flex flex-col gap-4">
              <span
                class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
              >
                <i class="pi pi-building" /> Basic Information
              </span>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2 flex flex-col gap-1">
                  <label class="text-sm font-medium"
                    >Hotel Name <span class="text-red-500">*</span></label
                  >
                  <InputText
                    v-model="form.name"
                    placeholder="e.g. Hanoi Hilton"
                    :class="{ 'p-invalid': submitted && !form.name }"
                  />
                  <small v-if="submitted && !form.name" class="p-error"
                    >Hotel name is required</small
                  >
                </div>

                <div class="md:col-span-2 flex flex-col gap-1">
                  <label class="text-sm font-medium">Description</label>
                  <Textarea
                    v-model="form.description"
                    rows="3"
                    placeholder="Enter hotel description"
                    class="resize-none"
                  />
                </div>
              </div>
            </div>

            <!-- Location Section -->
            <div class="flex flex-col gap-4">
              <span
                class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
              >
                <i class="pi pi-map-marker" /> Location
              </span>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium"
                    >City <span class="text-red-500">*</span></label
                  >
                  <Dropdown
                    v-model="form.cityId"
                    :options="cities"
                    optionLabel="name"
                    optionValue="cityId"
                    placeholder="Select a city"
                    class="w-full"
                    :class="{ 'p-invalid': submitted && !form.cityId }"
                  />
                  <small v-if="submitted && !form.cityId" class="p-error"
                    >City is required</small
                  >
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium"
                    >Address <span class="text-red-500">*</span></label
                  >
                  <InputText
                    v-model="form.location"
                    placeholder="e.g. 123 Ba Dinh St"
                    :class="{ 'p-invalid': submitted && !form.location }"
                  />
                  <small v-if="submitted && !form.location" class="p-error"
                    >Address is required</small
                  >
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">Latitude</label>
                  <InputNumber
                    v-model="form.latitude"
                    placeholder="e.g. 21.0285"
                    :minFractionDigits="0"
                    :maxFractionDigits="6"
                    mode="decimal"
                    locale="en-US"
                    class="w-full"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">Longitude</label>
                  <InputNumber
                    v-model="form.longitude"
                    placeholder="e.g. 105.8542"
                    :minFractionDigits="0"
                    :maxFractionDigits="6"
                    mode="decimal"
                    locale="en-US"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Primary Image Section -->
            <div class="flex flex-col gap-3">
              <span
                class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
              >
                <i class="pi pi-image" /> Primary Image
              </span>

              <div
                class="relative h-[300px] object-contain rounded-xl border-2 border-dashed border-(--admin-surface-border) overflow-hidden cursor-pointer transition-colors hover:border-(--admin-primary) hover:bg-(--admin-primary-light)"
                :class="{ 'border-solid! border-transparent!': primaryPreview }"
                @click="primaryInput?.click()"
                @dragover.prevent
                @drop.prevent="
                  (e) => {
                    const f = e.dataTransfer?.files?.[0];
                    if (f?.type.startsWith('image/')) setPrimaryFile(f);
                  }
                "
              >
                <template v-if="primaryPreview">
                  <img
                    :src="primaryPreview"
                    class="w-full h-full object-cover"
                  />
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
                  >
                    <button
                      class="text-white text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-1.5 rounded-lg border border-white/40 transition-colors"
                      @click.stop="removePrimary"
                    >
                      <i class="pi pi-trash mr-1" /> Remove
                    </button>
                    <button
                      class="text-white text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-1.5 rounded-lg border border-white/40 transition-colors"
                      @click.stop="primaryInput?.click()"
                    >
                      <i class="pi pi-refresh mr-1" /> Change
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="flex flex-col items-center justify-center h-full gap-2 text-(--admin-text-muted)"
                  >
                    <i class="pi pi-cloud-upload text-2xl" />
                    <p class="text-sm font-medium">
                      Drop cover image or
                      <span class="text-(--admin-primary) font-semibold"
                        >browse</span
                      >
                    </p>
                    <p class="text-xs">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </template>
              </div>
              <input
                ref="primaryInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="
                  (e) => {
                    const f = (e.target as HTMLInputElement).files?.[0];
                    if (f) setPrimaryFile(f);
                    (e.target as HTMLInputElement).value = '';
                  }
                "
              />
            </div>

            <!-- Gallery Section -->
            <div class="flex flex-col gap-3">
              <span
                class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
              >
                <i class="pi pi-images" /> Gallery
                <span
                  class="ml-auto text-[0.65rem] font-semibold bg-(--admin-primary-light) text-(--admin-primary) px-2 py-0.5 rounded-full"
                >
                  {{ galleryPreviews.length }} / {{ MAX_GALLERY }}
                </span>
              </span>

              <div
                v-if="galleryPreviews.length > 0"
                class="grid grid-cols-4 sm:grid-cols-6 gap-2"
              >
                <div
                  v-for="(img, i) in galleryPreviews"
                  :key="i"
                  class="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    :src="img"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/90 text-white text-[0.55rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="removeGalleryItem(i)"
                  >
                    <i class="pi pi-times" />
                  </button>
                </div>
                <div
                  v-if="galleryPreviews.length < MAX_GALLERY"
                  class="aspect-square rounded-lg border-2 border-dashed border-(--admin-surface-border) flex items-center justify-center cursor-pointer text-(--admin-text-muted) hover:border-(--admin-primary) hover:text-(--admin-primary) hover:bg-(--admin-primary-light) transition-colors"
                  @click="galleryInput?.click()"
                >
                  <i class="pi pi-plus text-lg" />
                </div>
              </div>

              <div
                v-else
                class="rounded-xl border-2 border-dashed border-(--admin-surface-border) cursor-pointer hover:border-(--admin-primary) hover:bg-(--admin-primary-light) transition-colors"
                @click="galleryInput?.click()"
                @dragover.prevent
                @drop.prevent="
                  (e) =>
                    addGalleryFiles(Array.from(e.dataTransfer?.files ?? []))
                "
              >
                <div
                  class="flex flex-col items-center justify-center py-8 gap-2 text-(--admin-text-muted)"
                >
                  <i class="pi pi-images text-2xl" />
                  <p class="text-sm font-medium">
                    Drop images or
                    <span class="text-(--admin-primary) font-semibold"
                      >browse</span
                    >
                  </p>
                  <p class="text-xs">Up to {{ MAX_GALLERY }} images</p>
                </div>
              </div>
              <input
                ref="galleryInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="
                  (e) => {
                    addGalleryFiles(
                      Array.from((e.target as HTMLInputElement).files ?? []),
                    );
                    (e.target as HTMLInputElement).value = '';
                  }
                "
              />
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <Button
                label="Save Changes"
                icon="pi pi-check"
                :loading="saving"
                @click="handleSave"
              />
              <Button
                label="Reset"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                @click="resetForm"
              />
            </div>
          </div>
        </TabPanel>

        <!-- Tab 2: Rooms -->
        <TabPanel value="1">
          <div class="space-y-4 pt-4">
            <!-- <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Room Types
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Define room categories with pricing and capacity
                  </p>
                </div>
                <Button
                  label="Add Room Type"
                  icon="pi pi-plus"
                  @click="openCombinedDialog()"
                />
              </div>

              <div v-if="loadingRoomTypes" class="flex justify-center py-8">
                <ProgressSpinner style="width: 32px; height: 32px" />
              </div>

              <div
                v-else-if="roomTypes.length === 0"
                class="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <i class="pi pi-inbox text-3xl mb-2 block" />
                <p class="text-sm">
                  No room types yet. Add one to get started.
                </p>
              </div>

              <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div
                  v-for="rt in roomTypes"
                  :key="rt.roomTypeId"
                  class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <h4
                        class="font-semibold text-gray-900 dark:text-white truncate"
                      >
                        {{ rt.typeName }}
                      </h4>
                      <p
                        class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2"
                      >
                        {{ rt.description || "—" }}
                      </p>
                    </div>
                    <div class="flex gap-1 shrink-0">
                      <Button
                        icon="pi pi-pencil"
                        severity="info"
                        text
                        rounded
                        size="small"
                        v-tooltip="'Edit'"
                        @click="openCombinedDialog(undefined, rt)"
                      />
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        size="small"
                        v-tooltip="'Delete'"
                        @click="confirmDeleteRoomType(rt)"
                      />
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs">
                    <span
                      class="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg"
                    >
                      <i class="pi pi-users" /> {{ rt.capacity }} guests
                    </span>
                    <span
                      class="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg"
                    >
                      <i class="pi pi-tag" />
                      {{ formatPrice(rt.pricePerNight) }}/night
                    </span>
                    <span
                      class="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg"
                    >
                      <i class="pi pi-home" /> {{ rt.roomCount }} rooms
                    </span>
                  </div>
                  <div
                    v-if="rt.facilities?.length"
                    class="flex flex-wrap gap-1"
                  >
                    <Tag
                      v-for="f in rt.facilities"
                      :key="f.facilityId"
                      :value="f.name"
                      severity="secondary"
                      class="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider /> -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Individual Rooms
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Manage physical room numbers and availability
                  </p>
                </div>
                <div class="flex gap-2">
                  <Button
                    label="Bulk Add"
                    icon="pi pi-copy"
                    severity="secondary"
                    outlined
                    @click="openBulkRoomDialog"
                  />
                  <Button
                    label="Add Room"
                    icon="pi pi-plus"
                    @click="openCombinedDialog()"
                  />
                </div>
              </div>

              <div v-if="loadingRooms" class="flex justify-center py-8">
                <ProgressSpinner style="width: 32px; height: 32px" />
              </div>

              <DataTable
                v-else
                :value="rooms"
                paginator
                :rows="10"
                responsiveLayout="scroll"
                stripedRows
                class="text-sm"
              >
                <!-- <Column
                  field="roomNumber"
                  header="Room No."
                  style="width: 12%"
                /> -->
                <Column
                  field="roomType"
                  header="Room Type"
                  style="width: 22%"
                />
                <Column field="capacity" header="Capacity" style="width: 12%">
                  <template #body="{ data }"
                    >{{ data.capacity }} guests</template
                  >
                </Column>
                <Column
                  field="pricePerNight"
                  header="Price/Night"
                  style="width: 18%"
                >
                  <template #body="{ data }">{{
                    formatPrice(data.pricePerNight)
                  }}</template>
                </Column>
                <Column field="status" header="Status" style="width: 16%">
                  <template #body="{ data }">
                    <Tag
                      :value="data.status"
                      :severity="getRoomStatusSeverity(data.status)"
                    />
                  </template>
                </Column>
                <Column header="Actions" style="width: 20%">
                  <template #body="{ data }">
                    <Button
                      icon="pi pi-pencil"
                      severity="info"
                      text
                      rounded
                      v-tooltip="'Edit'"
                      @click="openCombinedDialog(data)"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      v-tooltip="'Delete'"
                      @click="confirmDeleteRoom(data)"
                    />
                  </template>
                </Column>
                <template #empty>
                  <div class="text-center py-8 text-gray-400">
                    <i class="pi pi-inbox text-2xl mb-2 block" />
                    <p class="text-sm">No rooms found.</p>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- Combined Dialog -->
    <CombinedRoomDialog
      v-model="combinedDialogVisible"
      :hotel-id="hotelId"
      :saving="savingRoom || savingRoomType"
      :editing-room="editingRoom"
      :editing-room-type="editingRoomType"
      :facilities="allFacilities"
      @save="handleCombinedSave"
      @hide="combinedDialogVisible = false"
    />

    <BulkRoomDialog
      v-model="bulkRoomDialogVisible"
      :hotel-id="hotelId"
      :room-types="roomTypes"
      :saving="savingRoom"
      @save="handleBulkCreateRooms"
      @hide="bulkRoomDialogVisible = false"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Tabs from "primevue/tabs";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Divider from "primevue/divider";
import ProgressSpinner from "primevue/progressspinner";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import { useAdminHotelStore } from "~/stores/admin/hotels";
import { useRoomStore } from "~/stores/admin/rooms";
import { useRoomTypeStore } from "~/stores/admin/room-type";
import { useCitiesStore } from "~/stores/admin/cities";
import { useUploadStore } from "~/stores/admin/uploadImage";

import CombinedRoomDialog from "~/components/admin/room/CombinedRoomDialog.vue";
import BulkRoomDialog from "~/components/admin/room/BulkRoomDialog.vue";

import type { Hotel, HotelPayload } from "~/stores/admin/interfaces/hotels";
import type {
  RoomDto,
  RoomPayload,
  BulkCreateRoomPayload,
} from "~/stores/admin/interfaces/rooms";
import type {
  RoomTypeDto,
  RoomTypePayload,
} from "~/stores/admin/interfaces/room-type";
import type { CombinedSavePayload } from "~/components/admin/room/CombinedRoomDialog.vue";

definePageMeta({ layout: "admin", middleware: ["admin"] });

const route = useRoute();
const confirm = useConfirm();
const toast = useToast();

const hotelStore = useAdminHotelStore();
const roomStore = useRoomStore();
const roomTypeStore = useRoomTypeStore();
const citiesStore = useCitiesStore();
const uploadStore = useUploadStore();

const MAX_GALLERY = 3;

const hotelId = computed(() => Number(route.params.id));
const activeTab = ref("0");

// Loading states
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const loadingRooms = ref(false);
const loadingRoomTypes = ref(false);
const savingRoom = ref(false);
const savingRoomType = ref(false);

// Form
const submitted = ref(false);
const form = ref<HotelPayload>({
  cityId: 0,
  name: "",
  location: "",
  description: "",
  imgUrl: "",
  latitude: 0,
  longitude: 0,
});

// Images
const primaryInput = ref<HTMLInputElement | null>(null);
const primaryPreview = ref<string | null>(null);
const primaryFile = ref<File | null>(null);
const galleryInput = ref<HTMLInputElement | null>(null);
const galleryPreviews = ref<string[]>([]);
const galleryFiles = ref<File[]>([]);

// Cities
const cities = ref<{ cityId: number; name: string }[]>([]);

// Data
const rooms = ref<RoomDto[]>([]);
const roomTypes = ref<RoomTypeDto[]>([]);

// Dialogs
const combinedDialogVisible = ref(false);
const editingRoom = ref<RoomDto | null>(null);
const editingRoomType = ref<RoomTypeDto | null>(null);
const bulkRoomDialogVisible = ref(false);

// Facilities
const allFacilities = ref<{ facilityId: number; name: string }[]>([]);

onMounted(async () => {
  await Promise.all([fetchHotel(), fetchCities()]);
  await Promise.all([fetchRoomTypes(), fetchRooms()]);
});

// ── Fetch ──────────────────────────────────────────────────────
async function fetchHotel() {
  loading.value = true;
  try {
    const res = await hotelStore.fetchHotelById(hotelId.value);
    if (res?.success && res.data) {
      const h: Hotel = res.data;
      form.value = {
        cityId: h.cityId,
        name: h.name,
        location: h.location,
        description: h.description ?? "",
        imgUrl: h.imgUrl ?? "",
        latitude: h.latitude ?? 0,
        longitude: h.longitude ?? 0,
      };
      const primaryImg = h.images?.find((img: any) => img.isPrimary);
      primaryPreview.value = primaryImg?.imageUrl ?? h.imgUrl ?? null;
      galleryPreviews.value = (
        h.images?.filter((img: any) => !img.isPrimary) ?? []
      ).map((img: any) => img.imageUrl);
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load hotel",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

async function fetchCities() {
  try {
    const res = await citiesStore.getCities({ pageSize: 200 });
    if (res?.success) {
      cities.value = res.data.items.map((c: any) => ({
        cityId: c.cityId,
        name: c.name,
      }));
    }
  } catch {}
}

async function fetchRooms() {
  loadingRooms.value = true;
  try {
    const res = await roomStore.getRoomsByHotel(hotelId.value);
    if (res?.success) rooms.value = res.data;
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load rooms",
      life: 3000,
    });
  } finally {
    loadingRooms.value = false;
  }
}

async function fetchRoomTypes() {
  loadingRoomTypes.value = true;
  try {
    const res = await roomTypeStore.getRoomTypesByHotel(hotelId.value);
    if (res?.success) roomTypes.value = res.data;
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load room types",
      life: 3000,
    });
  } finally {
    loadingRoomTypes.value = false;
  }
}

// ── Image helpers ──────────────────────────────────────────────
function toPreview(file: File): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

async function setPrimaryFile(file: File) {
  primaryFile.value = file;
  primaryPreview.value = await toPreview(file);
}

function removePrimary() {
  primaryPreview.value = null;
  primaryFile.value = null;
}

async function addGalleryFiles(files: File[]) {
  const remaining = MAX_GALLERY - galleryFiles.value.length;
  const toAdd = files
    .filter((f) => f.type.startsWith("image/"))
    .slice(0, remaining);
  for (const file of toAdd) {
    galleryFiles.value.push(file);
    galleryPreviews.value.push(await toPreview(file));
  }
}

function removeGalleryItem(i: number) {
  galleryFiles.value.splice(i, 1);
  galleryPreviews.value.splice(i, 1);
}

function resetForm() {
  fetchHotel();
}

// ── Save hotel ─────────────────────────────────────────────────
async function handleSave() {
  submitted.value = true;
  if (!form.value.name || !form.value.cityId || !form.value.location) {
    toast.add({
      severity: "warn",
      summary: "Validation",
      detail: "Please fill in all required fields",
      life: 3000,
    });
    return;
  }
  saving.value = true;
  try {
    const res = await hotelStore.updateHotel(hotelId.value, form.value);
    if (!res?.success) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to update hotel",
        life: 3000,
      });
      return;
    }
    if (primaryFile.value) {
      const up = await uploadStore.uploadImage(primaryFile.value, "hotels");
      if (up?.success && up.data) {
        await hotelStore.addHotelImage(hotelId.value, {
          imageUrl: up.data.url,
          isPrimary: true,
          displayOrder: 0,
          description: "",
        });
        primaryFile.value = null;
      }
    }
    if (galleryFiles.value.length) {
      const up = await uploadStore.uploadImages(galleryFiles.value, "hotels");
      if (up?.success && up.data?.uploaded?.length) {
        await hotelStore.bulkAddHotelImages(
          hotelId.value,
          up.data.uploaded.map((img: any) => img.url),
        );
        galleryFiles.value = [];
      }
    }
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Hotel updated successfully",
      life: 3000,
    });
    submitted.value = false;
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e?.message ?? "Unexpected error",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

// ── Delete hotel ───────────────────────────────────────────────
function confirmDelete() {
  confirm.require({
    message:
      "Are you sure you want to delete this hotel? This action cannot be undone.",
    header: "Delete Hotel",
    icon: "pi pi-exclamation-triangle",
    acceptProps: { severity: "danger", label: "Delete" },
    rejectProps: { severity: "secondary", label: "Cancel", outlined: true },
    accept: async () => {
      deleting.value = true;
      try {
        const res = await hotelStore.deleteHotel(hotelId.value);
        if (res?.success) {
          toast.add({
            severity: "success",
            summary: "Deleted",
            detail: "Hotel deleted",
            life: 2000,
          });
          setTimeout(() => navigateTo("/admin/hotels"), 1500);
        } else {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: res?.message ?? "Failed to delete hotel",
            life: 3000,
          });
        }
      } finally {
        deleting.value = false;
      }
    },
  });
}

// ── Combined Room & RoomType Dialog ─────────────────────────────
function openCombinedDialog(room?: RoomDto, roomType?: RoomTypeDto) {
  editingRoom.value = room ?? null;
  editingRoomType.value =
    roomType ??
    (room
      ? (roomTypes.value.find((rt) => rt.roomTypeId === room.roomTypeId) ??
        null)
      : null);
  combinedDialogVisible.value = true;
}

async function handleCombinedSave(payload: CombinedSavePayload) {
  savingRoomType.value = true;
  savingRoom.value = true;
  try {
    // 1. Save RoomType
    const rtRes = payload.roomTypeId
      ? await roomTypeStore.updateRoomType(
          payload.roomTypeId,
          payload.roomTypePayload,
        )
      : await roomTypeStore.createRoomType(payload.roomTypePayload);

    if (!rtRes?.success) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: rtRes?.message ?? "Failed to save room type",
        life: 3000,
      });
      return;
    }

    const savedRoomTypeId: number =
      payload.roomTypeId ?? rtRes.data?.roomTypeId ?? rtRes.data?.id;

    // 2. Save Room
    const roomPayloadFull = {
      ...payload.roomPayload,
      roomTypeId: savedRoomTypeId,
    };

    const rRes = payload.roomId
      ? await roomStore.updateRoom(payload.roomId, roomPayloadFull)
      : await roomStore.createRoom(roomPayloadFull);

    if (!rRes?.success) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: rRes?.message ?? "Failed to save room",
        life: 3000,
      });
      return;
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: payload.roomId
        ? "Room updated"
        : "Room & Room Type saved successfully",
      life: 3000,
    });

    combinedDialogVisible.value = false;
    await Promise.all([fetchRoomTypes(), fetchRooms()]);
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e?.message ?? "Unexpected error",
      life: 3000,
    });
  } finally {
    savingRoomType.value = false;
    savingRoom.value = false;
  }
}

// ── Bulk Room ──────────────────────────────────────────────────
function openBulkRoomDialog() {
  bulkRoomDialogVisible.value = true;
}

async function handleBulkCreateRooms(payload: BulkCreateRoomPayload) {
  savingRoom.value = true;
  try {
    const res = await roomStore.bulkCreateRooms(payload);
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: `${res.data?.length ?? 0} rooms created`,
        life: 3000,
      });
      bulkRoomDialogVisible.value = false;
      await fetchRooms();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to bulk create rooms",
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
    savingRoom.value = false;
  }
}

// ── Delete handlers ────────────────────────────────────────────
function confirmDeleteRoomType(rt: RoomTypeDto) {
  confirm.require({
    message: `Delete room type "${rt.typeName}"?`,
    header: "Delete Room Type",
    icon: "pi pi-exclamation-triangle",
    acceptProps: { severity: "danger", label: "Delete" },
    rejectProps: { severity: "secondary", label: "Cancel", outlined: true },
    accept: async () => {
      try {
        const res = await roomTypeStore.deleteRoomType(rt.roomTypeId);
        if (res?.success) {
          toast.add({
            severity: "success",
            summary: "Deleted",
            detail: "Room type deleted",
            life: 2000,
          });
          await fetchRoomTypes();
        } else {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: res?.message ?? "Failed to delete",
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
      }
    },
  });
}

function confirmDeleteRoom(room: RoomDto) {
  confirm.require({
    message: `Delete room "${room.roomNumber}"?`,
    header: "Delete Room",
    icon: "pi pi-exclamation-triangle",
    acceptProps: { severity: "danger", label: "Delete" },
    rejectProps: { severity: "secondary", label: "Cancel", outlined: true },
    accept: async () => {
      try {
        const res = await roomStore.deleteRoom(room.roomId);
        if (res?.success) {
          toast.add({
            severity: "success",
            summary: "Deleted",
            detail: "Room deleted",
            life: 2000,
          });
          await fetchRooms();
        } else {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: res?.message ?? "Failed to delete room",
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
      }
    },
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getRoomStatusSeverity(status: string) {
  const map: Record<string, string> = {
    Available: "success",
    Occupied: "danger",
    Maintenance: "warning",
    Reserved: "info",
  };
  return map[status] ?? "secondary";
}
</script>
