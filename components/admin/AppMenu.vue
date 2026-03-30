<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <li v-if="item.separator" class="my-3 mx-4 border-t border-[var(--admin-sidebar-border)]"></li>
      <AppMenuItem
        v-else
        :item="item"
        :index="i"
      />
    </template>
  </ul>
</template>

<script setup lang="ts">
import AppMenuItem from './AppMenuItem.vue'

interface MenuItem {
  label: string
  icon?: string
  to?: string
  items?: MenuItem[]
  badge?: string | number
  badgeClass?: string
  separator?: boolean
  visible?: boolean
}

defineProps<{
  model: MenuItem[]
}>()
</script>
