<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg w-[90%] max-w-3xl relative">
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="font-semibold text-lg">{{ name }}</h3>
          <button
            class="text-gray-500 hover:text-black"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- Map -->
        <div class="p-4">
          <MapView
            v-if="open"
            :latitude="lat"
            :longitude="lng"
            :location-name="name"
            :zoom="15"
            class="!w-full !h-[400px]"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import MapView from '../shared/MapView.vue';

defineProps<{
  open: boolean;
  lat: number;
  lng: number;
  name: string;
}>();

defineEmits(["close"]);
</script>
