<template>
  <div class="w-60 bg-gray-100 p-4">
    <!-- Header -->
    <h2 class="text-xl font-bold text-gray-900 mb-6">Filter By</h2>

    <!-- Budget For Per Night -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">
        Your Budget For Per Night
      </h3>

      <Slider
        v-model="localBudgetRange"
        :min="0"
        :max="500"
        :step="10"
        range
        class="mb-4"
        @change="emitPriceChange"
      />

      <div class="flex gap-2">
        <InputGroup>
          <InputNumber
            v-model="localBudgetRange[0]"
            inputId="minprice"
            prefix="$"
            class="w-20"
            :min="0"
            :max="localBudgetRange[1]"
            @update:modelValue="emitPriceChange"
          />
        </InputGroup>
        <InputGroup>
          <InputNumber
            v-model="localBudgetRange[1]"
            inputId="maxprice"
            prefix="$"
            class="w-20"
            :min="localBudgetRange[0]"
            :max="500"
            @update:modelValue="emitPriceChange"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Popular Filters -->
    <div class="p-4">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Popular Filters</h3>

      <div class="flex flex-col gap-2">
        <div
          v-for="item in popularFilterOptions"
          :key="item.value"
          class="flex items-center gap-2"
        >
          <Checkbox
            v-model="localPopularFilters"
            :inputId="item.value"
            :value="item.value"
            @change="emitFiltersChange"
          />
          <label :for="item.value" class="text-sm text-gray-700">
            {{ item.label }}
          </label>
        </div>
      </div>
    </div>

    <!-- Room Facilities -->
    <div class="mb-6 p-4">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Room Facilities</h3>

      <div class="flex flex-col gap-2">
        <div
          v-for="item in displayedFacilities"
          :key="item.id"
          class="flex items-center"
        >
          <Checkbox
            v-model="localRoomFacilities"
            :inputId="'facility-' + item.id"
            :value="item.id"
            @change="emitFiltersChange"
          />

          <label
            :for="'facility-' + item.id"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            {{ item.name }}
          </label>
        </div>
      </div>

      <button
        class="text-sm text-blue-600 mt-2 flex items-center gap-1"
        @click="showMore = !showMore"
      >
        {{ showMore ? "Show Less" : "Show More" }}
        <i :class="showMore ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Slider from "primevue/slider";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";

// Props
interface Props {
  minPrice?: number;
  maxPrice?: number;
  facilities?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  minPrice: 0,
  maxPrice: 500,
  facilities: () => [],
});

// Emits
const emit = defineEmits<{
  filterChange: [
    filters: {
      minPrice?: number;
      maxPrice?: number;
      facilities: number[];
    }
  ];
}>();

// Local state
const localBudgetRange = ref([props.minPrice, props.maxPrice]);
const localPopularFilters = ref<string[]>([]);
const localRoomFacilities = ref<number[]>(props.facilities);
const showMore = ref(false);

const displayedFacilities = computed(() =>
  showMore.value ? allFacilities.value : allFacilities.value.slice(0, 5)
);

// Emit changes
const emitPriceChange = () => {
  emit("filterChange", {
    minPrice: localBudgetRange.value[0],
    maxPrice: localBudgetRange.value[1],
    facilities: localRoomFacilities.value,
  });
};

const emitFiltersChange = () => {
  emit("filterChange", {
    minPrice: localBudgetRange.value[0],
    maxPrice: localBudgetRange.value[1],
    facilities: localRoomFacilities.value,
  });
};

const popularFilterOptions = [
  { value: "breakfast", label: "Breakfast Included" },
  { value: "inclusive", label: "All-Inclusive" },
  { value: "cancellation", label: "Free Cancellation" },
  { value: "pool", label: "Pool" },
  { value: "petFriendly", label: "Pet Friendly" },
];

const allFacilities = ref([
  { id: 1, name: "Own Bathroom" },
  { id: 2, name: "Kitchen" },
  { id: 3, name: "Sea View" },
  { id: 4, name: "Baby Bed" },
  { id: 5, name: "Bathtub" },
  { id: 6, name: "Air Conditioning" },
  { id: 7, name: "Balcony" },
  { id: 8, name: "Mini Bar" },
  { id: 9, name: "Safe Box" },
  { id: 10, name: "TV" },
  { id: 11, name: "WiFi" },
  { id: 12, name: "Coffee Maker" },
]);
</script>
