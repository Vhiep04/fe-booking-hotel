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
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Media -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-image" /> Media
        </span>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Image URL</label>
          <InputText
            v-model="form.imgUrl"
            placeholder="https://example.com/hotel.jpg"
          />
          <div v-if="form.imgUrl" class="mt-2">
            <img
              :src="form.imgUrl"
              alt="Preview"
              class="w-full h-36 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="saving"
        @click="emit('hide')"
      />
      <Button
        :label="isEditing ? 'Update Hotel' : 'Add Hotel'"
        :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import type { Hotel, HotelPayload } from "~/stores/admin/interfaces/hotels";

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
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const submitted = ref(false);

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
    submitted.value = false;
  },
  { immediate: true },
);

function handleSave() {
  submitted.value = true;
  if (!form.value.name || !form.value.cityId || !form.value.location) return;

  if (props.isEditing && props.editingHotel) {
    emit("save-update", props.editingHotel.hotelId, { ...form.value });
  } else {
    emit("save-create", { ...form.value });
  }
}
</script>
