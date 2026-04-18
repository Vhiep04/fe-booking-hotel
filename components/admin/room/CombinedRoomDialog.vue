<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '560px', maxWidth: '95vw' }"
    :header="isEditing ? 'Edit Room' : 'Add Room'"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-6 pt-2">
      <!-- ── Section: Room Type ── -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-tag" /> Room Type Information
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Type Name -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Type Name <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.typeName"
              placeholder="e.g. Deluxe, Suite"
              :class="{ 'p-invalid': submitted && !form.typeName }"
            />
            <small v-if="submitted && !form.typeName" class="p-error">
              Type name is required
            </small>
          </div>

          <!-- Capacity -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Capacity <span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="form.capacity"
              placeholder="e.g. 2"
              :min="1"
              :max="20"
              class="w-full"
              :class="{ 'p-invalid': submitted && !form.capacity }"
            />
            <small v-if="submitted && !form.capacity" class="p-error">
              Capacity is required
            </small>
          </div>

          <!-- Price Per Night -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Price / Night <span class="text-red-500">*</span>
            </label>
            <InputNumber
              v-model="form.pricePerNight"
              placeholder="e.g. 500000"
              :min="0"
              mode="currency"
              currency="VND"
              locale="vi-VN"
              class="w-full"
              :class="{ 'p-invalid': submitted && !form.pricePerNight }"
            />
            <small v-if="submitted && !form.pricePerNight" class="p-error">
              Price is required
            </small>
          </div>

          <!-- Room Count -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Room Count</label>
            <InputNumber
              v-model="form.roomCount"
              placeholder="e.g. 10"
              :min="0"
              class="w-full"
            />
          </div>

          <!-- Description -->
          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">Description</label>
            <Textarea
              v-model="form.description"
              rows="2"
              placeholder="Enter room type description"
              class="resize-none"
            />
          </div>

          <!-- Facilities -->
          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">Facilities</label>
            <MultiSelect
              v-model="form.facilityIds"
              :options="facilities"
              optionLabel="name"
              optionValue="facilityId"
              placeholder="Select facilities"
              class="w-full"
              display="chip"
            />
          </div>
        </div>
      </div>

      <Divider />

      <!-- ── Section: Individual Room ── -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-home" /> Room Details
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Room Number -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Room Number <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.roomNumber"
              placeholder="e.g. 101, A-202"
              :class="{ 'p-invalid': submitted && !form.roomNumber }"
            />
            <small v-if="submitted && !form.roomNumber" class="p-error">
              Room number is required
            </small>
          </div>

          <!-- Status -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Status</label>
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
        :label="isEditing ? 'Update' : 'Create'"
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
import MultiSelect from "primevue/multiselect";
import Divider from "primevue/divider";
import Button from "primevue/button";
import type { RoomDto, RoomPayload } from "~/stores/admin/interfaces/rooms";
import type {
  RoomTypeDto,
  RoomTypePayload,
} from "~/stores/admin/interfaces/room-type";

export interface CombinedFormData {
  // RoomType fields
  typeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  roomCount: number;
  facilityIds: number[];
  // Room fields
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
  /** Pass when editing an existing room (+ its room type) */
  editingRoom?: RoomDto | null;
  editingRoomType?: RoomTypeDto | null;
  /** For MultiSelect */
  facilities?: { facilityId: number; name: string }[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "hide"): void;
  (e: "save", payload: CombinedSavePayload): void;
}>();

const submitted = ref(false);

const statusOptions = [
  { value: "Available", label: "Available", dotClass: "bg-green-500" },
  { value: "Occupied", label: "Occupied", dotClass: "bg-red-500" },
  { value: "Maintenance", label: "Maintenance", dotClass: "bg-yellow-500" },
  { value: "Reserved", label: "Reserved", dotClass: "bg-blue-500" },
];

const defaultForm = (): CombinedFormData => ({
  typeName: "",
  description: "",
  pricePerNight: 0,
  capacity: 1,
  roomCount: 1,
  facilityIds: [],
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

// Populate form when editing
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
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
          roomNumber: r?.roomNumber ?? "",
          status: r?.status ?? "Available",
        };
      } else {
        form.value = defaultForm();
      }
      submitted.value = false;
    }
  },
  { immediate: true },
);

function handleSave() {
  submitted.value = true;
  if (
    !form.value.typeName ||
    !form.value.capacity ||
    !form.value.pricePerNight ||
    !form.value.roomNumber
  )
    return;

  const roomTypePayload: RoomTypePayload = {
    hotelId: props.hotelId,
    typeName: form.value.typeName,
    description: form.value.description,
    pricePerNight: form.value.pricePerNight,
    capacity: form.value.capacity,
    roomCount: form.value.roomCount,
    facilityIds: form.value.facilityIds,
  };

  const roomPayload: RoomPayload = {
    hotelId: props.hotelId,
    roomTypeId: props.editingRoomType?.roomTypeId ?? 0, // will be replaced by parent after roomType is saved
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
</script>
