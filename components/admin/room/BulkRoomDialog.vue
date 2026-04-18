<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '520px', maxWidth: '95vw' }"
    header="Bulk Add Rooms"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-5 pt-2">
      <span
        class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
      >
        <i class="pi pi-copy" /> Bulk Room Creation
      </span>

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

      <!-- Default Status -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Default Status</label>
        <div class="flex flex-wrap gap-2">
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

      <!-- Room Numbers Input -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium"
          >Room Numbers <span class="text-red-500">*</span></label
        >
        <p class="text-xs text-gray-400 dark:text-gray-500">
          Enter room numbers separated by commas, spaces, or newlines. Use
          ranges like "101-105" to add multiple rooms at once.
        </p>
        <Textarea
          v-model="roomNumbersRaw"
          rows="4"
          placeholder="e.g. 101, 102, 103&#10;or 101-105&#10;or A101 A102 A103"
          class="resize-none font-mono text-sm"
          :class="{ 'p-invalid': submitted && parsedRoomNumbers.length === 0 }"
          @input="parseRoomNumbers"
        />
        <small
          v-if="submitted && parsedRoomNumbers.length === 0"
          class="p-error"
          >At least one room number is required</small
        >
      </div>

      <!-- Preview -->
      <div v-if="parsedRoomNumbers.length > 0" class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
            <span class="text-xs font-normal text-gray-400"
              >({{ parsedRoomNumbers.length }} rooms)</span
            >
          </label>
          <button
            class="text-xs text-red-500 hover:text-red-700"
            @click="clearAll"
          >
            Clear all
          </button>
        </div>
        <div
          class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <span
            v-for="(num, i) in parsedRoomNumbers"
            :key="i"
            class="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-0.5 text-xs font-mono"
          >
            {{ num }}
            <button
              class="text-gray-400 hover:text-red-500 ml-0.5"
              @click="removeNumber(i)"
            >
              <i class="pi pi-times text-[0.55rem]" />
            </button>
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
        :label="`Add ${parsedRoomNumbers.length || ''} Rooms`"
        icon="pi pi-copy"
        :loading="saving"
        :disabled="parsedRoomNumbers.length === 0"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import type { BulkCreateRoomPayload } from "~/stores/admin/interfaces/rooms";
import type { RoomTypeDto } from "~/stores/admin/interfaces/room-type";

const props = defineProps<{
  modelValue: boolean;
  hotelId: number;
  roomTypes: RoomTypeDto[];
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "hide"): void;
  (e: "save", payload: BulkCreateRoomPayload): void;
}>();

const submitted = ref(false);
const roomNumbersRaw = ref("");
const parsedRoomNumbers = ref<string[]>([]);

const statusOptions = [
  { value: "Available", label: "Available", dotClass: "bg-green-500" },
  { value: "Occupied", label: "Occupied", dotClass: "bg-red-500" },
  { value: "Maintenance", label: "Maintenance", dotClass: "bg-yellow-500" },
  { value: "Reserved", label: "Reserved", dotClass: "bg-blue-500" },
];

const form = ref({
  roomTypeId: 0,
  status: "Available",
});

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

watch(visible, (val) => {
  if (val) {
    form.value = { roomTypeId: 0, status: "Available" };
    roomNumbersRaw.value = "";
    parsedRoomNumbers.value = [];
    submitted.value = false;
  }
});

function expandRange(part: string): string[] {
  // Handle ranges like "101-105" or "A101-A105"
  const rangeMatch = part.match(/^([A-Za-z]*)(\d+)-([A-Za-z]*)(\d+)$/);
  if (rangeMatch) {
    const [, prefixA, startStr, prefixB, endStr] = rangeMatch;
    const prefix = prefixA || prefixB || "";
    const start = parseInt(startStr ?? "");
    const end = parseInt(endStr ?? "");
    if (start <= end && end - start <= 100) {
      return Array.from(
        { length: end - start + 1 },
        (_, i) => `${prefix}${start + i}`,
      );
    }
  }
  return [part];
}

function parseRoomNumbers() {
  const raw = roomNumbersRaw.value;
  const parts = raw
    .split(/[\s,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const expanded: string[] = [];
  for (const part of parts) {
    expanded.push(...expandRange(part));
  }

  // Deduplicate
  parsedRoomNumbers.value = [...new Set(expanded)];
}

function removeNumber(index: number) {
  parsedRoomNumbers.value.splice(index, 1);
  roomNumbersRaw.value = parsedRoomNumbers.value.join(", ");
}

function clearAll() {
  parsedRoomNumbers.value = [];
  roomNumbersRaw.value = "";
}

function handleSave() {
  submitted.value = true;
  if (!form.value.roomTypeId || parsedRoomNumbers.value.length === 0) return;

  emit("save", {
    hotelId: props.hotelId,
    roomTypeId: form.value.roomTypeId,
    roomNumbers: parsedRoomNumbers.value,
    status: form.value.status,
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
</script>
