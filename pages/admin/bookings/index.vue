<template>
  <div>
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="admin-page-title">Bookings Management</h1>
        <p class="admin-page-subtitle">View and manage all bookings</p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          label="Export"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="exportData"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
            >
              <i class="pi pi-calendar text-blue-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.total }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Total</p>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center"
            >
              <i class="pi pi-clock text-yellow-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.pending }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Pending</p>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <i class="pi pi-check-circle text-green-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.confirmed }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Confirmed</p>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-body p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
            >
              <i class="pi pi-times-circle text-red-600"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--admin-text-color)]">
                {{ stats.cancelled }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Search bookings..."
              class="w-full"
            />
          </IconField>
          <Dropdown
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Status"
            showClear
            class="w-full"
          />
          <Dropdown
            v-model="filters.hotel"
            :options="hotelOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="All Hotels"
            showClear
            class="w-full"
          />
          <Calendar
            v-model="filters.dateFrom"
            placeholder="From Date"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
          />
          <Calendar
            v-model="filters.dateTo"
            placeholder="To Date"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="admin-card">
      <DataTable
        :value="filteredBookings"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :loading="loading"
        dataKey="id"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} bookings"
        responsiveLayout="scroll"
        sortField="createdAt"
        :sortOrder="-1"
      >
        <Column
          field="id"
          header="Booking ID"
          sortable
          style="min-width: 130px"
        >
          <template #body="{ data }">
            <span class="font-semibold text-[var(--admin-primary)]">
              {{ data.id }}
            </span>
          </template>
        </Column>

        <Column field="hotel" header="Hotel" sortable style="min-width: 220px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <img
                :src="data.hotelImage"
                :alt="data.hotel"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p class="font-medium text-[var(--admin-text-color)]">
                  {{ data.hotel }}
                </p>
                <p class="text-xs text-[var(--admin-text-muted)]">
                  {{ data.roomType }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="guest" header="Guest" sortable style="min-width: 180px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar
                :label="data.guest.charAt(0)"
                shape="circle"
                size="normal"
                class="bg-[var(--admin-primary)] text-white"
              />
              <div>
                <p class="font-medium text-[var(--admin-text-color)]">
                  {{ data.guest }}
                </p>
                <p class="text-xs text-[var(--admin-text-muted)]">
                  {{ data.guestEmail }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column
          field="checkIn"
          header="Check-in"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <div>
              <p class="font-medium">{{ formatDate(data.checkIn) }}</p>
              <p class="text-xs text-[var(--admin-text-muted)]">
                {{ data.checkInTime }}
              </p>
            </div>
          </template>
        </Column>

        <Column
          field="checkOut"
          header="Check-out"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <div>
              <p class="font-medium">{{ formatDate(data.checkOut) }}</p>
              <p class="text-xs text-[var(--admin-text-muted)]">
                {{ data.checkOutTime }}
              </p>
            </div>
          </template>
        </Column>

        <Column field="nights" header="Nights" sortable style="min-width: 80px">
          <template #body="{ data }">
            <span>{{ data.nights }} nights</span>
          </template>
        </Column>

        <Column
          field="amount"
          header="Amount"
          sortable
          style="min-width: 120px"
        >
          <template #body="{ data }">
            <div>
              <p class="font-bold text-[var(--admin-text-color)]">
                ${{ data.amount.toLocaleString() }}
              </p>
              <Tag
                v-if="data.paymentStatus === 'Paid'"
                value="Paid"
                severity="success"
                class="text-xs"
              />
              <Tag v-else value="Unpaid" severity="warn" class="text-xs" />
            </div>
          </template>
        </Column>

        <Column
          field="status"
          header="Status"
          sortable
          style="min-width: 130px"
        >
          <template #body="{ data }">
            <Dropdown
              v-model="data.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              @change="updateStatus(data)"
            >
              <template #value="slotProps">
                <Tag
                  :value="slotProps.value"
                  :severity="getStatusSeverity(slotProps.value)"
                />
              </template>
            </Dropdown>
          </template>
        </Column>

        <Column header="Actions" style="min-width: 120px">
          <template #body="{ data }">
            <div class="flex items-center gap-1">
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                size="small"
                v-tooltip.top="'View Details'"
                @click="viewBooking(data)"
              />
              <Button
                icon="pi pi-print"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Print Invoice'"
                @click="printInvoice(data)"
              />
              <Button
                icon="pi pi-envelope"
                severity="secondary"
                text
                rounded
                size="small"
                v-tooltip.top="'Send Email'"
                @click="sendEmail(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- View Booking Dialog -->
    <Dialog
      v-model:visible="viewDialog"
      :style="{ width: '700px' }"
      header="Booking Details"
      :modal="true"
    >
      <div v-if="selectedBooking" class="space-y-6">
        <!-- Booking Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-[var(--admin-text-muted)]"
              >Booking ID</label
            >
            <p class="font-semibold text-[var(--admin-primary)]">
              {{ selectedBooking.id }}
            </p>
          </div>
          <div>
            <label class="text-sm text-[var(--admin-text-muted)]">Status</label>
            <div>
              <Tag
                :value="selectedBooking.status"
                :severity="getStatusSeverity(selectedBooking.status)"
              />
            </div>
          </div>
        </div>

        <Divider />

        <!-- Hotel Info -->
        <div>
          <h4 class="font-semibold mb-3">Hotel Information</h4>
          <div class="flex items-center gap-4">
            <img
              :src="selectedBooking.hotelImage"
              :alt="selectedBooking.hotel"
              class="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <p class="font-semibold text-lg">{{ selectedBooking.hotel }}</p>
              <p class="text-[var(--admin-text-muted)]">
                {{ selectedBooking.roomType }}
              </p>
            </div>
          </div>
        </div>

        <Divider />

        <!-- Guest Info -->
        <div>
          <h4 class="font-semibold mb-3">Guest Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]">Name</label>
              <p class="font-medium">{{ selectedBooking.guest }}</p>
            </div>
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]"
                >Email</label
              >
              <p class="font-medium">{{ selectedBooking.guestEmail }}</p>
            </div>
          </div>
        </div>

        <Divider />

        <!-- Stay Info -->
        <div>
          <h4 class="font-semibold mb-3">Stay Information</h4>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]"
                >Check-in</label
              >
              <p class="font-medium">
                {{ formatDate(selectedBooking.checkIn) }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">
                {{ selectedBooking.checkInTime }}
              </p>
            </div>
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]"
                >Check-out</label
              >
              <p class="font-medium">
                {{ formatDate(selectedBooking.checkOut) }}
              </p>
              <p class="text-sm text-[var(--admin-text-muted)]">
                {{ selectedBooking.checkOutTime }}
              </p>
            </div>
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]"
                >Duration</label
              >
              <p class="font-medium">{{ selectedBooking.nights }} nights</p>
            </div>
          </div>
        </div>

        <Divider />

        <!-- Payment Info -->
        <div>
          <h4 class="font-semibold mb-3">Payment Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]"
                >Total Amount</label
              >
              <p class="font-bold text-xl">
                ${{ selectedBooking.amount.toLocaleString() }}
              </p>
            </div>
            <div>
              <label class="text-sm text-[var(--admin-text-muted)]"
                >Payment Status</label
              >
              <div>
                <Tag
                  :value="selectedBooking.paymentStatus"
                  :severity="
                    selectedBooking.paymentStatus === 'Paid'
                      ? 'success'
                      : 'warn'
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Close"
          severity="secondary"
          @click="viewDialog = false"
        />
        <Button
          label="Print Invoice"
          icon="pi pi-print"
          @click="printInvoice(selectedBooking)"
        />
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
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import Divider from "primevue/divider";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const toast = useToast();

