<template>
  <div class="w-60 bg-gray-100 p-4">
    <!-- Header -->
    <h2 class="text-xl font-bold text-gray-900 mb-6">Filter By</h2>

    <!-- Budget For Per Night -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">
        Your Budget For Per Night
      </h3>

      <!-- Slider -->
      <Slider
        v-model="budgetRange"
        :min="0"
        :max="500"
        :step="10"
        range
        class="mb-4"
      />

      <!-- Price Inputs -->
      <div class="flex gap-2">
        <InputGroup>
          <InputNumber
            v-model="budgetRange[0]"
            inputId="minprice"
            prefix="$"
            class="w-20"
            :min="0"
            :max="budgetRange[1]"
          />
        </InputGroup>
        <InputGroup>
          <InputNumber
            v-model="budgetRange[1]"
            inputId="maxprice"
            prefix="$"
            class="w-20"
            :min="budgetRange[0]"
            :max="500"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Popular Filters -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Popular Filters</h3>
      <div class="flex flex-col gap-2">
        <div class="flex items-center">
          <Checkbox
            v-model="popularFilters"
            inputId="breakfast"
            value="breakfast"
          />
          <label
            for="breakfast"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Breakfast Included
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="popularFilters"
            inputId="inclusive"
            value="inclusive"
          />
          <label
            for="inclusive"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            All-Inclusive
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="popularFilters"
            inputId="cancellation"
            value="cancellation"
          />
          <label
            for="cancellation"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Free Cancellation
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox v-model="popularFilters" inputId="pool" value="pool" />
          <label for="pool" class="ml-2 text-sm text-gray-700 cursor-pointer">
            Pool
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="popularFilters"
            inputId="petFriendly"
            value="petFriendly"
          />
          <label
            for="petFriendly"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Pet Friendly
          </label>
        </div>
      </div>
    </div>

    <!-- Room Facilities -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Room Facilities</h3>
      <div class="flex flex-col gap-2">
        <div class="flex items-center">
          <Checkbox
            v-model="roomFacilities"
            inputId="bathroom"
            value="bathroom"
          />
          <label
            for="bathroom"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Own Bathroom
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="roomFacilities"
            inputId="kitchen"
            value="kitchen"
          />
          <label
            for="kitchen"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Kitchen
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="roomFacilities"
            inputId="seeView"
            value="seeView"
          />
          <label
            for="seeView"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            See View
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="roomFacilities"
            inputId="babyBed"
            value="babyBed"
          />
          <label
            for="babyBed"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Baby Bed
          </label>
        </div>

        <div class="flex items-center">
          <Checkbox
            v-model="roomFacilities"
            inputId="bathtub"
            value="bathtub"
          />
          <label
            for="bathtub"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Bathtub
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Slider from "primevue/slider";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

// State
const budgetRange = ref([0, 500]);
const popularFilters = ref<string[]>([]);
const roomFacilities = ref<string[]>([]);

// Watch for changes if needed
const emits = defineEmits(["filterChange"]);

// Emit filter changes
const emitFilterChange = () => {
  emits("filterChange", {
    budgetRange: budgetRange.value,
    popularFilters: popularFilters.value,
    roomFacilities: roomFacilities.value,
  });
};
</script>

<style scoped>
/* Custom checkbox styles if needed */
:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>
