<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Rooms</h2>
        <p class="text-gray-500 mt-1">Manage hotel rooms and availability</p>
      </div>
      <Button label="Add Room" icon="pi pi-plus" @click="openCreateModal" />
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-4">
        <IconField class="flex-1 max-w-md">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="search"
            placeholder="Search rooms..."
            class="w-full"
          />
        </IconField>
        <Select
          v-model="selectedRoomType"
          :options="roomTypes"
          option-label="label"
          option-value="value"
          placeholder="Filter by type"
          class="w-48"
        />
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          @click="resetFilters"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <DataTable
        :value="filteredRooms"
        :loading="isLoading"
        :rows="pageSize"
        :paginator="true"
        :rows-per-page-options="[10, 20, 50]"
        class="p-datatable-sm"
      >
        <template #empty>
          <div class="text-center py-8 text-gray-500">
            <i class="pi pi-inbox text-4xl mb-2" />
            <p>No rooms found</p>
          </div>
        </template>

        <Column field="roomId" header="ID" style="width: 80px">
          <template #body="{ data }">
            <Tag severity="secondary">{{ data.roomId }}</Tag>
          </template>
        </Column>

        <Column field="hotelName" header="Hotel">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-building text-blue-600" />
              <span class="font-medium">{{ data.hotelName }}</span>
            </div>
          </template>
        </Column>

        <Column field="roomType" header="Type">
          <template #body="{ data }">
            <Tag :severity="getRoomTypeSeverity(data.roomType)">
              {{ data.roomType }}
            </Tag>
          </template>
        </Column>

        <Column field="capacity" header="Capacity">
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <i class="pi pi-users text-gray-500" />
              <span>{{ data.capacity }}</span>
            </div>
          </template>
        </Column>

        <Column field="pricePerNight" header="Price/Night">
          <template #body="{ data }">
            <span class="font-semibold text-green-600">{{
              formatPrice(data.pricePerNight)
            }}</span>
          </template>
        </Column>

        <Column field="facilities" header="Facilities">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <Tag
                v-for="facility in data.facilities.slice(0, 2)"
                :key="facility.facilityId"
                severity="info"
                class="text-xs"
              >
                {{ facility.name }}
              </Tag>
              <Tag
                v-if="data.facilities.length > 2"
                severity="secondary"
                class="text-xs"
              >
                +{{ data.facilities.length - 2 }}
              </Tag>
            </div>
          </template>
        </Column>

        <Column header="Actions" style="width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                @click="viewRoomDetails(data)"
              />
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                @click="openEditModal(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="openDeleteModal(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create/Edit Modal -->
    <Dialog
      v-model:visible="isModalOpen"
      :header="isEditing ? 'Edit Room' : 'Add Room'"
      modal
      :style="{ width: '550px' }"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700">Room Type *</label>
            <Select
              v-model="formState.roomType"
              :options="['Standard', 'Deluxe', 'Suite', 'Presidential']"
              placeholder="Select type"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-gray-700">Capacity *</label>
            <InputNumber
              v-model="formState.capacity"
              :min="1"
              :max="10"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">Price per Night *</label>
          <InputNumber
            v-model="formState.pricePerNight"
            :min="0"
            mode="currency"
            currency="USD"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">Image URL</label>
          <InputText
            v-model="formState.imgUrl"
            placeholder="Enter image URL (optional)"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700">Facilities</label>
          <MultiSelect
            v-model="formState.facilityIds"
            :options="allFacilities"
            option-label="name"
            option-value="facilityId"
            placeholder="Select facilities"
            class="w-full"
            display="chip"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            @click="isModalOpen = false"
          />
          <Button :label="isEditing ? 'Update' : 'Create'" @click="onSubmit" />
        </div>
      </template>
    </Dialog>

    <!-- Room Detail Modal -->
    <Dialog
      v-model:visible="isDetailModalOpen"
      header="Room Details"
      modal
      :style="{ width: '500px' }"
    >
      <div v-if="detailRoom" class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="p-4 rounded-lg bg-blue-50">
            <i class="pi pi-th-large text-3xl text-blue-600" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ detailRoom.roomType }}
            </h3>
            <p class="text-gray-500">{{ detailRoom.hotelName }}</p>
          </div>
        </div>

        <Divider />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-500 text-sm">Capacity</p>
            <p class="font-medium">{{ detailRoom.capacity }} guests</p>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Price per Night</p>
            <p class="font-bold text-green-600 text-lg">
              {{ formatPrice(detailRoom.pricePerNight) }}
            </p>
          </div>
        </div>

        <div v-if="detailRoom.facilities.length">
          <p class="text-gray-500 text-sm mb-2">Facilities</p>
          <div class="flex flex-wrap gap-2">
            <Tag
              v-for="facility in detailRoom.facilities"
              :key="facility.facilityId"
              severity="info"
            >
              {{ facility.name }}
            </Tag>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Close" @click="isDetailModalOpen = false" />
      </template>
    </Dialog>

    <!-- Delete Confirmation Modal -->
    <Dialog
      v-model:visible="isDeleteModalOpen"
      header="Delete Room"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-3xl text-yellow-500" />
        <p>
          Are you sure you want to delete
          <strong>{{ deletingRoom?.roomType }}</strong> room? This action cannot
          be undone.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            @click="isDeleteModalOpen = false"
          />
          <Button label="Delete" severity="danger" @click="confirmDelete" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Divider from "primevue/divider";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import Select from "primevue/select";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "Room Management",
});

