<template>
  <div class="admin-layout">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="admin-page-title">{{ t("Hotel Details") }}</h1>
        <p class="admin-page-subtitle">
          {{ t("Manage hotel information and rooms") }}
        </p>
      </div>
      <div class="flex gap-3">
        <Button
          :label="t('Back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          @click="navigateTo('/admin/hotels')"
        />
        <Button
          :label="t('Delete Hotel')"
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
          ><i class="pi pi-info-circle mr-2" />{{ t("Basic Information") }}</Tab
        >
        <Tab value="1"><i class="pi pi-home mr-2" />{{ t("Rooms") }}</Tab>
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
      @save="handleCombinedSave"
      @hide="combinedDialogVisible = false"
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
import type { Hotel, HotelPayload } from "~/stores/admin/interfaces/hotels";
import type {
  RoomDto,
  BulkCreateRoomPayload,
} from "~/stores/admin/interfaces/rooms";
import type { RoomTypeDto } from "~/stores/admin/interfaces/room-type";
import type { CombinedSavePayload } from "~/components/admin/room/CombinedRoomDialog.vue";

definePageMeta({ layout: "admin", middleware: ["admin"] });

const { t } = useI18n();
const route = useRoute();
const confirm = useConfirm();
const toast = useToast();
const hotelStore = useAdminHotelStore();
const roomStore = useRoomStore();
const roomTypeStore = useRoomTypeStore();
const citiesStore = useCitiesStore();
const uploadStore = useUploadStore();

const MAX_GALLERY = 4;
const hotelId = computed(() => Number(route.params.id));
const activeTab = ref("0");

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const loadingRooms = ref(false);
const loadingRoomTypes = ref(false);
const savingRoom = ref(false);
const savingRoomType = ref(false);
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
const primaryPreview = ref<string | null>(null);
const primaryFile = ref<File | null>(null);
const galleryPreviews = ref<string[]>([]);
const galleryFiles = ref<File[]>([]);
const cities = ref<{ cityId: number; name: string }[]>([]);
const rooms = ref<RoomDto[]>([]);
const roomTypes = ref<RoomTypeDto[]>([]);
const combinedDialogVisible = ref(false);
const editingRoom = ref<RoomDto | null>(null);
const editingRoomType = ref<RoomTypeDto | null>(null);
const pendingDeleteImages = ref<{ imageId: number; publicId: string }[]>([]);
const pendingDeletePrimary = ref<{ imageId: number; publicId: string } | null>(
  null,
);

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
      summary: t("Error"),
      detail: t("Failed to load hotel"),
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

async function fetchCities() {
  try {
    const res = await citiesStore.getCities({ pageSize: 200 });
    if (res?.success)
      cities.value = res.data.items.map((c: any) => ({
        cityId: c.cityId,
        name: c.name,
      }));
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
      summary: t("Error"),
      detail: t("Failed to load rooms"),
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
      summary: t("Error"),
      detail: t("Failed to load room types"),
      life: 3000,
    });
  } finally {
    loadingRoomTypes.value = false;
  }
}

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
  if (primaryPreview.value?.startsWith("https://res.cloudinary.com")) {
    const imgRecord = hotelStore.selectedHotel?.images?.find(
      (img: any) => img.isPrimary,
    );
    if (imgRecord) {
      const publicId = extractCloudinaryPublicId(primaryPreview.value);
      if (publicId)
        pendingDeletePrimary.value = { imageId: imgRecord.imageId, publicId };
    }
  }
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

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function removeGalleryItem(i: number) {
  const urlToDelete = galleryPreviews.value[i];
  if (urlToDelete?.startsWith("https://res.cloudinary.com")) {
    const imgRecord = hotelStore.selectedHotel?.images?.find(
      (img: any) => img.imageUrl === urlToDelete,
    );
    if (imgRecord) {
      const publicId = extractCloudinaryPublicId(urlToDelete);
      if (publicId)
        pendingDeleteImages.value.push({
          imageId: imgRecord.imageId,
          publicId,
        });
    }
  }
  galleryFiles.value.splice(i, 1);
  galleryPreviews.value.splice(i, 1);
}

function resetForm() {
  pendingDeleteImages.value = [];
  pendingDeletePrimary.value = null;
  fetchHotel();
}

