<template>
  <div class="bg-gray-100 min-h-screen">
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
import Footer from "~/components/Footer.vue";
</script>
