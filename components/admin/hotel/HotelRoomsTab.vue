<template>
  <div class="space-y-4 pt-4">
    <div>
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Individual Rooms
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Manage physical room numbers and availability
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            label="Add Room"
            icon="pi pi-plus"
            @click="$emit('openCombinedDialog')"
          />
        </div>
      </div>

      <div v-if="loadingRooms" class="flex justify-center py-8">
        <ProgressSpinner style="width: 32px; height: 32px" />
      </div>

      <DataTable
        v-else
        :value="rooms"
        paginator
        :rows="10"
        responsiveLayout="scroll"
        stripedRows
        class="text-sm"
      >
        <Column field="roomId" header="Room ID" style="width: 10%" />
        <Column field="roomId" header="Image" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <Image
                v-if="data.roomId"
                :src="data.imgUrl"
                :alt="data.roomId"
                preview
                class="w-10 h-10 rounded-lg object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-lg bg-(--admin-surface-hover) flex items-center justify-center"
              >
                <i class="pi pi-building text-(--admin-text-muted)"></i>
              </div>
              <div></div>
            </div>
          </template>
        </Column>
        <Column field="roomType" header="Room Type" style="width: 20%" />
        <Column field="capacity" header="Capacity" style="width: 12%">
          <template #body="{ data }">{{ data.capacity }} guests</template>
        </Column>
        <Column field="pricePerNight" header="Price/Night" style="width: 16%">
          <template #body="{ data }">{{
            formatPrice(data.pricePerNight)
          }}</template>
        </Column>
        <Column field="status" header="Status" style="width: 14%">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getRoomStatusSeverity(data.status)"
            />
          </template>
        </Column>
        <Column header="Actions" style="width: 16%">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              severity="info"
              text
              rounded
              v-tooltip="'Edit'"
              @click="$emit('editRoom', data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              v-tooltip="'Delete'"
              @click="$emit('deleteRoom', data)"
            />
          </template>
        </Column>
        <template #empty>
          <div class="text-center py-8 text-gray-400">
            <i class="pi pi-inbox text-2xl mb-2 block" />
            <p class="text-sm">No rooms found.</p>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import type { RoomDto } from "~/stores/admin/interfaces/rooms";
import { Image } from "primevue";

defineProps<{
  rooms: RoomDto[];
  loadingRooms: boolean;
}>();

defineEmits<{
  (e: "openBulkRoomDialog"): void;
  (e: "openCombinedDialog"): void;
  (e: "editRoom", room: RoomDto): void;
  (e: "deleteRoom", room: RoomDto): void;
}>();

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getRoomStatusSeverity(status: string) {
  const map: Record<string, string> = {
    Available: "success",
    Occupied: "danger",
    Maintenance: "warning",
    Reserved: "info",
  };
  return map[status] ?? "secondary";
}
</script>
