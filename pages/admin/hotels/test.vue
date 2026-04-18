<template>
  <div class="admin-layout p-6">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/admin/hotels" class="text-blue-600 hover:text-blue-800"
          >Hotels</NuxtLink
        >
        <span class="text-gray-400">/</span>
        <span class="text-gray-700 dark:text-gray-300">{{ hotelName }}</span>
      </nav>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Hotel Details
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage hotel information, rooms, and amenities
        </p>
      </div>
      <div class="flex gap-3">
        <Button
          label="Back"
          icon="pi pi-arrow-left"
          severity="secondary"
          @click="navigateTo('/admin/hotels')"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="deleteHotel"
        />
      </div>
    </div>

    <!-- Tabs -->
    <TabView v-model:activeIndex="activeTab" class="mb-6">
      <!-- Tab 1: Basic Information -->
      <TabPanel header="Basic Information" leftIcon="pi pi-info-circle">
        <form @submit.prevent="updateHotel" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Hotel Name -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Hotel Name *
              </label>
              <InputText
                v-model="hotelForm.name"
                placeholder="Enter hotel name"
                class="w-full"
              />
            </div>

            <!-- City -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                City *
              </label>
              <Dropdown
                v-model="hotelForm.cityId"
                :options="cities"
                option-label="name"
                option-value="id"
                placeholder="Select city"
                class="w-full"
              />
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Address *
              </label>
              <InputText
                v-model="hotelForm.address"
                placeholder="Enter full address"
                class="w-full"
              />
            </div>

            <!-- Phone -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone Number
              </label>
              <InputText
                v-model="hotelForm.phone"
                placeholder="Enter phone number"
                class="w-full"
              />
            </div>

            <!-- Email -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <InputText
                v-model="hotelForm.email"
                type="email"
                placeholder="Enter email"
                class="w-full"
              />
            </div>

            <!-- Rating -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Star Rating
              </label>
              <Rating v-model="hotelForm.rating" :cancel="false" />
            </div>

            <!-- Check-in Time -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Check-in Time
              </label>
              <InputText
                v-model="hotelForm.checkInTime"
                type="time"
                class="w-full"
              />
            </div>

            <!-- Check-out Time -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Check-out Time
              </label>
              <InputText
                v-model="hotelForm.checkOutTime"
                type="time"
                class="w-full"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <Textarea
              v-model="hotelForm.description"
              placeholder="Enter hotel description"
              rows="4"
              class="w-full"
            />
          </div>

          <!-- Image URL -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Image URL
            </label>
            <InputText
              v-model="hotelForm.image"
              placeholder="Enter image URL"
              class="w-full"
            />
            <div v-if="hotelForm.image" class="mt-3">
              <img
                :src="hotelForm.image"
                alt="Hotel"
                class="w-32 h-32 object-cover rounded"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-3">
            <Button
              type="submit"
              label="Save Changes"
              icon="pi pi-check"
              class="w-32"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              class="w-32"
              @click="resetForm"
            />
          </div>
        </form>
      </TabPanel>

      <!-- Tab 2: Rooms -->
      <TabPanel header="Rooms" leftIcon="pi pi-home">
        <div class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hotel Rooms
            </h3>
            <Button
              label="Add Room"
              icon="pi pi-plus"
              @click="openRoomDialog"
              class="bg-green-600 hover:bg-green-700"
            />
          </div>

          <!-- Rooms Table -->
          <DataTable
            :value="hotelRooms"
            paginator
            :rows="5"
            responsive-layout="scroll"
            striped-rows
            class="text-sm"
          >
            <Column field="type" header="Room Type" style="width: 20%" />
            <Column field="capacity" header="Capacity" style="width: 15%">
              <template #body="{ data }"> {{ data.capacity }} guests </template>
            </Column>
            <Column field="price" header="Price/Night" style="width: 15%">
              <template #body="{ data }">
                {{ formatPrice(data.price) }}
              </template>
            </Column>
            <Column
              field="totalRooms"
              header="Total Rooms"
              style="width: 15%"
            />
            <Column
              field="availableRooms"
              header="Available"
              style="width: 15%"
            >
              <template #body="{ data }">
                <Tag
                  :value="`${data.availableRooms}/${data.totalRooms}`"
                  severity="info"
                />
              </template>
            </Column>
            <Column style="width: 20%" header="Actions">
              <template #body="{ data }">
                <Button
                  icon="pi pi-pencil"
                  severity="info"
                  text
                  rounded
                  @click="editRoom(data)"
                  v-tooltip="'Edit'"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="deleteRoom(data)"
                  v-tooltip="'Delete'"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>

      <!-- Tab 3: Facilities -->
      <TabPanel header="Facilities" leftIcon="pi pi-star">
        <div class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hotel Facilities
            </h3>
            <Button
              label="Add Facility"
              icon="pi pi-plus"
              @click="openFacilityDialog"
              class="bg-green-600 hover:bg-green-700"
            />
          </div>

          <!-- Facilities Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="facility in hotelFacilities"
              :key="facility.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start gap-3"
            >
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ facility.name }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ facility.description }}
                </p>
              </div>
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="info"
                  text
                  rounded
                  size="small"
                  @click="editFacility(facility)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="deleteFacility(facility)"
                />
              </div>
            </div>
          </div>
        </div>
      </TabPanel>

      <!-- Tab 4: Bookings -->
      <TabPanel header="Bookings" leftIcon="pi pi-calendar">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Bookings
          </h3>

          <!-- Bookings Table -->
          <DataTable
            :value="hotelBookings"
            paginator
            :rows="10"
            responsive-layout="scroll"
            striped-rows
            class="text-sm"
          >
            <Column field="guestName" header="Guest Name" style="width: 20%" />
            <Column field="roomType" header="Room Type" style="width: 15%" />
            <Column field="checkIn" header="Check-in" style="width: 15%">
              <template #body="{ data }">
                {{ formatDate(data.checkIn) }}
              </template>
            </Column>
            <Column field="checkOut" header="Check-out" style="width: 15%">
              <template #body="{ data }">
                {{ formatDate(data.checkOut) }}
              </template>
            </Column>
            <Column field="totalPrice" header="Total" style="width: 15%">
              <template #body="{ data }">
                {{ formatPrice(data.totalPrice) }}
              </template>
            </Column>
            <Column field="status" header="Status" style="width: 15%">
              <template #body="{ data }">
                <Tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
    </TabView>

    <!-- Room Dialog -->
    <Dialog
      v-model:visible="roomDialogVisible"
      :header="editingRoom ? 'Edit Room' : 'Add Room'"
      :modal="true"
      class="w-full md:w-96"
    >
      <form @submit.prevent="saveRoom" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Room Type *</label>
          <InputText
            v-model="roomForm.type"
            placeholder="e.g., Deluxe Double"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Capacity *</label>
          <InputNumber
            v-model="roomForm.capacity"
            :min="1"
            placeholder="Number of guests"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2"
            >Price per Night *</label
          >
          <InputNumber
            v-model="roomForm.price"
            :min="0"
            mode="currency"
            currency="VND"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Total Rooms *</label>
          <InputNumber
            v-model="roomForm.totalRooms"
            :min="1"
            placeholder="Total number of rooms"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2"
            >Available Rooms *</label
          >
          <InputNumber
            v-model="roomForm.availableRooms"
            :min="0"
            :max="roomForm.totalRooms"
            placeholder="Available rooms"
            class="w-full"
          />
        </div>
      </form>
      <template #footer>
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="roomDialogVisible = false"
        />
        <Button type="submit" label="Save" icon="pi pi-check" />
      </template>
    </Dialog>

    <!-- Facility Dialog -->
    <Dialog
      v-model:visible="facilityDialogVisible"
      :header="editingFacility ? 'Edit Facility' : 'Add Facility'"
      :modal="true"
      class="w-full md:w-96"
    >
      <form @submit.prevent="saveFacility" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Facility Name *</label>
          <InputText
            v-model="facilityForm.name"
            placeholder="e.g., Swimming Pool"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <Textarea
            v-model="facilityForm.description"
            placeholder="Describe this facility"
            rows="3"
            class="w-full"
          />
        </div>
      </form>
      <template #footer>
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="facilityDialogVisible = false"
        />
        <Button type="submit" label="Save" icon="pi pi-check" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Rating from "primevue/rating";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const router = useRouter();

