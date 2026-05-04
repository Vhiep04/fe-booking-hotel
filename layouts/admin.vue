<template>
  <div class="layout-admin-wrapper" :class="containerClass">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Container -->
    <div class="layout-main-container">
      <!-- Topbar -->
      <AppTopbar />

      <!-- Main Content -->
      <main class="layout-main">
        <slot />
      </main>

      <!-- Footer -->
      <!-- <AppFooter /> -->
    </div>

    <!-- Mobile Overlay -->
    <div v-if="mobileMenuActive" class="layout-mask" @click="hideSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from "~/components/admin/AppSidebar.vue";
import AppTopbar from "~/components/admin/AppTopbar.vue";
import AppFooter from "~/components/admin/AppFooter.vue";
import { useAdminLayoutStore } from "~/stores/admin/layout";

const layoutStore = useAdminLayoutStore();

const containerClass = computed(() => layoutStore.containerClass);
const mobileMenuActive = computed(() => layoutStore.mobileMenuActive);

function hideSidebar() {
  layoutStore.hideSidebar();
}

// Initialize dark mode preference on mount
onMounted(() => {
  layoutStore.loadDarkModePreference();
});

// Handle window resize
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth > 991) {
      layoutStore.hideSidebar();
    }
  };

  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});

// Add admin CSS
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/primeicons/primeicons.css",
    },
  ],
});
</script>

<style>
@import "~/assets/css/admin/theme.css";
@import "~/assets/css/admin/layout.css";
</style>
