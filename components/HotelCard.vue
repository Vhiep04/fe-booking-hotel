<template>
  <Card
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

      <!-- Heart / Favourite Button -->
      <button
        class="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-white"
        :class="{ '!opacity-100': isFavourited }"
        :disabled="favouriteStore.isLoading"
        @click.stop="handleToggleFavourite"
      >
        <i
          :class="[
            'pi text-base transition-colors duration-200',
            isFavourited
              ? 'pi-heart-fill text-blue-500'
              : 'pi-heart text-slate-400',
          ]"
        />
      </button>
    </template>

    <template #title>
      <span class="font-bold">{{ props.cityName }}</span>
    </template>
    <template #subtitle>{{ props.location }}</template>
    <template #content>
      <p class="m-0 line-clamp-2">{{ props.description }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Card from "primevue/card";
import { useRouter } from "vue-router";

interface Props {
  hotelId: number;
  cityName: string;
  country?: string;
  location: string;
  imgUrl: string;
  description: string;
}

const props = defineProps<Props>();

const router = useRouter();
const favouriteStore = useFavouriteHotelStore();

const isFavourited = computed(() => favouriteStore.isFavourited(props.hotelId));

async function handleToggleFavourite() {
  await favouriteStore.toggleFavourite(props.hotelId);
}

function goToHotel() {
  router.push(`/hotels/${props.hotelId}`);
}
</script>
