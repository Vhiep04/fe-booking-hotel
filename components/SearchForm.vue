<template>
  <div class="space-y-2">
    <div
      class="h-[50px] w-[1190px] grid grid-cols-4 lg:grid-cols-[40%_30%_20%_10%]"
    >
      <CustomInputText
        id="search_global"
        v-model="localSearch"
        type="text"
        placeholder="Where are you going to ?"
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

      <Calendar
        v-model="localDates"
        selectionMode="range"
        dateFormat="dd/mm/yy"
        placeholder="Check In Date - Check Out Date"
        showIcon
        inputClass="w-full"
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

      <Select
        v-model="localRoomType"
        :options="rooms"
        optionLabel="name"
        placeholder="Select Room Type"
        checkmark
        :highlightOnSelect="true"
      >
        <template #dropdownicon>
          <img src="../assets/icons/people-plus-one.svg" alt="" />
        </template>
      </Select>

      <Button
        type="submit"
        label="Search"
        class="w-full h-full text-white mb-4 bg-[#07689F]! hover:bg-[#0A7FBF]! border-none!"
        severity="info"
        @click="handleSearch"
      />
    </div>

    <!-- Error Messages -->
    <div
      class="w-[1190px] grid grid-cols-4 lg:grid-cols-[40%_30%_20%_10%] gap-0"
    >
      <div class="text-red-500 text-sm px-4 min-h-[20px]">
        {{ errors.search }}
      </div>
      <div class="text-red-500 text-sm px-4 min-h-[20px]">
        {{ errors.dates }}
      </div>
      <div class="text-red-500 text-sm px-4 min-h-[20px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import CustomInputText from "./shared/CustomInputText.vue";
import Calendar from "primevue/calendar";
import Select from "primevue/select";
import Button from "primevue/button";

// Props để nhận initial values từ store (nếu cần)
interface Props {
  initialKeyword?: string;
  initialDates?: [Date, Date] | null;
  initialRoomType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialKeyword: "",
  initialDates: null,
  initialRoomType: "",
});

// Emits
const emit = defineEmits<{
  search: [
    params: {
      keyword: string;
      checkInDate: Date | null;
      checkOutDate: Date | null;
      bedType: string;
    }
  ];
}>();

// Local state
const localSearch = ref(props.initialKeyword);
const localDates = ref<[Date, Date] | null>(props.initialDates);
const localRoomType = ref();

const errors = reactive({
  search: "",
  dates: "",
});

const rooms = ref([
  { name: "King Bed", code: "kb" },
  { name: "Two Single Beds", code: "tsb" },
  { name: "Single Beds", code: "sb" },
  { name: "Double Beds", code: "db" },
  { name: "Family Suite", code: "fs" },
]);

const validateForm = (): boolean => {
  let isValid = true;

  errors.search = "";
  errors.dates = "";

  if (!localSearch.value || localSearch.value.trim() === "") {
    errors.search = "Please enter a destination";
    isValid = false;
  }

  if (!localDates.value || !localDates.value[0] || !localDates.value[1]) {
    errors.dates = "Please select check-in and check-out dates";
    isValid = false;
  } else {
    const checkIn = new Date(localDates.value[0]);
    const checkOut = new Date(localDates.value[1]);

    if (checkOut <= checkIn) {
      errors.dates = "Check-out date must be after check-in date";
      isValid = false;
    }
  }

  return isValid;
};

const handleSearch = () => {
  if (!validateForm()) return;

  emit("search", {
    keyword: localSearch.value,
    checkInDate: localDates.value?.[0] ?? null,
    checkOutDate: localDates.value?.[1] ?? null,
    bedType: localRoomType.value?.code ?? "",
  });
};

const clearSearch = () => {
  localSearch.value = "";
  errors.search = "";
};
</script>

<style scoped>
:deep(.p-invalid .p-inputtext) {
  border-color: #ef4444 !important;
}

:deep(.p-invalid .p-inputtext:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
}
</style>
