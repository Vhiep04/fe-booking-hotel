<template>
  <div class="relative">
    <button
      @click="toggle"
      class="flex items-center bg-white gap-2 px-2.5 py-1 pl-1 border border-gray-200 rounded-full hover:bg-gray-50 transition-all max-h-10"
    >
      <img
        :src="avatarImage"
        alt="User Avatar"
        class="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
      />
      <div class="text-xs text-gray-600">{{ fullName }}</div>
      <svg
        class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
        :class="{ '-rotate-180': open }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Menu ref="menu" :model="menuItems" :popup="true" class="w-[250px]">
      <template #start>
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <img
              :src="avatarImage"
              alt="User Avatar"
              class="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
            />
            <div>
              <div class="font-semibold text-gray-800">{{ fullName }}</div>
              <div class="text-sm text-gray-500">{{ email }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #item="{ item }">
        <a
          @click="item.command?.({ originalEvent: $event, item })"
          class="flex items-center w-full px-6 py-3 hover:bg-gray-300 cursor-pointer transition-colors"
          :class="{
            'bg-blue-600 text-white hover:bg-blue-800!':
              item.route && route.path === item.route,
          }"
        >
          <i :class="item.icon" class="mr-3" style="font-size: 1rem"></i>
          <span class="flex-1 font-medium">{{ item.label }}</span>
          <i v-if="item.showArrow" class="pi pi-chevron-right text-base"></i>
        </a>
      </template>

      <template #end>
        <div class="border-t border-gray-200">
          <a
            @click="handleSignOut"
            class="flex items-center w-full px-6 py-3 hover:bg-gray-300 cursor-pointer transition-colors text-blue-600"
          >
            <i class="pi pi-sign-out mr-3" style="font-size: 1rem"></i>
            <span class="font-medium">Sign Out</span>
          </a>
        </div>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";

interface Props {
  fullName: string;
  email: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}
const open = ref(false);

const toggle = (event: Event) => {
  open.value = !open.value;
  menu.value.toggle(event);
};

const router = useRouter();
const route = useRoute();

const props = defineProps<Props>();

const emit = defineEmits<{
  signOut: [];
}>();

const menu = ref();

const avatarImage = computed(() => {
  if (props.avatarUrl) return props.avatarUrl;
  return "/assets/images/avt-df.jpg";
});

const menuItems = computed<MenuItem[]>(() => [
  {
    label: "My Account",
    icon: "pi pi-user",
    showArrow: true,
    route: "/user-info",
    command: () => router.push("/user-info"),
  },
  ...(!props.isAdmin
    ? [
        {
          label: "My Reservations",
          icon: "pi pi-calendar",
          showArrow: true,
          route: "/reservation",
          command: () => router.push("/reservation"),
        },
      ]
    : []),
]);

const handleSignOut = () => {
  emit("signOut");
};
</script>

<style scoped>
:deep(.p-menu) {
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0;
  border-radius: 0;
}

:deep(.p-menu-list) {
  max-width: 100px !important;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background: transparent;
}
</style>
