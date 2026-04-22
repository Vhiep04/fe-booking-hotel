<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="admin-page-title">Rooms</h2>
        <p class="admin-page-subtitle">Manage hotel rooms and availability</p>
      </div>
      <Button label="Add Room" icon="pi pi-plus" @click="openCreateModal" />
    </div>

    <!-- Filters -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="flex items-center gap-4 flex-wrap">
          <IconField class="flex-1 min-w-[200px] max-w-md">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Search rooms..."
              class="w-full"
            />
          </IconField>

          <Select
            v-model="filters.roomType"
            :options="roomTypeFilterOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filter by type"
            class="w-48"
          />

          <Select
            v-model="filters.hotelId"
            :options="hotelOptions"
            optionLabel="name"
            optionValue="hotelId"
            placeholder="Filter by hotel"
            showClear
            class="w-48"
          />

          <Button
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            v-tooltip.top="'Reset filters'"
            @click="resetFilters"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <RoomTable
      :rooms="rooms"
      :totalCount="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :loading="loading"
      @view="openDetailModal"
      @edit="openEditModal"
      @delete="openDeleteModal"
      @page="onPageChange"
    />

    <!-- Combined Create/Edit Dialog -->
    <CombinedRoomDialog
      v-model="roomDialog"
      :hotelId="selectedHotelId"
      :saving="saving"
      :editingRoom="editingRoom"
      :editingRoomType="editingRoomType"
      @hide="closeRoomDialog"
      @save="handleSave"
    />

    <!-- Detail Dialog -->
    <RoomDetailDialog
      v-model="detailDialog"
      :room="detailRoom"
      @edit="openEditModal"
    />

    <!-- Delete Dialog -->
    <RoomDeleteDialog
      v-model="deleteDialog"
      :room="roomToDelete"
      :deleting="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import { useRoomStore } from "~/stores/admin/rooms";
import { useRoomTypeStore } from "~/stores/admin/room-type";
import type { RoomDto } from "~/stores/admin/interfaces/rooms";
import type { RoomTypeDto } from "~/stores/admin/interfaces/room-type";
import { useAdminHotelStore } from "~/stores/admin/hotels";
import RoomTable from "~/components/admin/room/RoomTable.vue";
import CombinedRoomDialog, {
  type CombinedSavePayload,
} from "~/components/admin/room/CombinedRoomDialog.vue";
import RoomDetailDialog from "~/components/admin/room/RoomDetailDialog.vue";
import RoomDeleteDialog from "~/components/admin/room/RoomDeleteDialog.vue";

definePageMeta({ layout: "admin", middleware: ["admin"] });
useHead({ title: "Room Management" });

const toast = useToast();
const roomStore = useRoomStore();
const roomTypeStore = useRoomTypeStore();
const hotelStore = useAdminHotelStore();

// ─── State ────────────────────────────────────────────────────────────────────

const rooms = ref<RoomDto[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const roomDialog = ref(false);
const detailDialog = ref(false);
const deleteDialog = ref(false);

const editingRoom = ref<RoomDto | null>(null);
const editingRoomType = ref<RoomTypeDto | null>(null);
const detailRoom = ref<RoomDto | null>(null);
const roomToDelete = ref<RoomDto | null>(null);

// hotelId used when opening the dialog (needed by CombinedRoomDialog)
const selectedHotelId = ref<number>(0);

const pagination = ref({ page: 1, pageSize: 10, totalCount: 0 });

const filters = ref({
  search: "",
  roomType: null as string | null,
  hotelId: null as number | null,
});

// Hotel list for filter dropdown
const hotelOptions = ref<{ hotelId: number; name: string }[]>([]);

const roomTypeFilterOptions = [
  { label: "All Types", value: null },
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Presidential", value: "Presidential" },
];

// ─── Init ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchHotelOptions()]);
});

async function fetchHotelOptions() {
  try {
    const res = await hotelStore.fetchHotels({ pageSize: 200 });
    if (res?.success) {
      hotelOptions.value = res.data.items.map((h) => ({
        hotelId: h.hotelId,
        name: h.name,
      }));
    }
  } catch {
    // non-critical
  }
}

