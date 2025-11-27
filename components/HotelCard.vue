<template>
  <Card
    style="width: 18rem; overflow: hidden"
    class="relative group hover:cursor-pointer hover:bg-gray-100"
  >
    <template #header>
      <img
        :src="props.imgUrl"
        alt="Hotel Image"
        class="w-full h-50 object-cover rounded"
      />
      <img
        src="../assets/icons/Heart.svg"
        alt="heart"
        class="absolute top-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-white"
      />
    </template>
    <template #title class="font-bold">{{ props.cityName }}</template>
    <template #subtitle>{{ props.location }}</template>
    <template #content>
      <p class="m-0 line-clamp-2">
        {{ props.description }}
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";

interface Props {
  cityName: string;
  country?: string;
  location: string;
  imgUrl: string;
  description: string;
}

const props = defineProps<Props>();
</script>
