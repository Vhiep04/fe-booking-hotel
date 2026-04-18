<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '480px', maxWidth: '95vw' }"
    :header="editingRoom ? 'Edit Room' : 'Add Room'"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-5 pt-2">
      <span
        class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
      >
        <i class="pi pi-home" /> Room Details
      </span>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Room Number -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium"
            >Room Number <span class="text-red-500">*</span></label
          >
          <InputText
            v-model="form.roomNumber"
            placeholder="e.g. 101, A-202"
            :class="{ 'p-invalid': submitted && !form.roomNumber }"
          />
          <small v-if="submitted && !form.roomNumber" class="p-error"
            >Room number is required</small
          >
        </div>

        <!-- Room Type -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium"
            >Room Type <span class="text-red-500">*</span></label
          >
          <Dropdown
            v-model="form.roomTypeId"
            :options="roomTypes"
            optionLabel="typeName"
            optionValue="roomTypeId"
            placeholder="Select a type"
            class="w-full"
            :class="{ 'p-invalid': submitted && !form.roomTypeId }"
          >
            <template #option="{ option }">
              <div class="flex flex-col gap-0.5">
                <span class="font-medium">{{ option.typeName }}</span>
                <span class="text-xs text-gray-400"
                  >{{ formatPrice(option.pricePerNight) }}/night ·
                  {{ option.capacity }} guests</span
                >
              </div>
            </template>
          </Dropdown>
          <small v-if="submitted && !form.roomTypeId" class="p-error"
            >Room type is required</small
          >
        </div>

        <!-- Status -->
        <div class="md:col-span-2 flex flex-col gap-1">
          <label class="text-sm font-medium"
            >Status <span class="text-red-500">*</span></label
          >
          <div class="flex flex-wrap gap-2">
            <div
              v-for="s in statusOptions"
              :key="s.value"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer select-none transition-colors text-sm"
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
          <small v-if="submitted && !form.status" class="p-error"
            >Status is required</small
          >
        </div>
      </div>

      <!-- Selected Room Type Info -->
      <div
        v-if="selectedRoomType"
        class="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2"
      >
        <p
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
        >
          Room Type Summary
        </p>
        <div class="flex flex-wrap gap-3 text-sm">
          <span
            class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400"
          >
            <i class="pi pi-users text-xs" />
            {{ selectedRoomType.capacity }} guests
          </span>
          <span
            class="flex items-center gap-1.5 text-green-600 dark:text-green-400"
          >
            <i class="pi pi-tag text-xs" />
            {{ formatPrice(selectedRoomType.pricePerNight) }}/night
          </span>
          <span
            v-if="selectedRoomType.facilities?.length"
            class="flex items-center gap-1.5 text-purple-600 dark:text-purple-400"
          >
            <i class="pi pi-star text-xs" />
            {{ selectedRoomType.facilities.map((f) => f.name).join(", ") }}
          </span>
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
        :label="editingRoom ? 'Update Room' : 'Add Room'"
        :icon="editingRoom ? 'pi pi-check' : 'pi pi-plus'"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import type { RoomDto, RoomPayload } from "~/stores/admin/interfaces/rooms";
import type { RoomTypeDto } from "~/stores/admin/interfaces/room-type";

const props = defineProps<{
  modelValue: boolean;
  editingRoom: RoomDto | null;
  hotelId: number;
  roomTypes: RoomTypeDto[];
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "hide"): void;
  (e: "save", payload: RoomPayload, id?: number): void;
}>();

const submitted = ref(false);

const statusOptions = [
  { value: "Available", label: "Available", dotClass: "bg-green-500" },
  { value: "Occupied", label: "Occupied", dotClass: "bg-red-500" },
  { value: "Maintenance", label: "Maintenance", dotClass: "bg-yellow-500" },
  { value: "Reserved", label: "Reserved", dotClass: "bg-blue-500" },
];

const defaultForm: RoomPayload = {
  hotelId: props.hotelId,
  roomTypeId: 0,
  roomNumber: "",
  status: "Available",
};

const form = ref<RoomPayload>({ ...defaultForm });

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const selectedRoomType = computed(
  () =>
    props.roomTypes.find((rt) => rt.roomTypeId === form.value.roomTypeId) ??
    null,
);

watch(
  () => props.editingRoom,
  (room) => {
    if (room) {
      form.value = {
        hotelId: props.hotelId,
        roomTypeId: room.roomTypeId,
        roomNumber: room.roomNumber,
        status: room.status,
      };
    } else {
      form.value = { ...defaultForm, hotelId: props.hotelId };
    }
    submitted.value = false;
  },
  { immediate: true },
);

function handleSave() {
  submitted.value = true;
  if (!form.value.roomNumber || !form.value.roomTypeId || !form.value.status)
    return;
  emit("save", { ...form.value }, props.editingRoom?.roomId);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
</script>
