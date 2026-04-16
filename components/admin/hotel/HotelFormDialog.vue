<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '640px', maxWidth: '95vw' }"
    :header="isEditing ? 'Edit Hotel' : 'Add New Hotel'"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-6 pt-2">
      <!-- Basic Information -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-building" /> Basic Information
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              Hotel Name <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.name"
              placeholder="e.g. Hanoi Hilton"
              :class="{ 'p-invalid': submitted && !form.name }"
            />
            <small v-if="submitted && !form.name" class="p-error">
              Hotel name is required
            </small>
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

      <!-- Location -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-map-marker" /> Location
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              City <span class="text-red-500">*</span>
            </label>
            <Dropdown
              v-model="form.cityId"
              :options="cities"
              optionLabel="name"
              optionValue="cityId"
              placeholder="Select a city"
              class="w-full"
              :class="{ 'p-invalid': submitted && !form.cityId }"
            />
            <small v-if="submitted && !form.cityId" class="p-error">
              City is required
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Address <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.location"
              placeholder="e.g. 123 Ba Dinh St"
              :class="{ 'p-invalid': submitted && !form.location }"
            />
            <small v-if="submitted && !form.location" class="p-error">
              Address is required
            </small>
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

      <!-- Primary Image -->
      <div class="flex flex-col gap-3">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-image" /> Primary Image
        </span>

        <div
          class="relative h-44 rounded-xl border-2 border-dashed border-(--admin-surface-border) overflow-hidden cursor-pointer transition-colors hover:border-(--admin-primary) hover:bg-(--admin-primary-light)"
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
            <img :src="primaryPreview" class="w-full h-full object-cover" />
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
                <span class="text-(--admin-primary) font-semibold">browse</span>
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
            (e) => addGalleryFiles(Array.from(e.dataTransfer?.files ?? []))
          "
        >
          <div
            class="flex flex-col items-center justify-center py-8 gap-2 text-(--admin-text-muted)"
          >
            <i class="pi pi-images text-2xl" />
            <p class="text-sm font-medium">
              Drop images or
              <span class="text-(--admin-primary) font-semibold">browse</span>
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
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="saving || uploading"
        @click="emit('hide')"
      />
      <Button
        :label="isEditing ? 'Update Hotel' : 'Add Hotel'"
        :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
        :loading="saving || uploading"
        @click="handleSave"
      />
    </template>
  </Dialog>
  <Toast />
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import { useAdminHotelStore } from "~/stores/admin/hotels";
import type { Hotel, HotelPayload } from "~/stores/admin/interfaces/hotels";
import { useUploadStore } from "~/stores/admin/uploadImage";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const toast = useToast();

const MAX_GALLERY = 3;

interface CityOption {
  cityId: number;
  name: string;
}

const props = defineProps<{
  modelValue: boolean;
  isEditing: boolean;
  editingHotel: Hotel | null;
  cities: CityOption[];
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "hide"): void;
  (e: "save-create", payload: HotelPayload): void;
  (e: "save-update", id: number, payload: HotelPayload): void;
  (e: "saved"): void;
}>();

const uploadStore = useUploadStore();
const hotelStore = useAdminHotelStore();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const submitted = ref(false);
const uploading = ref(false);

const primaryInput = ref<HTMLInputElement | null>(null);
const primaryPreview = ref<string | null>(null);
const primaryFile = ref<File | null>(null);

const galleryInput = ref<HTMLInputElement | null>(null);
const galleryPreviews = ref<string[]>([]);
const galleryFiles = ref<File[]>([]);

const defaultForm: HotelPayload = {
  cityId: 0,
  name: "",
  location: "",
  description: "",
  imgUrl: "",
  latitude: 0,
  longitude: 0,
};

const form = ref<HotelPayload>({ ...defaultForm });

watch(
  () => props.editingHotel,
  (hotel) => {
    form.value = hotel
      ? {
          cityId: hotel.cityId,
          name: hotel.name,
          location: hotel.location,
          description: hotel.description ?? "",
          imgUrl: hotel.imgUrl ?? "",
          latitude: hotel.latitude ?? 0,
          longitude: hotel.longitude ?? 0,
        }
      : { ...defaultForm };

    const existingPrimary = hotel?.images?.find((img) => img.isPrimary);
    primaryPreview.value = existingPrimary?.imageUrl ?? hotel?.imgUrl ?? null;
    primaryFile.value = null;

    const galleryImages = hotel?.images?.filter((img) => !img.isPrimary) ?? [];
    galleryPreviews.value = galleryImages.map((img) => img.imageUrl);
    galleryFiles.value = [];

    submitted.value = false;
  },
  { immediate: true },
);

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

function removeGalleryItem(index: number) {
  galleryFiles.value.splice(index, 1);
  galleryPreviews.value.splice(index, 1);
}

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

  if (form.value.latitude < -90 || form.value.latitude > 90) {
    toast.add({
      severity: "warn",
      summary: "Invalid Latitude",
      detail: "Latitude must be between -90 and 90",
      life: 3000,
    });
    return;
  }

  if (form.value.longitude < -180 || form.value.longitude > 180) {
    toast.add({
      severity: "warn",
      summary: "Invalid Longitude",
      detail: "Longitude must be between -180 and 180",
      life: 3000,
    });
    return;
  }

  uploading.value = true;

  try {
    let hotelId: number;

    if (props.isEditing && props.editingHotel) {
      const res = await hotelStore.updateHotel(
        props.editingHotel.hotelId,
        form.value,
      );
      if (!res?.success) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: res?.message ?? "Failed to update hotel",
          life: 3000,
        });
        return;
      }
      hotelId = props.editingHotel.hotelId;
      await hotelStore.fetchHotels();
    } else {
      const res = await hotelStore.createHotel(form.value);
      if (!res?.success || !res.data) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: res?.message ?? "Failed to create hotel",
          life: 3000,
        });
        return;
      }
      hotelId = res.data.hotelId;
    }

    if (primaryFile.value) {
      const uploadRes = await uploadStore.uploadImage(
        primaryFile.value,
        "hotels",
      );
      if (uploadRes?.success && uploadRes.data) {
        await hotelStore.addHotelImage(hotelId, {
          imageUrl: uploadRes.data.url,
          isPrimary: true,
          displayOrder: 0,
          description: "",
        });
      } else {
        toast.add({
          severity: "warn",
          summary: "Warning",
          detail: "Hotel saved but primary image upload failed",
          life: 3000,
        });
      }
    }

    if (galleryFiles.value.length > 0) {
      const uploadRes = await uploadStore.uploadImages(
        galleryFiles.value,
        "hotels",
      );
      if (uploadRes?.success && uploadRes.data?.uploaded?.length) {
        const imageUrls = uploadRes.data.uploaded.map((img) => img.url);
        await hotelStore.bulkAddHotelImages(hotelId, imageUrls);
      } else {
        toast.add({
          severity: "warn",
          summary: "Warning",
          detail: "Hotel saved but some gallery images failed to upload",
          life: 3000,
        });
      }
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: props.isEditing
        ? "Hotel updated successfully"
        : "Hotel created successfully",
      life: 3000,
    });

    emit("saved");
    emit("update:modelValue", false);
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e?.message ?? "An unexpected error occurred",
      life: 3000,
    });
  } finally {
    uploading.value = false;
  }
}
</script>
