<template>
  <li
    class="layout-menu-item"
    :class="{ 'active-menuitem': isActiveMenu }"
  >
    <!-- Link without children -->
    <NuxtLink
      v-if="item.to && !item.items"
      :to="item.to"
      class="layout-menuitem-link"
      :class="{ 'router-link-active': isActive }"
      @click="onItemClick"
    >
      <i :class="['layout-menuitem-icon', item.icon]"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <span
        v-if="item.badge"
        class="ml-auto px-2 py-0.5 text-xs rounded-full text-white"
        :class="item.badgeClass || 'bg-blue-500'"
      >
        {{ item.badge }}
      </span>
    </NuxtLink>

    <!-- Link with children (submenu toggle) -->
    <a
      v-else-if="item.items"
      class="layout-menuitem-link"
      tabindex="0"
      @click="toggleSubmenu"
      @keydown.enter="toggleSubmenu"
    >
      <i :class="['layout-menuitem-icon', item.icon]"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-chevron-down layout-submenu-toggler ml-auto text-sm"></i>
    </a>

    <!-- Submenu -->
    <ul
      v-if="item.items"
      class="layout-submenu"
      :style="submenuStyle"
    >
      <AppMenuItem
        v-for="(child, j) in item.items"
        :key="j"
        :item="child"
        :index="j"
        :parent-item-key="itemKey"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { useAdminLayoutStore } from '~/stores/admin/layout'

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

const props = defineProps<{
  item: MenuItem
  index: number
  parentItemKey?: string
}>()

const route = useRoute()
const layoutStore = useAdminLayoutStore()

const isSubmenuActive = ref(false)

const itemKey = computed(() =>
  props.parentItemKey
    ? `${props.parentItemKey}-${props.index}`
    : String(props.index)
)

const isActive = computed(() => {
  if (!props.item.to) return false
  // Handle query params
  const itemPath = props.item.to.split('?')[0]
  return route.path === itemPath
})

const isActiveMenu = computed(() => {
  if (isActive.value) return true
  if (props.item.items) {
    return props.item.items.some(child => {
      if (child.to) {
        const childPath = child.to.split('?')[0]
        return route.path === childPath || route.path.startsWith(childPath + '/')
      }
      return false
    })
  }
  return false
})

// Auto-expand submenu if child is active
watchEffect(() => {
  if (isActiveMenu.value && props.item.items) {
    isSubmenuActive.value = true
  }
})

const submenuStyle = computed(() => {
  if (!props.item.items) return {}
  const itemCount = props.item.items.length
  const maxHeight = isSubmenuActive.value ? `${itemCount * 50}px` : '0'
  return { maxHeight }
})

function toggleSubmenu() {
  isSubmenuActive.value = !isSubmenuActive.value
}

function onItemClick() {
  layoutStore.onMenuItemClick({ originalEvent: new Event('click'), item: props.item })

  // Hide mobile menu after click
  if (window.innerWidth < 992) {
    layoutStore.hideSidebar()
  }
}
</script>
