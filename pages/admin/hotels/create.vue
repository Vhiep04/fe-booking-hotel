<template>
  <div class="admin-layout">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="admin-page-title">{{ t("Add New Hotel") }}</h1>
        <p class="admin-page-subtitle">
          {{ t("Fill in hotel information to create") }}
        </p>
      </div>
      <Button
        :label="t('Back')"
        icon="pi pi-arrow-left"
        severity="secondary"
        @click="navigateTo('/admin/hotels')"
      />
    </div>

    <div class="card">
      <HotelBasicInfoTab
        :form="form"
        :submitted="submitted"
        :saving="saving"
        :cities="cities"
        :primary-preview="primaryPreview"
        :gallery-previews="galleryPreviews"
        :max-gallery="MAX_GALLERY"
        @save="handleCreate"
        @reset="resetForm"
        @remove-primary="removePrimary"
        @remove-gallery-item="removeGalleryItem"
        @set-primary-file="setPrimaryFile"
        @add-gallery-files="addGalleryFiles"
      />
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import HotelBasicInfoTab from "~/components/admin/hotel/HotelBasicInfoTab.vue";
import { useAdminHotelStore } from "~/stores/admin/hotels";
import { useCitiesStore } from "~/stores/admin/cities";
import { useUploadStore } from "~/stores/admin/uploadImage";
import type { HotelPayload } from "~/stores/admin/interfaces/hotels";

definePageMeta({ layout: "admin", middleware: ["admin"] });

const { t } = useI18n();
const toast = useToast();
const hotelStore = useAdminHotelStore();
const citiesStore = useCitiesStore();
const uploadStore = useUploadStore();

const saving = ref(false);
const submitted = ref(false);
const MAX_GALLERY = 4;
const galleryPreviews = ref<string[]>([]);
const galleryFiles = ref<File[]>([]);
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
const cities = ref<{ cityId: number; name: string }[]>([]);

onMounted(async () => {
  await fetchCities();
});

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
  form.value.imgUrl = "";
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
  form.value = {
    cityId: 0,
    name: "",
    location: "",
    description: "",
    imgUrl: "",
    latitude: 0,
    longitude: 0,
  };
  primaryPreview.value = null;
  primaryFile.value = null;
  submitted.value = false;
}

async function handleCreate() {
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
    if (primaryFile.value) {
      const up = await uploadStore.uploadImage(primaryFile.value, "hotels");
      if (up?.success && up.data) {
        form.value.imgUrl = up.data.url;
      } else {
        toast.add({
          severity: "error",
          summary: t("Error"),
          detail: t("Failed to upload primary image"),
          life: 3000,
        });
        return;
      }
    }
    const res = await hotelStore.createHotel(form.value);
    if (!res?.success) {
      if (form.value.imgUrl) {
        const publicId = extractCloudinaryPublicId(form.value.imgUrl);
        if (publicId) await uploadStore.deleteImage(publicId);
        form.value.imgUrl = "";
      }
      toast.add({
        severity: "error",
        summary: t("Error"),
        detail: res?.message ?? t("Failed to create hotel"),
        life: 3000,
      });
      return;
    }
    const newHotelId = res.data.hotelId;
    if (galleryFiles.value.length) {
      const up = await uploadStore.uploadImages(galleryFiles.value, "hotels");
      if (up?.success && up.data?.uploaded?.length)
        await hotelStore.bulkAddHotelImages(
          newHotelId,
          up.data.uploaded.map((img: any) => img.url),
        );
    }
    toast.add({
      severity: "success",
      summary: t("Success"),
      detail: t("Hotel created successfully!"),
      life: 2000,
    });
    setTimeout(() => navigateTo(`/admin/hotels/${newHotelId}?tab=1`), 500);
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

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
</script>
