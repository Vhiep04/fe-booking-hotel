<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="sticky top-0 z-50">
      <HeaderPage />
    </div>
    <container>
      <div>
        <NuxtPage />
      </div>
    </container>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import HeaderPage from "~/components/shared/HeaderPage.vue";
</script>
