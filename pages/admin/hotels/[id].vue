<template>
  <div class="admin-layout">
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

    <div v-if="loading" class="flex items-center justify-center py-20">
      <ProgressSpinner />
    </div>

    <Tabs v-else v-model:value="activeTab" class="mb-6">
      <TabList>
        <Tab value="0"
          ><i class="pi pi-info-circle mr-2" />Basic Information</Tab
        >
        <Tab value="1"><i class="pi pi-home mr-2" />Rooms</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <HotelBasicInfoTab
            :form="form"
            :submitted="submitted"
            :saving="saving"
            :cities="cities"
            :primary-preview="primaryPreview"
            :gallery-previews="galleryPreviews"
            :max-gallery="MAX_GALLERY"
            @save="handleSave"
            @reset="resetForm"
            @remove-primary="removePrimary"
            @remove-gallery-item="removeGalleryItem"
            @set-primary-file="setPrimaryFile"
            @add-gallery-files="addGalleryFiles"
          />
        </TabPanel>

        <TabPanel value="1">
          <HotelRoomsTab
            :rooms="rooms"
            :loading-rooms="loadingRooms"
            @open-bulk-room-dialog="openBulkRoomDialog"
            @open-combined-dialog="openCombinedDialog()"
            @edit-room="(room) => openCombinedDialog(room)"
            @delete-room="confirmDeleteRoom"
          />
        </TabPanel>
      </TabPanels>
    </Tabs>

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
import Button from "primevue/button";
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

import HotelBasicInfoTab from "~/components/admin/hotel/HotelBasicInfoTab.vue";
import HotelRoomsTab from "~/components/admin/hotel/HotelRoomsTab.vue";
import CombinedRoomDialog from "~/components/admin/room/CombinedRoomDialog.vue";
import BulkRoomDialog from "~/components/admin/room/BulkRoomDialog.vue";

import type { Hotel, HotelPayload } from "~/stores/admin/interfaces/hotels";
import type {
  RoomDto,
  BulkCreateRoomPayload,
} from "~/stores/admin/interfaces/rooms";
import type { RoomTypeDto } from "~/stores/admin/interfaces/room-type";
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
const submitted = ref(false);

// Form
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
const primaryPreview = ref<string | null>(null);
const primaryFile = ref<File | null>(null);
const galleryPreviews = ref<string[]>([]);
const galleryFiles = ref<File[]>([]);

// Data
const cities = ref<{ cityId: number; name: string }[]>([]);
const rooms = ref<RoomDto[]>([]);
const roomTypes = ref<RoomTypeDto[]>([]);
const allFacilities = ref<{ facilityId: number; name: string }[]>([]);

// Dialogs
const combinedDialogVisible = ref(false);
const editingRoom = ref<RoomDto | null>(null);
const editingRoomType = ref<RoomTypeDto | null>(null);
const bulkRoomDialogVisible = ref(false);

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

// ── Combined Room Dialog ───────────────────────────────────────
function openCombinedDialog(room?: RoomDto) {
  editingRoom.value = room ?? null;
  editingRoomType.value = room
    ? (roomTypes.value.find((rt) => rt.roomTypeId === room.roomTypeId) ?? null)
    : null;
  combinedDialogVisible.value = true;
}

async function handleCombinedSave(payload: CombinedSavePayload) {
  savingRoomType.value = true;
  savingRoom.value = true;
  try {
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
</script>