// ─── Fetch Rooms ──────────────────────────────────────────────────────────────

async function fetchRooms() {
  loading.value = true;
  try {
    const res = await roomStore.getRooms({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      roomType: filters.value.roomType || undefined,
      hotelId: filters.value.hotelId ?? undefined,
    });

    if (res?.success) {
      rooms.value = res.data.items;
      pagination.value.totalCount = res.data.totalCount;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to load rooms",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error loading rooms",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  filters,
  () => {
    pagination.value.page = 1;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchRooms, 400);
  },
  { deep: true },
);

// ─── Pagination ───────────────────────────────────────────────────────────────

function onPageChange({ page, rows }: { page: number; rows: number }) {
  pagination.value.page = page;
  pagination.value.pageSize = rows;
  fetchRooms();
}

// ─── Filters ──────────────────────────────────────────────────────────────────

function resetFilters() {
  filters.value = { search: "", roomType: null, hotelId: null };
}

// ─── Dialogs ──────────────────────────────────────────────────────────────────

function openCreateModal() {
  editingRoom.value = null;
  editingRoomType.value = null;
  // default to first hotel or 0 — user picks in the form
  selectedHotelId.value = hotelOptions.value[0]?.hotelId ?? 0;
  roomDialog.value = true;
}

async function openEditModal(room: RoomDto) {
  editingRoom.value = room;
  selectedHotelId.value = room.hotelId;

  // Fetch the full RoomType to pre-fill the form
  try {
    const res = await roomTypeStore.getRoomTypeById(room.roomTypeId);
    editingRoomType.value = res?.success ? res.data : null;
  } catch {
    editingRoomType.value = null;
  }

  roomDialog.value = true;
  detailDialog.value = false; // close detail if open
}

function openDetailModal(room: RoomDto) {
  detailRoom.value = room;
  detailDialog.value = true;
}

function openDeleteModal(room: RoomDto) {
  roomToDelete.value = room;
  deleteDialog.value = true;
}

function closeRoomDialog() {
  roomDialog.value = false;
  editingRoom.value = null;
  editingRoomType.value = null;
}

async function handleSave(payload: CombinedSavePayload) {
  saving.value = true;
  try {
    if (payload.roomTypeId && payload.roomId) {
      // ── UPDATE path ──
      const [rtRes, rRes] = await Promise.all([
        roomTypeStore.updateRoomType(
          payload.roomTypeId,
          payload.roomTypePayload,
        ),
        roomStore.updateRoom(payload.roomId, {
          ...payload.roomPayload,
          roomTypeId: payload.roomTypeId,
        }),
      ]);

      if (rtRes?.success && rRes?.success) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Room updated successfully",
          life: 3000,
        });
        closeRoomDialog();
        await fetchRooms();
      } else {
        const msg = rtRes?.message ?? rRes?.message ?? "Failed to update room";
        toast.add({
          severity: "error",
          summary: "Error",
          detail: msg,
          life: 3000,
        });
      }
    } else {
      // ── CREATE path ──
      // 1. Create RoomType first to get roomTypeId
      const rtRes = await roomTypeStore.createRoomType(payload.roomTypePayload);
      if (!rtRes?.success) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: rtRes?.message ?? "Failed to create room type",
          life: 3000,
        });
        return;
      }

      // 2. Create Room with the new roomTypeId
      const rRes = await roomStore.createRoom({
        ...payload.roomPayload,
        roomTypeId: rtRes.data.roomTypeId,
      });

      if (rRes?.success) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Room created successfully",
          life: 3000,
        });
        closeRoomDialog();
        await fetchRooms();
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: rRes?.message ?? "Failed to create room",
          life: 3000,
        });
      }
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

async function handleDelete() {
  if (!roomToDelete.value) return;
  deleting.value = true;
  try {
    const res = await roomStore.deleteRoom(roomToDelete.value.roomId);
    if (res?.success) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Room deleted successfully",
        life: 3000,
      });
      deleteDialog.value = false;
      roomToDelete.value = null;
      await fetchRooms();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: res?.message ?? "Failed to delete room",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unexpected error",
      life: 3000,
    });
  } finally {
    deleting.value = false;
  }
}
</script>
