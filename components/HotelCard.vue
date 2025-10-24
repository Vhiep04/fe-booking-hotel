<template>
  <Card
    style="width: 20rem; overflow: hidden"
    class="relative group hover:cursor-pointer hover:bg-gray-100"
  >
    <template #header>
      <img alt="user header" src="../assets/images/barca.jpg" />
      <img
        src="../assets/icons/Heart.svg"
        alt=""
        class="absolute top-2 left-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-white"
      />
    </template>
    <template #title>BERLIN</template>
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
