import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSearchStore = defineStore(
  "search",
  () => {
    const checkIn = ref<string | null>(null);
    const checkOut = ref<string | null>(null);
    const cityName = ref("");
    const roomTypeName = ref("");

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

    const checkInDateOnly = computed(() => {
      if (!checkInDate.value) return null;
      return toDateOnly(checkInDate.value);
    });

    const checkOutDateOnly = computed(() => {
      if (!checkOutDate.value) return null;
      return toDateOnly(checkOutDate.value);
    });

    const hasDates = computed(() => {
      return !!(checkIn.value && checkOut.value);
    });

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

    const setRoomTypeName = (type: string) => {
      roomTypeName.value = type;
    };

    const clearDates = () => {
      checkIn.value = null;
      checkOut.value = null;
    };

    const clearAll = () => {
      checkIn.value = null;
      checkOut.value = null;
      cityName.value = "";
      roomTypeName.value = "";
    };

    return {
      checkIn,
      checkOut,
      cityName,

      roomTypeName,
      checkInDate,
      checkOutDate,
      dateRange,
      hasDates,
      checkInDateOnly,
      checkOutDateOnly,

      setDates,
      setDateRange,
      setCityName,
      setRoomTypeName,
      clearDates,
      clearAll,
    };
  },
  {
    persist: {
      key: "hotel-search",
      storage: process.client ? sessionStorage : undefined,
      pick: ["checkIn", "checkOut", "cityName", "roomTypeName"],
    },
  },
);
