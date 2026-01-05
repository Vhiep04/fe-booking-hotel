// stores/searchStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSearchStore = defineStore(
  "search",
  () => {
    // State
    const checkIn = ref<string | null>(null);
    const checkOut = ref<string | null>(null);
    const cityName = ref("");
    const bedType = ref("");

    // Getters
    const checkInDate = computed(() => {
      return checkIn.value ? new Date(checkIn.value) : null;
    });

    const checkOutDate = computed(() => {
      return checkOut.value ? new Date(checkOut.value) : null;
    });

    const dateRange = computed<[Date, Date] | null>(() => {
      if (checkInDate.value && checkOutDate.value) {
        return [checkInDate.value, checkOutDate.value];
      }
      return null;
    });

    const hasDates = computed(() => {
      return !!(checkIn.value && checkOut.value);
    });

    // Actions
    const setDates = (newCheckIn: Date | null, newCheckOut: Date | null) => {
      checkIn.value = newCheckIn ? newCheckIn.toISOString() : null;
      checkOut.value = newCheckOut ? newCheckOut.toISOString() : null;
    };

    const setDateRange = (dates: [Date, Date] | null) => {
      if (dates && dates[0] && dates[1]) {
        checkIn.value = dates[0].toISOString();
        checkOut.value = dates[1].toISOString();
      } else {
        checkIn.value = null;
        checkOut.value = null;
      }
    };

    const setCityName = (name: string) => {
      cityName.value = name;
    };

    const setBedType = (type: string) => {
      bedType.value = type;
    };

    const clearDates = () => {
      checkIn.value = null;
      checkOut.value = null;
    };

    const clearAll = () => {
      checkIn.value = null;
      checkOut.value = null;
      cityName.value = "";
      bedType.value = "";
    };

    return {
      // State
      checkIn,
      checkOut,
      cityName,
      bedType,
      // Getters
      checkInDate,
      checkOutDate,
      dateRange,
      hasDates,
      // Actions
      setDates,
      setDateRange,
      setCityName,
      setBedType,
      clearDates,
      clearAll,
    };
  },
  {
    persist: {
      key: "hotel-search",
      storage: process.client ? localStorage : undefined,
      pick: ["checkIn", "checkOut", "cityName", "bedType"],
    },
  }
);
