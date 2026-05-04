<script setup lang="ts">
const route = useRoute();

const menuItems = [
  { label: "Dashboard", icon: "pi pi-home", to: "/admin" },
  { label: "Hotels", icon: "pi pi-building", to: "/admin/hotels" },
  { label: "Rooms", icon: "pi pi-th-large", to: "/admin/rooms" },
  { label: "Facilities", icon: "pi pi-cog", to: "/admin/facilities" },
  { label: "Users", icon: "pi pi-users", to: "/admin/users" },
  { label: "Bookings", icon: "pi pi-calendar", to: "/admin/bookings" },
  { label: "Settings", icon: "pi pi-sliders-h", to: "/admin/settings" },
];

const sidebarCollapsed = ref(false);

const isActive = (to: string) => {
  if (to === "/admin") {
    return route.path === "/admin";
  }
  return route.path.startsWith(to);
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 border-b border-gray-200">
        <i class="pi pi-building text-2xl text-blue-600" />
        <span v-if="!sidebarCollapsed" class="font-bold text-xl text-gray-900">
          Hotel Admin
        </span>
      </div>

      <!-- Menu -->
      <nav class="p-3 space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            isActive(item.to)
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <i :class="[item.icon, 'text-lg']" />
          <span v-if="!sidebarCollapsed" class="font-medium">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Collapse Button -->
      <button
        class="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <i
          :class="[
            'pi text-gray-500',
            sidebarCollapsed ? 'pi-angle-right' : 'pi-angle-left',
          ]"
        />
      </button>
    </aside>

    <!-- Main Content -->
    <main
      :class="[
        'flex-1 transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64',
      ]"
    >
      <!-- Header -->
      <header
        class="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
      >
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-semibold text-gray-900">
            {{
              menuItems.find((item) => isActive(item.to))?.label || "Dashboard"
            }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <Button icon="pi pi-bell" severity="secondary" text rounded />
          <Button icon="pi pi-user" severity="secondary" text rounded />
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
