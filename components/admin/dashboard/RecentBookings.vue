<template>
  <div class="admin-card">
    <div class="admin-card-header flex items-center justify-between">
      <h3 class="admin-card-title">Recent Bookings</h3>
      <NuxtLink
        to="/admin/bookings"
        class="text-sm text-[var(--admin-primary)] hover:underline"
      >
        View All
      </NuxtLink>
    </div>
    <div class="overflow-x-auto">
      <DataTable
        :value="recentBookings"
        :rows="5"
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column field="id" header="Booking ID" style="min-width: 120px">
          <template #body="{ data }">
            <span class="font-medium text-[var(--admin-primary)]">
              #{{ data.id }}
            </span>
          </template>
        </Column>

        <Column field="hotel" header="Hotel" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <img
                :src="data.hotelImage"
                :alt="data.hotel"
                class="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p class="font-medium text-[var(--admin-text-color)]">
                  {{ data.hotel }}
                </p>
                <p class="text-xs text-[var(--admin-text-muted)]">
                  {{ data.city }}
                </p>
              </div>
            </div>
          </template>
        </Column>

        <Column field="guest" header="Guest" style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar
                :label="data.guest.charAt(0)"
                shape="circle"
                size="small"
              />
              <span>{{ data.guest }}</span>
            </div>
          </template>
        </Column>

        <Column field="checkIn" header="Check-in" style="min-width: 120px">
          <template #body="{ data }">
            <span>{{ formatDate(data.checkIn) }}</span>
          </template>
        </Column>

        <Column field="checkOut" header="Check-out" style="min-width: 120px">
          <template #body="{ data }">
            <span>{{ formatDate(data.checkOut) }}</span>
          </template>
        </Column>

        <Column field="amount" header="Amount" style="min-width: 100px">
          <template #body="{ data }">
            <span class="font-semibold">
              ${{ data.amount.toLocaleString() }}
            </span>
          </template>
        </Column>

        <Column field="status" header="Status" style="min-width: 120px">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
            />
          </template>
        </Column>

        <Column header="Actions" style="min-width: 100px">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                size="small"
                @click="viewBooking(data)"
              />
              <Button
                icon="pi pi-ellipsis-v"
                severity="secondary"
                text
                rounded
                size="small"
                @click="toggleMenu($event, data)"
              />
            </div>
            <Menu ref="menu" :model="menuItems" popup />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

const menu = ref()
const selectedBooking = ref<any>(null)

// Mock data - replace with real API data
const recentBookings = ref([
  {
    id: 'BK-2024-001',
    hotel: 'Grand Plaza Hotel',
    hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
    city: 'New York',
    guest: 'John Smith',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    amount: 450,
    status: 'Confirmed'
  },
  {
    id: 'BK-2024-002',
    hotel: 'Seaside Resort',
    hotelImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&h=100&fit=crop',
    city: 'Miami',
    guest: 'Sarah Johnson',
    checkIn: '2024-03-16',
    checkOut: '2024-03-20',
    amount: 820,
    status: 'Pending'
  },
  {
    id: 'BK-2024-003',
    hotel: 'Mountain Lodge',
    hotelImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100&h=100&fit=crop',
    city: 'Denver',
    guest: 'Mike Wilson',
    checkIn: '2024-03-14',
    checkOut: '2024-03-16',
    amount: 280,
    status: 'Completed'
  },
  {
    id: 'BK-2024-004',
    hotel: 'City Center Inn',
    hotelImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=100&h=100&fit=crop',
    city: 'Chicago',
    guest: 'Emily Brown',
    checkIn: '2024-03-17',
    checkOut: '2024-03-19',
    amount: 340,
    status: 'Confirmed'
  },
  {
    id: 'BK-2024-005',
    hotel: 'Beachfront Villa',
    hotelImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=100&h=100&fit=crop',
    city: 'Los Angeles',
    guest: 'David Lee',
    checkIn: '2024-03-18',
    checkOut: '2024-03-22',
    amount: 1200,
    status: 'Cancelled'
  }
])

const menuItems = [
  {
    label: 'View Details',
    icon: 'pi pi-eye',
    command: () => viewBooking(selectedBooking.value)
  },
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => editBooking(selectedBooking.value)
  },
  { separator: true },
  {
    label: 'Cancel Booking',
    icon: 'pi pi-times',
    command: () => cancelBooking(selectedBooking.value)
  }
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getStatusSeverity(status: string) {
  const severityMap: Record<string, string> = {
    Confirmed: 'info',
    Pending: 'warn',
    Completed: 'success',
    Cancelled: 'danger'
  }
  return severityMap[status] || 'secondary'
}

function viewBooking(booking: any) {
  navigateTo(`/admin/bookings/${booking.id}`)
}

function editBooking(booking: any) {
  navigateTo(`/admin/bookings/${booking.id}/edit`)
}

function cancelBooking(booking: any) {
  // TODO: Implement cancel booking logic
  console.log('Cancel booking:', booking.id)
}

function toggleMenu(event: Event, booking: any) {
  selectedBooking.value = booking
  menu.value.toggle(event)
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
