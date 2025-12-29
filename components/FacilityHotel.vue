<template>
  <div class="w-60 bg-gray-100 p-4 rounded-lg">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Filter By</h2>

    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">
        Your Budget For Per Night
      </h3>

      <Slider
        v-model="localBudgetRange"
        :min="0"
        :max="25000000"
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
            :max="25000000"
            @update:modelValue="emitPriceChange"
          />
        </InputGroup>
      </div>
    </div>

    <!-- Room Facilities -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Room Facilities</h3>

      <div class="flex flex-col gap-2">
        <div
          v-for="item in displayedFacilities"
          :key="item.facilityId"
          class="flex items-center"
        >
          <Checkbox
            v-model="localRoomFacilities"
            :inputId="'facility-' + item.facilityId"
            :value="item.facilityId"
            @change="emitFiltersChange"
          />

          <label
            :for="'facility-' + item.facilityId"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            {{ item.name }}
          </label>
        </div>
      </div>

      <button
        v-if="facilities && facilities.length > 5"
        class="text-sm text-blue-600 mt-2 flex items-center gap-1 hover:text-blue-700"
        @click="showMore = !showMore"
      >
        {{ showMore ? "Show Less" : "Show More" }}
        <i :class="showMore ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
      </button>
    </div>

    <!-- Reset Filters Button -->
    <button
      class="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
      @click="resetFilters"
    >
      Reset Filters
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Slider from "primevue/slider";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import { useFacilityStore } from "~/stores/facilityList";

const facilityStore = useFacilityStore();

// Props
interface Props {
  minPrice?: number;
  maxPrice?: number;
  facilities?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  minPrice: 0,
  maxPrice: 25000000,
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
const localRoomFacilities = ref<number[]>([]);
const showMore = ref(false);

// Computed
const facilities = computed(() => facilityStore.facilities);

const displayedFacilities = computed(() => {
  const list = facilities.value ?? [];
  return showMore.value ? list : list.slice(0, 5);
});

// Watch props để sync với store
watch(
  () => props.facilities,
  (newFacilities) => {
    localRoomFacilities.value = [...newFacilities];
  },
  { immediate: true }
);

watch(
  () => [props.minPrice, props.maxPrice],
  ([newMin, newMax]) => {
    localBudgetRange.value = [newMin ?? 0, newMax ?? 25000000];
  }
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

const resetFilters = () => {
  localBudgetRange.value = [0, 25000000];
  localRoomFacilities.value = [];
  emitFiltersChange();
};

// Lifecycle
onMounted(() => {
  facilityStore.getFacility();
});
</script>

<style scoped>
:deep(.p-slider .p-slider-range) {
  background: #07689f;
}

:deep(.p-slider .p-slider-handle) {
  border-color: #07689f;
}

:deep(.p-slider .p-slider-handle:hover) {
  border-color: #0a7fbf;
}
</style>