const activeTab = ref(0);
const hotelName = ref("Hotel Name");

// Hotel Form
const hotelForm = ref({
  name: "",
  cityId: null,
  address: "",
  phone: "",
  email: "",
  rating: 0,
  checkInTime: "",
  checkOutTime: "",
  description: "",
  image: "",
});

const cities = ref([]);
const hotelRooms = ref([]);
const hotelFacilities = ref([]);
const hotelBookings = ref([]);

// Room Dialog
const roomDialogVisible = ref(false);
const editingRoom = ref(null);
const roomForm = ref({
  type: "",
  capacity: null,
  price: null,
  totalRooms: null,
  availableRooms: null,
});

// Facility Dialog
const facilityDialogVisible = ref(false);
const editingFacility = ref(null);
const facilityForm = ref({
  name: "",
  description: "",
});

onMounted(async () => {
  const hotelId = route.params.id;
  console.log("Loading hotel:", hotelId);

  // TODO: Fetch hotel data from API
  // const hotelData = await fetch(`/api/admin/hotels/${hotelId}`)
  // hotelForm.value = await hotelData.json()

  // Sample data
  hotelForm.value = {
    name: "The Grand Hotel",
    cityId: "1",
    address: "123 Main Street, City",
    phone: "+84 2345 678 910",
    email: "info@grandhotel.com",
    rating: 5,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    description: "Luxury 5-star hotel with world-class amenities",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
  };
  hotelName.value = hotelForm.value.name;

  // Sample cities
  cities.value = [
    { id: "1", name: "Hanoi" },
    { id: "2", name: "Ho Chi Minh City" },
    { id: "3", name: "Da Nang" },
  ];

  // Sample rooms
  hotelRooms.value = [
    {
      id: 1,
      type: "Deluxe Double",
      capacity: 2,
      price: 1500000,
      totalRooms: 10,
      availableRooms: 7,
    },
    {
      id: 2,
      type: "Superior Twin",
      capacity: 2,
      price: 1200000,
      totalRooms: 8,
      availableRooms: 3,
    },
    {
      id: 3,
      type: "Suite",
      capacity: 4,
      price: 2500000,
      totalRooms: 5,
      availableRooms: 2,
    },
  ];

  // Sample facilities
  hotelFacilities.value = [
    { id: 1, name: "Swimming Pool", description: "Olympic-size outdoor pool" },
    { id: 2, name: "Gym", description: "Fully equipped fitness center" },
    { id: 3, name: "Restaurant", description: "Fine dining restaurant" },
  ];

  // Sample bookings
  hotelBookings.value = [
    {
      id: 1,
      guestName: "John Doe",
      roomType: "Deluxe Double",
      checkIn: "2024-04-20",
      checkOut: "2024-04-22",
      totalPrice: 3000000,
      status: "Confirmed",
    },
    {
      id: 2,
      guestName: "Jane Smith",
      roomType: "Suite",
      checkIn: "2024-04-21",
      checkOut: "2024-04-25",
      totalPrice: 10000000,
      status: "Confirmed",
    },
  ];
});