interface Facility {
  facilityId: number;
  name: string;
}

interface Room {
  roomId: number;
  hotelId: number;
  hotelName: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  imgUrl?: string;
  facilities: Facility[];
}

// State
const search = ref("");
const pageSize = ref(10);
const isLoading = ref(false);
const selectedRoomType = ref<string | null>(null);

// Room types for filter
const roomTypes = [
  { label: "All Types", value: null },
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Presidential", value: "Presidential" },
];

// All facilities for selection in form
const allFacilities = ref<Facility[]>([
  { facilityId: 1, name: "Free WiFi" },
  { facilityId: 2, name: "Swimming Pool" },
  { facilityId: 3, name: "Gym & Fitness Center" },
  { facilityId: 4, name: "Spa & Wellness" },
  { facilityId: 5, name: "Restaurant" },
  { facilityId: 6, name: "Bar & Lounge" },
  { facilityId: 7, name: "Room Service" },
  { facilityId: 8, name: "Parking" },
  { facilityId: 9, name: "Airport Shuttle" },
  { facilityId: 10, name: "Air Conditioning" },
  { facilityId: 11, name: "Flat-screen TV" },
]);

// Mock room data
const rooms = ref<Room[]>([
  {
    roomId: 1,
    hotelId: 1,
    hotelName: "Grand Luxury Hotel",
    roomType: "Standard",
    capacity: 2,
    pricePerNight: 120,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 10, name: "Air Conditioning" },
      { facilityId: 11, name: "Flat-screen TV" },
    ],
  },
  {
    roomId: 2,
    hotelId: 1,
    hotelName: "Grand Luxury Hotel",
    roomType: "Deluxe",
    capacity: 2,
    pricePerNight: 220,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 2, name: "Swimming Pool" },
      { facilityId: 7, name: "Room Service" },
    ],
  },
  {
    roomId: 3,
    hotelId: 1,
    hotelName: "Grand Luxury Hotel",
    roomType: "Suite",
    capacity: 4,
    pricePerNight: 450,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 2, name: "Swimming Pool" },
      { facilityId: 4, name: "Spa & Wellness" },
      { facilityId: 7, name: "Room Service" },
    ],
  },
  {
    roomId: 4,
    hotelId: 2,
    hotelName: "Ocean View Resort",
    roomType: "Presidential",
    capacity: 6,
    pricePerNight: 1200,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 2, name: "Swimming Pool" },
      { facilityId: 4, name: "Spa & Wellness" },
      { facilityId: 5, name: "Restaurant" },
      { facilityId: 7, name: "Room Service" },
    ],
  },
  {
    roomId: 5,
    hotelId: 2,
    hotelName: "Ocean View Resort",
    roomType: "Standard",
    capacity: 2,
    pricePerNight: 95,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 10, name: "Air Conditioning" },
    ],
  },
  {
    roomId: 6,
    hotelId: 3,
    hotelName: "City Center Inn",
    roomType: "Deluxe",
    capacity: 3,
    pricePerNight: 180,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 3, name: "Gym & Fitness Center" },
      { facilityId: 8, name: "Parking" },
    ],
  },
  {
    roomId: 7,
    hotelId: 3,
    hotelName: "City Center Inn",
    roomType: "Suite",
    capacity: 4,
    pricePerNight: 380,
    facilities: [
      { facilityId: 1, name: "Free WiFi" },
      { facilityId: 3, name: "Gym & Fitness Center" },
      { facilityId: 6, name: "Bar & Lounge" },
      { facilityId: 7, name: "Room Service" },
    ],
  },
]);

