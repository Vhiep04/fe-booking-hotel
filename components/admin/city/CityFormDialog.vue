<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '640px', maxWidth: '95vw' }"
    :header="isEditing ? 'Edit City' : 'Add New City'"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-6 pt-2">
      <!-- Basic Info -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-info-circle" /> Basic Information
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              City Name <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.name"
              placeholder="e.g. Ho Chi Minh City"
              :class="{ 'p-invalid': submitted && !form.name }"
            />
            <small v-if="submitted && !form.name" class="p-error">
              City name is required
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Country <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.country"
              placeholder="e.g. Vietnam"
              :class="{ 'p-invalid': submitted && !form.country }"
            />
            <small v-if="submitted && !form.country" class="p-error">
              Country is required
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Description</label>
            <Textarea
              v-model="form.description"
              rows="3"
              placeholder="Enter a short description..."
              class="w-full resize-none"
            />
          </div>
        </div>
      </div>

      <!-- Coordinates -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-map-marker" /> Coordinates
        </span>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Latitude</label>
            <InputNumber
              v-model="form.latitude"
              placeholder="e.g. 10.8231"
              :minFractionDigits="0"
              :maxFractionDigits="6"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Longitude</label>
            <InputNumber
              v-model="form.longitude"
              placeholder="e.g. 106.6297"
              :minFractionDigits="0"
              :maxFractionDigits="6"
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
              if (f?.type.startsWith('image/')) setFile(f);
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
                @click.stop="
                  primaryPreview = null;
                  primaryFile = null;
                "
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
              if (f) setFile(f);
              (e.target as HTMLInputElement).value = '';
            }
          "
        />
      </div>
    </div>

    <template #footer>
      <div class="pt-4 gap-4 w-full flex justify-end items-center">
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          outlined
          :disabled="saving || uploading"
          @click="emit('hide')"
        />
        <Button
          :label="isEditing ? 'Update City' : 'Add City'"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
          :loading="saving || uploading"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

import type {
  CityDto,
  CreateCityPayload,
  UpdateCityPayload,
} from "~/stores/admin/interfaces/cities";
import { useUploadStore } from "~/stores/admin/uploadImage";

const props = defineProps<{
  modelValue: boolean;
  isEditing: boolean;
  editingCity: CityDto | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "hide"): void;
  (e: "save-create", payload: CreateCityPayload, imageUrl: string): void;
  (
    e: "save-update",
    id: number,
    payload: UpdateCityPayload,
    imageUrl: string,
  ): void;
}>();

const uploadStore = useUploadStore();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const submitted = ref(false);
const uploading = ref(false);
const primaryInput = ref<HTMLInputElement | null>(null);
const primaryPreview = ref<string | null>(null);
const primaryFile = ref<File | null>(null);

const defaultForm = {
  name: "",
  country: "",
  description: "",
  latitude: 0,
  longitude: 0,
};
const form = ref({ ...defaultForm });

const existingImagePublicId = ref<string | null>(null);

watch(
  () => props.editingCity,
  (city) => {
    form.value = city
      ? {
          name: city.name,
          country: city.country,
          description: city.description ?? "",
          latitude: city.latitude ?? 0,
          longitude: city.longitude ?? 0,
        }
      : { ...defaultForm };

    const existingPrimary = city?.images?.find((img) => img.isPrimary);

    // Fix URL cho Unsplash
    let previewUrl = existingPrimary?.imageUrl ?? null;
    if (previewUrl?.includes("unsplash.com") && !previewUrl.includes("?")) {
      previewUrl = `${previewUrl}?w=800&h=400&fit=crop`;
    }
    primaryPreview.value = previewUrl;

    // Lưu publicId để delete nếu user upload ảnh mới
    // Giả sử API trả về publicId trong image object — nếu không có thì bỏ qua phần delete
    existingImagePublicId.value = (existingPrimary as any)?.publicId ?? null;

    primaryFile.value = null;
    submitted.value = false;
  },
  { immediate: true },
);

async function handleSave() {
  submitted.value = true;
  if (!form.value.name || !form.value.country) return;

  let imageUrl = "";

  if (primaryFile.value) {
    uploading.value = true;

    const res = await uploadStore.uploadImage(primaryFile.value, "cities");
    uploading.value = false;

    if (!res?.success || !res.data) return;
    imageUrl = res.data.url;

    if (props.isEditing && existingImagePublicId.value) {
      await uploadStore.deleteImage(existingImagePublicId.value);
    }
  }

  const payload = {
    name: form.value.name,
    country: form.value.country,
    description: form.value.description,
    latitude: form.value.latitude ?? 0,
    longitude: form.value.longitude ?? 0,
  };

  if (props.isEditing && props.editingCity) {
    emit(
      "save-update",
      props.editingCity.cityId,
      payload as UpdateCityPayload,
      imageUrl,
    );
  } else {
    emit("save-create", payload as CreateCityPayload, imageUrl);
  }
}

function toPreview(file: File): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

async function setFile(file: File) {
  primaryFile.value = file;
  primaryPreview.value = await toPreview(file);
}

// async function handleSave() {
//   submitted.value = true;
//   if (!form.value.name || !form.value.country) return;

//   let imageUrl = "";

//   if (primaryFile.value) {
//     uploading.value = true;
//     const res = await uploadStore.uploadImage(primaryFile.value, "cities");
//     uploading.value = false;

//     if (!res?.success || !res.data) return;
//     imageUrl = res.data.url;
//   }

//   const payload = {
//     name: form.value.name,
//     country: form.value.country,
//     description: form.value.description,
//     latitude: form.value.latitude ?? 0,
//     longitude: form.value.longitude ?? 0,
//   };

//   if (props.isEditing && props.editingCity) {
//     emit(
//       "save-update",
//       props.editingCity.cityId,
//       payload as UpdateCityPayload,
//       imageUrl,
//     );
//   } else {
//     emit("save-create", payload as CreateCityPayload, imageUrl);
//   }
// }
</script>
