<template>
  <div class="space-y-2">
    <div
      class="grid border-3 border-[#FFB700] rounded-lg w-full bg-[#FFB700] grid-cols-1"
      :class="[
        hideLocation
          ? 'sm:grid-cols-2 lg:grid-cols-[45%_35%_20%]'
          : 'sm:grid-cols-2 lg:grid-cols-[40%_30%_20%_10%]',
      ]"
    >
      <div
        v-if="!hideLocation"
        class="border-2 border-[#FFB700] rounded-lg inline-flex items-center"
      >
        <CustomInputText
          class="w-full"
          id="search_global"
          v-model="searchStore.cityName"
          type="text"
          :placeholder="t('Where are you going to ?')"
          :show-clear="true"
          :invalid="!!errors.search"
          @clear="clearSearch"
          height="50px"
          @focus="errors.search = ''"
        >
          <template #icon>
            <img src="../assets/icons/hotel.svg" alt="" />
          </template>
        </CustomInputText>
      </div>

      <div
        class="border-2 border-[#FFB700] rounded-lg inline-flex items-center"
      >
        <Calendar
          class="w-full"
          v-model="localDates"
          selectionMode="range"
          dateFormat="dd/mm/yy"
          :placeholder="t('Check In Date - Check Out Date')"
          showIcon
          inputClass="w-full h-[50px]"
          :class="{ 'p-invalid': !!errors.dates }"
          @focus="errors.dates = ''"
        >
          <template #dropdownicon>
            <img
              src="../assets/icons/calendar.svg"
              alt="calendar"
              class="w-5 h-5"
            />
          </template>
        </Calendar>
      </div>

      <div
        class="border-2 border-[#FFB700] rounded-lg inline-flex items-center"
      >
        <Select
          v-model="localRoomType"
          :options="rooms"
          optionLabel="name"
          :placeholder="t('Select Room Type')"
          class="h-[50px] w-full"
          checkmark
          :highlightOnSelect="true"
        >
          <template #dropdownicon>
            <img src="../assets/icons/people-plus-one.svg" alt="" />
          </template>
        </Select>
      </div>

      <div
        class="border-2 border-[#FFB700] rounded-lg inline-flex sm:col-span-2 lg:col-span-1"
      >
        <Button
          type="submit"
          :label="t('Search')"
          class="custom-btn-search h-[50px] w-full px-8 text-white bg-[#07689F]! hover:bg-[#0A7FBF]! border-none!"
          :loading="loading"
          @click="handleSearch"
        />
      </div>
    </div>

    <div
      class="w-full grid grid-cols-1 gap-0"
      :class="[
        hideLocation
          ? 'sm:grid-cols-2 lg:grid-cols-[45%_35%_20%]'
          : 'sm:grid-cols-2 lg:grid-cols-[40%_30%_20%_10%]',
      ]"
    >
      <div v-if="!hideLocation" class="text-red-500 text-sm px-4 min-h-5">
        {{ errors.search }}
      </div>
      <div
        class="text-red-500 text-sm px-4 min-h-5 sm:col-span-2 lg:col-span-1"
      >
        {{ errors.dates }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import CustomInputText from "./shared/CustomInputText.vue";
import Calendar from "primevue/calendar";
import Select from "primevue/select";
import Button from "primevue/button";
import { toDateOnly } from "#imports";
import { useSearchStore } from "~/stores/searchStore";
import { useI18n } from "#imports";

const { t } = useI18n();

interface Props {
  loading: boolean;
  hideLocation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hideLocation: false,
});

const emit = defineEmits<{
  search: [params: any];
  getCity: [params: any];
}>();

const searchStore = useSearchStore();
const cityStore = useCityStore();

const localDates = computed({
  get: () => searchStore.dateRange,
  set: (val) => searchStore.setDateRange(val),
});

const localRoomType = ref();

const errors = reactive({
  search: "",
  dates: "",
});

const rooms = computed(() =>
  cityStore.roomTypes.map((rt) => ({
    name: t(rt.typeName),
    code: rt.typeName,
  })),
);

const validateForm = (): boolean => {
  let isValid = true;
  errors.search = "";
  errors.dates = "";

  if (!props.hideLocation) {
    if (!searchStore.cityName || searchStore.cityName.trim() === "") {
      errors.search = "Please enter a destination";
      isValid = false;
    }
  }

  if (!searchStore.hasDates) {
    errors.dates = "Please select check-in and check-out dates";
    isValid = false;
  } else {
    const dates = searchStore.dateRange;
    if (!dates || !dates[0] || !dates[1]) {
      errors.dates = "Please select both check-in and check-out dates";
      isValid = false;
    } else {
      const checkIn = new Date(dates[0]);
      const checkOut = new Date(dates[1]);
      if (checkOut <= checkIn) {
        errors.dates = "Check-out date must be after check-in date";
        isValid = false;
      }
    }
  }

  return isValid;
};

const handleSearch = () => {
  if (!validateForm()) return;

  if (localRoomType.value?.code) {
    searchStore.setRoomTypeName(localRoomType.value.code);
  }

  emit("search", {
    cityName: searchStore.cityName,
    checkIn: searchStore.checkInDateOnly,
    checkOut: searchStore.checkOutDateOnly,
    roomTypeName: localRoomType.value?.code ?? "",
  });

  emit("getCity", {
    name: searchStore.cityName,
  });
};

const clearSearch = () => {
  searchStore.setCityName("");
  errors.search = "";
};

onMounted(() => {
  cityStore.fetchRoomTypes();
});
</script>

<style scoped>
:deep(.p-invalid .p-inputtext) {
  border-color: #ef4444 !important;
}

:deep(.p-invalid .p-inputtext:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
}
:deep(.custom-btn-search) {
  position: relative;
  background-color: #07689f !important;
  opacity: 1 !important;
  overflow: hidden;
}

:deep(.custom-btn-search.p-button-loading) {
  background-color: #ffffff !important;
}

:deep(.custom-btn-search:hover) {
  background-color: #0a7fbf !important;
}
</style>