// Computed filtered list
const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const matchSearch =
      !search.value ||
      room.hotelName.toLowerCase().includes(search.value.toLowerCase()) ||
      room.roomType.toLowerCase().includes(search.value.toLowerCase());
    const matchType =
      !selectedRoomType.value || room.roomType === selectedRoomType.value;
    return matchSearch && matchType;
  });
});

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

// Delete modal state
const isDeleteModalOpen = ref(false);
const deletingRoom = ref<Room | null>(null);

// Detail modal state
const isDetailModalOpen = ref(false);
const detailRoom = ref<Room | null>(null);

// Form state
const formState = reactive({
  hotelId: 1,
  hotelName: "Grand Luxury Hotel",
  roomType: "Standard",
  pricePerNight: 0,
  capacity: 2,
  imgUrl: "",
  facilityIds: [] as number[],
});

const resetFilters = () => {
  search.value = "";
  selectedRoomType.value = null;
};

// Open create modal
const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  formState.hotelId = 1;
  formState.hotelName = "Grand Luxury Hotel";
  formState.roomType = "Standard";
  formState.pricePerNight = 0;
  formState.capacity = 2;
  formState.imgUrl = "";
  formState.facilityIds = [];
  isModalOpen.value = true;
};

// Open edit modal
const openEditModal = (room: Room) => {
  isEditing.value = true;
  editingId.value = room.roomId;
  formState.hotelId = room.hotelId;
  formState.hotelName = room.hotelName;
  formState.roomType = room.roomType;
  formState.pricePerNight = room.pricePerNight;
  formState.capacity = room.capacity;
  formState.imgUrl = room.imgUrl || "";
  formState.facilityIds = room.facilities.map((f) => f.facilityId);
  isModalOpen.value = true;
};

// View room details
const viewRoomDetails = (room: Room) => {
  detailRoom.value = room;
  isDetailModalOpen.value = true;
};

// Submit form
const onSubmit = () => {
  const selectedFacilities = allFacilities.value.filter((f) =>
    formState.facilityIds.includes(f.facilityId),
  );

  if (isEditing.value && editingId.value) {
    const index = rooms.value.findIndex((r) => r.roomId === editingId.value);
    if (index !== -1) {
      rooms.value[index] = {
        ...rooms.value[index],
        roomType: formState.roomType,
        pricePerNight: formState.pricePerNight,
        capacity: formState.capacity,
        imgUrl: formState.imgUrl || undefined,
        facilities: selectedFacilities,
      };
    }
  } else {
    const newId = Math.max(...rooms.value.map((r) => r.roomId)) + 1;
    rooms.value.push({
      roomId: newId,
      hotelId: formState.hotelId,
      hotelName: formState.hotelName,
      roomType: formState.roomType,
      pricePerNight: formState.pricePerNight,
      capacity: formState.capacity,
      imgUrl: formState.imgUrl || undefined,
      facilities: selectedFacilities,
    });
  }

  isModalOpen.value = false;
};

// Open delete confirmation
const openDeleteModal = (room: Room) => {
  deletingRoom.value = room;
  isDeleteModalOpen.value = true;
};

// Confirm delete
const confirmDelete = () => {
  if (!deletingRoom.value) return;
  rooms.value = rooms.value.filter(
    (r) => r.roomId !== deletingRoom.value!.roomId,
  );
  isDeleteModalOpen.value = false;
  deletingRoom.value = null;
};

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Get room type severity
const getRoomTypeSeverity = (typeName: string) => {
  const severities: Record<string, string> = {
    Standard: "secondary",
    Deluxe: "info",
    Suite: "success",
    Presidential: "warn",
  };
  return severities[typeName] || "secondary";
};
</script>