const updateHotel = async () => {
  console.log("Saving hotel:", hotelForm.value);
  // TODO: Call API to update hotel
  // await fetch(`/api/admin/hotels/${route.params.id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(hotelForm.value)
  // })
};

const resetForm = () => {
  // Reset form to original values
  console.log("Form reset");
};

const deleteHotel = async () => {
  if (confirm("Are you sure you want to delete this hotel?")) {
    console.log("Deleting hotel:", route.params.id);
    // TODO: Call API to delete hotel
    // await fetch(`/api/admin/hotels/${route.params.id}`, { method: 'DELETE' })
    router.push("/admin/hotels");
  }
};

const openRoomDialog = () => {
  editingRoom.value = null;
  roomForm.value = {
    type: "",
    capacity: null,
    price: null,
    totalRooms: null,
    availableRooms: null,
  };
  roomDialogVisible.value = true;
};

const editRoom = (room: any) => {
  editingRoom.value = room;
  roomForm.value = { ...room };
  roomDialogVisible.value = true;
};

const saveRoom = async () => {
  console.log("Saving room:", roomForm.value);
  // TODO: Call API to save room
  roomDialogVisible.value = false;
};

const deleteRoom = async (room: any) => {
  if (confirm("Delete this room?")) {
    console.log("Deleting room:", room.id);
    // TODO: Call API to delete room
  }
};

const openFacilityDialog = () => {
  editingFacility.value = null;
  facilityForm.value = { name: "", description: "" };
  facilityDialogVisible.value = true;
};

const editFacility = (facility: any) => {
  editingFacility.value = facility;
  facilityForm.value = { ...facility };
  facilityDialogVisible.value = true;
};

const saveFacility = async () => {
  console.log("Saving facility:", facilityForm.value);
  // TODO: Call API to save facility
  facilityDialogVisible.value = false;
};

const deleteFacility = async (facility: any) => {
  if (confirm("Delete this facility?")) {
    console.log("Deleting facility:", facility.id);
    // TODO: Call API to delete facility
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

const getStatusSeverity = (status: string) => {
  const severities: { [key: string]: string } = {
    Confirmed: "success",
    Pending: "warning",
    Cancelled: "danger",
    Completed: "info",
  };
  return severities[status] || "info";
};
</script>

<style scoped>
/* :deep(.p-tabview) {
  @apply border-0;
}
:deep(.p-tabview-nav) {
  @apply border-b border-gray-200 dark:border-gray-700;
}
:deep(.p-tabview-panels) {
  @apply p-0;
} */
</style>
