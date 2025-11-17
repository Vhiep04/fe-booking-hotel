<template>
  <div class="relative">
    <!-- User Profile Button -->
    <button
      @click="toggle"
      class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <img
        :src="avatarImage"
        alt="User Avatar"
        class="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
      />
      <div class="text-left">
        <div class="text-sm font-semibold text-blue-600">Your Account</div>
        <div class="text-xs text-gray-600">{{ fullName }}</div>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Menu ref="menu" :model="menuItems" :popup="true" class="w-[350px]">
      <template #start>
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <img
              :src="avatarImage"
              alt="User Avatar"
              class="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
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
          @click="handleMenuClick(item)"
          class="flex items-center w-full px-4 py-3 hover:bg-gray-300 cursor-pointer transition-colors"
          :class="{
            'bg-blue-600 text-white hover:!bg-blue-800': item.highlighted,
          }"
        >
          <i :class="item.icon" class="mr-3" style="font-size: 1.2rem"></i>
          <span class="flex-1 font-medium">{{ item.label }}</span>
          <i v-if="item.showArrow" class="pi pi-chevron-right text-xs"></i>
        </a>
      </template>

      <template #end>
        <div class="border-t border-gray-200">
          <a
            @click="handleSignOut"
            class="flex items-center w-full px-4 py-3 hover:bg-gray-300 cursor-pointer transition-colors text-blue-600"
          >
            <i class="pi pi-sign-out mr-3" style="font-size: 1.2rem"></i>
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

interface Props {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  myAccount: [];
  payments: [];
  settings: [];
  support: [];
  signOut: [];
}>();

const menu = ref();

const avatarImage = computed(() => {
  if (props.avatarUrl) {
    return props.avatarUrl;
  }
  return "/assets/images/avt.jpg";
});

const menuItems = ref([
  {
    label: "My Account",
    icon: "pi pi-user",
    showArrow: true,
    highlighted: true,
    command: "myAccount",
  },
  {
    label: "Payments",
    icon: "pi pi-credit-card",
    showArrow: true,
    command: "payments",
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    showArrow: true,
    command: "settings",
  },
  {
    label: "Support",
    icon: "pi pi-question-circle",
    showArrow: true,
    command: "support",
  },
]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const handleMenuClick = (item: any) => {
  if (item.command) {
    emit(item.command as any);
  }
};

const handleSignOut = () => {
  emit("signOut");
};
</script>

<style scoped>
:deep(.p-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0;
  border-radius: 0;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background: transparent;
}
</style>