// State
const loading = ref(false);
const viewDialog = ref(false);
const selectedBooking = ref<any>(null);

// Stats
const stats = computed(() => ({
  total: bookings.value.length,
  pending: bookings.value.filter((b) => b.status === "Pending").length,
  confirmed: bookings.value.filter((b) => b.status === "Confirmed").length,
  cancelled: bookings.value.filter((b) => b.status === "Cancelled").length,
}));

// Filters
const filters = ref({
  search: "",
  status: null,
  hotel: null,
  dateFrom: null,
  dateTo: null,
});

// Options
const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const hotelOptions = ref([
  { id: 1, name: "Grand Plaza Hotel" },
  { id: 2, name: "Seaside Resort" },
  { id: 3, name: "Mountain Lodge" },
  { id: 4, name: "City Center Inn" },
]);

// Mock bookings data
const bookings = ref([
  {
    id: "BK-2024-001",
    hotel: "Grand Plaza Hotel",
    hotelImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
    roomType: "Deluxe Suite",
    guest: "John Smith",
    guestEmail: "john.smith@email.com",
    checkIn: "2024-03-15",
    checkInTime: "2:00 PM",
    checkOut: "2024-03-18",
    checkOutTime: "11:00 AM",
    nights: 3,
    amount: 597,
    status: "Confirmed",
    paymentStatus: "Paid",
    createdAt: "2024-03-10",
  },
  {
    id: "BK-2024-002",
    hotel: "Seaside Resort",
    hotelImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop",
    roomType: "Ocean View Room",
    guest: "Sarah Johnson",
    guestEmail: "sarah.j@email.com",
    checkIn: "2024-03-16",
    checkInTime: "3:00 PM",
    checkOut: "2024-03-20",
    checkOutTime: "12:00 PM",
    nights: 4,
    amount: 1196,
    status: "Pending",
    paymentStatus: "Unpaid",
    createdAt: "2024-03-11",
  },
  {
    id: "BK-2024-003",
    hotel: "Mountain Lodge",
    hotelImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=200&fit=crop",
    roomType: "Standard Room",
    guest: "Mike Wilson",
    guestEmail: "mike.w@email.com",
    checkIn: "2024-03-14",
    checkInTime: "2:00 PM",
    checkOut: "2024-03-16",
    checkOutTime: "10:00 AM",
    nights: 2,
    amount: 298,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "2024-03-08",
  },
  {
    id: "BK-2024-004",
    hotel: "City Center Inn",
    hotelImage:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&h=200&fit=crop",
    roomType: "Business Suite",
    guest: "Emily Brown",
    guestEmail: "emily.b@email.com",
    checkIn: "2024-03-17",
    checkInTime: "2:00 PM",
    checkOut: "2024-03-19",
    checkOutTime: "11:00 AM",
    nights: 2,
    amount: 398,
    status: "Confirmed",
    paymentStatus: "Paid",
    createdAt: "2024-03-12",
  },
  {
    id: "BK-2024-005",
    hotel: "Grand Plaza Hotel",
    hotelImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
    roomType: "Premium Room",
    guest: "David Lee",
    guestEmail: "david.l@email.com",
    checkIn: "2024-03-18",
    checkInTime: "3:00 PM",
    checkOut: "2024-03-22",
    checkOutTime: "11:00 AM",
    nights: 4,
    amount: 996,
    status: "Cancelled",
    paymentStatus: "Refunded",
    createdAt: "2024-03-09",
  },
]);

