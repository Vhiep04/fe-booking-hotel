<template>
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
        @drop.prevent="onDropPrimary"
      >
        <template v-if="primaryPreview">
          <img :src="primaryPreview" class="w-full h-full object-cover" />
          <div
            class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
          >
            <button
              class="text-white text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-1.5 rounded-lg border border-white/40 transition-colors"
              @click.stop="$emit('removePrimary')"
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
        @change="onPrimaryInputChange"
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
          {{ galleryPreviews.length }} / {{ maxGallery }}
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
          <Image
            preview
            :src="img"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <button
            class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/90 text-white text-[0.55rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            @click="$emit('removeGalleryItem', i)"
          >
            <i class="pi pi-times" />
          </button>
        </div>
        <div
          v-if="galleryPreviews.length < maxGallery"
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
        @drop.prevent="onDropGallery"
      >
        <div
          class="flex flex-col items-center justify-center py-8 gap-2 text-(--admin-text-muted)"
        >
          <i class="pi pi-images text-2xl" />
          <p class="text-sm font-medium">
            Drop images or
            <span class="text-(--admin-primary) font-semibold">browse</span>
          </p>
          <p class="text-xs">Up to {{ maxGallery }} images</p>
        </div>
      </div>
      <input
        ref="galleryInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="onGalleryInputChange"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <Button
        label="Save Changes"
        icon="pi pi-check"
        :loading="saving"
        @click="$emit('save')"
      />
      <Button
        label="Reset"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        @click="$emit('reset')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import type { HotelPayload } from "~/stores/admin/interfaces/hotels";
import { Image } from "primevue";

const props = defineProps<{
  form: HotelPayload;
  submitted: boolean;
  saving: boolean;
  cities: { cityId: number; name: string }[];
  primaryPreview: string | null;
  galleryPreviews: string[];
  maxGallery: number;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "reset"): void;
  (e: "removePrimary"): void;
  (e: "removeGalleryItem", index: number): void;
  (e: "setPrimaryFile", file: File): void;
  (e: "addGalleryFiles", files: File[]): void;
}>();

const primaryInput = ref<HTMLInputElement | null>(null);
const galleryInput = ref<HTMLInputElement | null>(null);

function onDropPrimary(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0];
  if (f?.type.startsWith("image/")) emit("setPrimaryFile", f);
}

function onPrimaryInputChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) emit("setPrimaryFile", f);
  (e.target as HTMLInputElement).value = "";
}

function onDropGallery(e: DragEvent) {
  emit("addGalleryFiles", Array.from(e.dataTransfer?.files ?? []));
}

function onGalleryInputChange(e: Event) {
  emit(
    "addGalleryFiles",
    Array.from((e.target as HTMLInputElement).files ?? []),
  );
  (e.target as HTMLInputElement).value = "";
}
</script>
