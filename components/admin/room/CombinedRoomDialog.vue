<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '560px', maxWidth: '95vw' }"
    :header="isEditing ? t('Edit Room') : t('Add Room')"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-6 pt-2">
      <!-- Room Type Section -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-tag" /> {{ t("Room Type Information") }}
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Type Name") }} <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.typeName"
              :placeholder="t('e.g. Deluxe, Suite')"
              :class="{ 'p-invalid': submitted && !form.typeName }"
            />
            <small v-if="submitted && !form.typeName" class="p-error">
              {{ t("Type name is required") }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Capacity") }} <span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="form.capacity"
              :placeholder="t('e.g. 2')"
              :min="1"
              :max="20"
              class="w-full"
              :class="{ 'p-invalid': submitted && !form.capacity }"
            />
            <small v-if="submitted && !form.capacity" class="p-error">
              {{ t("Capacity is required") }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Price / Night") }} <span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="form.pricePerNight"
              :placeholder="t('e.g. 500000')"
              :min="0"
              mode="currency"
              currency="VND"
              locale="vi-VN"
              class="w-full"
              :class="{ 'p-invalid': submitted && !form.pricePerNight }"
            />
            <small v-if="submitted && !form.pricePerNight" class="p-error">
              {{ t("Price is required") }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">{{ t("Room Count") }}</label>
            <InputNumber
              v-model="form.roomCount"
              :placeholder="t('e.g. 10')"
              :min="0"
              class="w-full"
            />
          </div>

          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">{{ t("Description") }}</label>
            <Textarea
              v-model="form.description"
              rows="2"
              :placeholder="t('Enter room type description')"
              class="resize-none"
            />
          </div>

          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">{{ t("Facilities") }}</label>
            <MultiSelect
              v-model="form.facilityIds"
              :options="translatedFacilities"
              optionLabel="name"
              optionValue="facilityId"
              :placeholder="t('Select facilities')"
              class="w-full"
              display="chip"
            />
          </div>
        </div>
      </div>

      <Divider />

      <!-- Room Details Section -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-home" /> {{ t("Room Details") }}
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Room Number") }} <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.roomNumber"
              :placeholder="t('e.g. 101, A-202')"
              :class="{ 'p-invalid': submitted && !form.roomNumber }"
            />
            <small v-if="submitted && !form.roomNumber" class="p-error">
              {{ t("Room number is required") }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">{{ t("Status") }}</label>
            <div class="flex flex-wrap gap-2 pt-1">
              <div
                v-for="s in statusOptions"
                :key="s.value"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer select-none transition-colors text-sm"
                :class="
                  form.status === s.value
                    ? 'border-(--admin-primary) bg-(--admin-primary-light) text-(--admin-primary) font-medium'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                "
                @click="form.status = s.value"
              >
                <span :class="s.dotClass" class="w-2 h-2 rounded-full" />
                {{ s.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 flex flex-col gap-1">
          <label class="text-sm font-medium">{{ t("Room Image") }}</label>
          <div
            v-if="roomTypePreview"
            class="relative w-full h-40 rounded-lg overflow-hidden border"
          >
            <img :src="roomTypePreview" class="w-full h-full object-cover" />
            <button
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              @click="removeRoomTypeImage"
            >
              <i class="pi pi-times text-xs" />
            </button>
          </div>
          <div
            v-else
            class="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            @click="triggerRoomTypeFileInput"
          >
            <i class="pi pi-image text-2xl text-gray-400 mb-2" />
            <span class="text-sm text-gray-400">{{
              t("Click to upload image")
            }}</span>
          </div>
          <input
            ref="roomTypeFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onRoomTypeFileChange"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="t('Cancel')"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="saving"
        @click="emit('hide')"
      />
      <Button
        :label="isEditing ? t('Update') : t('Create')"
        :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import MultiSelect from "primevue/multiselect";
import Divider from "primevue/divider";
import Button from "primevue/button";
import { useUploadStore } from "~/stores/admin/uploadImage";
import type { RoomDto, RoomPayload } from "~/stores/admin/interfaces/rooms";
import type {
  RoomTypeDto,
  RoomTypePayload,
} from "~/stores/admin/interfaces/room-type";
import { storeToRefs } from "pinia";

export interface CombinedFormData {
  typeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  roomCount: number;
  facilityIds: number[];
  imgUrl: string;
  roomNumber: string;
  status: string;
}

export interface CombinedSavePayload {
  roomTypePayload: RoomTypePayload;
  roomPayload: RoomPayload;
  roomTypeId?: number;
  roomId?: number;
}

const props = defineProps<{
  modelValue: boolean;
  hotelId: number;
  saving: boolean;
  editingRoom?: RoomDto | null;
  editingRoomType?: RoomTypeDto | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "hide"): void;
  (e: "save", payload: CombinedSavePayload): void;
}>();

const { t } = useI18n();
const { translateFacility } = useFacilityTranslation();

const uploadStore = useUploadStore();
const submitted = ref(false);
const uploadingImage = ref(false);

const facilityStore = useFacilityStore();
const { facilities } = storeToRefs(facilityStore);

const roomTypeFileInput = ref<HTMLInputElement | null>(null);
const roomTypePreview = ref<string | null>(null);
const roomTypeFile = ref<File | null>(null);
const oldImgUrl = ref<string | null>(null);

const statusOptions = computed(() => [
  { value: "Available", label: t("Available"), dotClass: "bg-green-500" },
  { value: "Occupied", label: t("Occupied"), dotClass: "bg-red-500" },
  { value: "Maintenance", label: t("Maintenance"), dotClass: "bg-yellow-500" },
  { value: "Reserved", label: t("Reserved"), dotClass: "bg-blue-500" },
]);

const translatedFacilities = computed(() =>
  (facilities.value ?? []).map((f) => ({
    ...f,
    name: translateFacility(f.name),
  })),
);

const defaultForm = (): CombinedFormData => ({
  typeName: "",
  description: "",
  pricePerNight: 0,
  capacity: 1,
  roomCount: 1,
  facilityIds: [],
  imgUrl: "",
  roomNumber: "",
  status: "Available",
});

const form = ref<CombinedFormData>(defaultForm());

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEditing = computed(
  () => !!props.editingRoom || !!props.editingRoomType,
);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      facilityStore.getFacilities();
      roomTypeFile.value = null;
      if (props.editingRoomType || props.editingRoom) {
        const rt = props.editingRoomType;
        const r = props.editingRoom;
        form.value = {
          typeName: rt?.typeName ?? "",
          description: rt?.description ?? "",
          pricePerNight: rt?.pricePerNight ?? 0,
          capacity: rt?.capacity ?? 1,
          roomCount: rt?.roomCount ?? 1,
          facilityIds: rt?.facilities?.map((f) => f.facilityId) ?? [],
          imgUrl: rt?.imgUrl ?? "",
          roomNumber: r?.roomNumber ?? "",
          status: r?.status ?? "Available",
        };
        oldImgUrl.value = rt?.imgUrl ?? null;
        roomTypePreview.value = rt?.imgUrl ?? null;
      } else {
        form.value = defaultForm();
        oldImgUrl.value = null;
        roomTypePreview.value = null;
      }
      submitted.value = false;
    }
  },
  { immediate: true },
);

function triggerRoomTypeFileInput() {
  roomTypeFileInput.value?.click();
}

async function onRoomTypeFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  roomTypeFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    roomTypePreview.value = ev.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function removeRoomTypeImage() {
  roomTypeFile.value = null;
  roomTypePreview.value = null;
  form.value.imgUrl = "";
}

async function handleSave() {
  submitted.value = true;
  if (
    !form.value.typeName ||
    !form.value.capacity ||
    !form.value.pricePerNight ||
    !form.value.roomNumber
  )
    return;

  let finalImgUrl = form.value.imgUrl;
  if (roomTypeFile.value) {
    uploadingImage.value = true;
    try {
      if (isEditing.value && oldImgUrl.value) {
        const publicId = extractCloudinaryPublicId(oldImgUrl.value);
        if (publicId) await uploadStore.deleteImage(publicId);
      }
      const up = await uploadStore.uploadImage(
        roomTypeFile.value,
        "room-types",
      );
      if (up?.success && up.data) finalImgUrl = up.data.url;
    } finally {
      uploadingImage.value = false;
    }
  }

  const roomTypePayload: RoomTypePayload = {
    hotelId: props.hotelId,
    typeName: form.value.typeName,
    description: form.value.description,
    pricePerNight: form.value.pricePerNight,
    capacity: form.value.capacity,
    imgUrl: finalImgUrl,
    facilityIds: form.value.facilityIds,
  };

  const roomPayload: RoomPayload = {
    hotelId: props.hotelId,
    roomTypeId: props.editingRoomType?.roomTypeId ?? 0,
    roomNumber: form.value.roomNumber,
    status: form.value.status,
  };

  emit("save", {
    roomTypePayload,
    roomPayload,
    roomTypeId: props.editingRoomType?.roomTypeId,
    roomId: props.editingRoom?.roomId,
  });
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
