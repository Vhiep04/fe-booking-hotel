<template>
  <Card
    style="width: 20rem; overflow: hidden"
    class="relative group hover:cursor-pointer hover:bg-gray-100"
  >
    <template #header>
      <div class="p-2">
        <img
          class="rounded"
          alt="user header"
          src="../assets/images/barca.jpg"
        />
      </div>
      <img
        src="../assets/icons/Heart.svg"
        alt="heart"
        class="absolute top-5 left-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-white"
      />
    </template>
    <template #title class="font-bold">BERLIN</template>
    <template #subtitle>SIDE</template>
    <template #content>
      <p class="m-0">
        A tour of the city and its surroundings led by a professional guide..
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
</script>
