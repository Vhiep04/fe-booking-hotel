<template>
  <nav class="w-72 shrink-0">
    <ul class="space-y-1">
      <li v-for="item in items" :key="item.key">
        <button
          @click="emit('select', item.key)"
          class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors"
          :class="
            active === item.key
              ? 'text-blue-600 bg-blue-50 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          "
        >
          <i :class="item.icon" class="text-lg w-5" />
          <span>{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface NavItem {
  key: string;
  label: string;
  icon: string;
}

defineProps<{
  items: NavItem[];
  active: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();
</script>
