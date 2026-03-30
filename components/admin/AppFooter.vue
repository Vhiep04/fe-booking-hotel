<template>
  <div class="layout-footer">
    <span>&copy; {{ currentYear }} Booking Admin. All rights reserved.</span>
    <span class="mx-2">|</span>
    <a href="#" class="text-[var(--admin-primary)] hover:underline">Privacy Policy</a>
    <span class="mx-2">|</span>
    <a href="#" class="text-[var(--admin-primary)] hover:underline">Terms of Service</a>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