// Computed
const filteredBookings = computed(() => {
  return bookings.value.filter((booking) => {
    const matchSearch =
      !filters.value.search ||
      booking.id.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      booking.guest
        .toLowerCase()
        .includes(filters.value.search.toLowerCase()) ||
      booking.hotel.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchStatus =
      !filters.value.status || booking.status === filters.value.status;
    const matchHotel =
      !filters.value.hotel ||
      booking.hotel ===
        hotelOptions.value.find((h) => h.id === filters.value.hotel)?.name;

    return matchSearch && matchStatus && matchHotel;
  });
});

// Methods
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusSeverity(status: string) {
  const severityMap: Record<string, string> = {
    Confirmed: "info",
    Pending: "warn",
    Completed: "success",
    Cancelled: "danger",
  };
  return severityMap[status] || "secondary";
}

function viewBooking(booking: any) {
  selectedBooking.value = booking;
  viewDialog.value = true;
}

function updateStatus(booking: any) {
  toast.add({
    severity: "success",
    summary: "Status Updated",
    detail: `Booking ${booking.id} status changed to ${booking.status}`,
    life: 3000,
  });
}

function printInvoice(booking: any) {
  toast.add({
    severity: "info",
    summary: "Printing",
    detail: `Printing invoice for ${booking.id}`,
    life: 3000,
  });
}

function sendEmail(booking: any) {
  toast.add({
    severity: "info",
    summary: "Email Sent",
    detail: `Email sent to ${booking.guestEmail}`,
    life: 3000,
  });
}

function exportData() {
  toast.add({
    severity: "info",
    summary: "Export",
    detail: "Exporting bookings data...",
    life: 3000,
  });
}
</script>

<style scoped>
:deep(.p-datatable) {
  background: transparent;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--admin-table-header-bg);
  border-color: var(--admin-table-border);
  color: var(--admin-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background: transparent;
  border-color: var(--admin-table-border);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: var(--admin-table-row-hover);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: var(--admin-table-border);
  color: var(--admin-text-color);
}
</style>
