<template>
  <div class="h-[50px] w-[1190px] grid grid-cols-4 lg:grid-cols-[40%_30%_20%_10%]">
    <CustomInputText
      id="search_global"
      v-model="search"
      type="email"
      placeholder="Where are you going to ?"
      :show-clear="true"
      @clear="clearSearch"
      height="50px"
    >
      <template #icon>
        <img src="../assets/icons/hotel.svg" alt=""></img>
      </template>
    </CustomInputText>
    <Calendar
      v-model="dates"
      selectionMode="range"
      dateFormat="dd/mm/yy"
      placeholder="Check In Date - Check Out Date"
      showIcon
      inputClass="w-full"
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
      v-model="selectedCity"
      :options="rooms"
      optionLabel="name"
      placeholder="Select Room Type"
      checkmark
      :highlightOnSelect="false"
      
    >
      <template #dropdownicon>
        <img src="../assets/icons/people-plus-one.svg" alt="" />
      </template>
    </Select>

    <Button
      type="submit"
      label="Search"
      class="w-full h-full text-white mb-4 !bg-[#07689F] hover:!bg-[#0A7FBF]  !border-none"
      :loading="isLoading"
      severity="info"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomInputText from './shared/CustomInputText.vue'
import Select from 'primevue/select'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'

const search = ref('')
const dates = ref(null)
const isLoading = ref(false)
const selectedCity = ref()

const rooms = ref([
  { name: 'King Bed', code: 'kb' },
  { name: 'Two Single Beds', code: 'tsb' },
  { name: 'Single Beds', code: 'sb' },
  { name: 'Double Beds', code: 'db' },
])

const clearSearch = () => {
  search.value = ''
}
</script>

<style scoped></style>
