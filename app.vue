<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<!-- app.vue -->
<script setup lang="ts">
const authStore = useAuthStore();
authStore.initAuthFromCookie();
</script>
