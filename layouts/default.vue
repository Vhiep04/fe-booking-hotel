<template>
  <div class="bg-gray-100">
    <HeaderPage />
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
