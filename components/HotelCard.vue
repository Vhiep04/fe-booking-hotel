<template>
  <Card
    style="width: 18rem"
    class="relative group hover:cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 border border-transparent hover:border-gray-200"
    @click="goToHotel"
  >
    <template #header>
      <div class="overflow-hidden">
        <img
          :src="props.imgUrl"
          alt="Hotel Image"
          class="w-full h-50 object-cover rounded transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <img
        src="../assets/icons/Heart.svg"
        alt="heart"
        class="absolute top-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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

const router = useRouter();

interface Props {
  hotelId: number;
  cityName: string;
  country?: string;
  location: string;
  imgUrl: string;
  description: string;
}

const props = defineProps<Props>();

const goToHotel = () => {
  router.push(`/hotels/${props.hotelId}`);
};
</script>
