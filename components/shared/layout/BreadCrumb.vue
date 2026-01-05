<template>
  <Breadcrumb :home="home" :model="items" class="breadcrumb">
    <template #item="{ item }">
      <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb-link">
        <i v-if="item.icon" :class="item.icon"></i>
        <span v-if="item.label">{{ item.label }}</span>
      </NuxtLink>

      <span v-else class="breadcrumb-text">
        {{ item.label }}
      </span>
    </template>
  </Breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Breadcrumb from "primevue/breadcrumb";

const props = defineProps<{
  breadcrumbList: {
    title: string;
    path?: string;
  }[];
}>();

const home = computed(() => ({
  icon: "pi pi-home",
  to: "/",
}));

const items = computed(() =>
  props.breadcrumbList.map((item) => ({
    label: item.title,
    to: item.path,
  }))
);
</script>

<style scoped lang="scss">
.breadcrumb {
  font-size: 14px;
  line-height: 2;
}

.breadcrumb-link {
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb-text {
  font-weight: bold;
  color: #6b7280; // text-gray
}
</style>