async function handleSave() {
  submitted.value = true;
  if (!form.value.name || !form.value.cityId || !form.value.location) {
    toast.add({
      severity: "warn",
      summary: t("Validation"),
      detail: t("Please fill in all required fields"),
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
        summary: t("Error"),
        detail: res?.message ?? t("Failed to update hotel"),
        life: 3000,
      });
      return;
    }

    for (const item of pendingDeleteImages.value) {
      await uploadStore.deleteImage(item.publicId);
      await hotelStore.deleteHotelImage(hotelId.value, item.imageId);
    }
    pendingDeleteImages.value = [];

    if (pendingDeletePrimary.value) {
      await uploadStore.deleteImage(pendingDeletePrimary.value.publicId);
      await hotelStore.deleteHotelImage(
        hotelId.value,
        pendingDeletePrimary.value.imageId,
      );
      pendingDeletePrimary.value = null;
    }

    if (primaryFile.value) {
      const oldPrimary = hotelStore.selectedHotel?.images?.find(
        (img: any) => img.isPrimary,
      );
      if (oldPrimary && !pendingDeletePrimary.value) {
        const publicId = extractCloudinaryPublicId(oldPrimary.imageUrl);
        if (publicId) await uploadStore.deleteImage(publicId);
        await hotelStore.deleteHotelImage(hotelId.value, oldPrimary.imageId);
      }
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
      summary: t("Success"),
      detail: t("Hotel updated successfully"),
      life: 3000,
    });
    submitted.value = false;
    await fetchHotel();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: e?.message ?? t("Unexpected error"),
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete() {
  confirm.require({
    message: t(
      "Are you sure you want to delete this hotel? This action cannot be undone.",
    ),
    header: t("Delete Hotel"),
    icon: "pi pi-exclamation-triangle",
    acceptProps: { severity: "danger", label: t("Delete") },
    rejectProps: { severity: "secondary", label: t("Cancel"), outlined: true },
    accept: async () => {
      deleting.value = true;
      try {
        const res = await hotelStore.deleteHotel(hotelId.value);
        if (res?.success) {
          toast.add({
            severity: "success",
            summary: t("Deleted"),
            detail: t("Hotel deleted"),
            life: 2000,
          });
          setTimeout(() => navigateTo("/admin/hotels"), 1500);
        } else {
          toast.add({
            severity: "error",
            summary: t("Error"),
            detail: res?.message ?? t("Failed to delete hotel"),
            life: 3000,
          });
        }
      } finally {
        deleting.value = false;
      }
    },
  });
}

async function openCombinedDialog(room?: RoomDto) {
  editingRoom.value = null;
  editingRoomType.value = null;
  if (room) {
    loadingRooms.value = true;
    try {
      const [roomRes, roomTypeRes] = await Promise.all([
        roomStore.getRoomById(room.roomId),
        roomTypeStore.getRoomTypeById(room.roomTypeId),
      ]);
      if (roomRes?.success) editingRoom.value = roomRes.data;
      if (roomTypeRes?.success) editingRoomType.value = roomTypeRes.data;
    } catch {
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail: t("Failed to load room details"),
        life: 3000,
      });
      return;
    } finally {
      loadingRooms.value = false;
    }
  }
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
        summary: t("Error"),
        detail: rtRes?.message ?? t("Failed to save room type"),
        life: 3000,
      });
      return;
    }

    const savedRoomTypeId: number =
      payload.roomTypeId ?? rtRes.data?.roomTypeId ?? rtRes.data?.id;
    const rRes = payload.roomId
      ? await roomStore.updateRoom(payload.roomId, {
          ...payload.roomPayload,
          roomTypeId: savedRoomTypeId,
        })
      : await roomStore.createRoom({
          ...payload.roomPayload,
          roomTypeId: savedRoomTypeId,
        });
    if (!rRes?.success) {
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail: rRes?.message ?? t("Failed to save room"),
        life: 3000,
      });
      return;
    }

    toast.add({
      severity: "success",
      summary: t("Success"),
      detail: payload.roomId
        ? t("Room updated")
        : t("Room & Room Type saved successfully"),
      life: 3000,
    });
    combinedDialogVisible.value = false;
    await Promise.all([fetchRoomTypes(), fetchRooms()]);
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: t("Error"),
      detail: e?.message ?? t("Unexpected error"),
      life: 3000,
    });
  } finally {
    savingRoomType.value = false;
    savingRoom.value = false;
  }
}

function confirmDeleteRoom(room: RoomDto) {
  confirm.require({
    message: t("Delete room {name}?", { name: room.roomNumber }),
    header: t("Delete Room"),
    icon: "pi pi-exclamation-triangle",
    acceptProps: { severity: "danger", label: t("Delete") },
    rejectProps: { severity: "secondary", label: t("Cancel"), outlined: true },
    accept: async () => {
      try {
        const res = await roomStore.deleteRoom(room.roomId);
        if (res?.success) {
          toast.add({
            severity: "success",
            summary: t("Deleted"),
            detail: t("Room deleted"),
            life: 2000,
          });
          await fetchRooms();
        } else {
          toast.add({
            severity: "error",
            summary: t("Error"),
            detail: res?.message ?? t("Failed to delete room"),
            life: 3000,
          });
        }
      } catch {
        toast.add({
          severity: "error",
          summary: t("Error"),
          detail: t("Unexpected error"),
          life: 3000,
        });
      }
    },
  });
}

onMounted(async () => {
  await Promise.all([fetchHotel(), fetchCities()]);
  await Promise.all([fetchRoomTypes(), fetchRooms()]);
});
</script>
