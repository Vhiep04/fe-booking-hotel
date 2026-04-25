<template>
  <Dialog
    v-model:visible="visible"
    :header="t('Room Details')"
    modal
    :style="{ width: '500px' }"
  >
    <div v-if="room" class="space-y-4">
      <div class="flex items-center gap-4">
        <img
          v-if="room.imgUrl"
          :src="room.imgUrl"
          :alt="room.roomType"
          class="w-20 h-20 rounded-lg object-cover"
        />
        <div
          v-else
          class="w-20 h-20 rounded-lg bg-(--admin-surface-hover) flex items-center justify-center"
        >
          <i class="pi pi-th-large text-3xl text-(--admin-primary)" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-(--admin-text-color)">
            {{ t("Room") }} {{ room.roomNumber }}
          </h3>
          <p class="text-(--admin-text-muted)">{{ room.hotelName }}</p>
          <div class="flex items-center gap-2 mt-1">
            <Tag
              :value="room.roomType"
              :severity="getRoomTypeSeverity(room.roomType)"
            />
            <Tag
              :value="t(room.status)"
              :severity="getStatusSeverity(room.status)"
            />
          </div>
        </div>
      </div>

      <Divider />

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-(--admin-text-muted)">
            {{ t("Capacity") }}
          </p>
          <p class="font-medium text-(--admin-text-color)">
            {{ room.capacity }} {{ t("guests") }}
          </p>
        </div>
        <div>
          <p class="text-sm text-(--admin-text-muted)">
            {{ t("Price per Night") }}
          </p>
          <p class="font-bold text-green-600 text-lg">
            {{ formatPrice(room.pricePerNight) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-(--admin-text-muted)">
            {{ t("Room ID") }}
          </p>
          <p class="font-medium text-(--admin-text-color)">
            #{{ room.roomId }}
          </p>
        </div>
        <div>
          <p class="text-sm text-(--admin-text-muted)">{{ t("Hotel") }}</p>
          <p class="font-medium text-(--admin-text-color)">
            {{ room.hotelName }}
          </p>
        </div>
      </div>

      <div v-if="room.facilities?.length">
        <p class="text-sm text-(--admin-text-muted) mb-2">
          {{ t("Facilities") }}
        </p>
        <div class="flex flex-wrap gap-2">
          <Tag
            v-for="facility in room.facilities"
            :key="facility.facilityId"
            severity="info"
          >
            {{ facility.name }}
          </Tag>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="t('Edit')"
        icon="pi pi-pencil"
        severity="secondary"
        outlined
        @click="emit('edit', room!)"
      />
      <Button :label="t('Close')" @click="emit('update:modelValue', false)" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Button from "primevue/button";
import Tag from "primevue/tag";
import type { RoomDto } from "~/stores/admin/interfaces/rooms";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  room: RoomDto | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "edit", room: RoomDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getRoomTypeSeverity(typeName: string) {
  const map: Record<string, string> = {
    Standard: "secondary",
    Deluxe: "info",
    Suite: "success",
    Presidential: "warn",
  };
  return map[typeName] ?? "secondary";
}

function getStatusSeverity(status: string) {
  const map: Record<string, string> = {
    Available: "success",
    Occupied: "danger",
    Maintenance: "warn",
    Reserved: "info",
  };
  return map[status] ?? "secondary";
}
</script>
