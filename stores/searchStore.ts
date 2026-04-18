import { defineStore } from "pinia";
import { ref, computed } from "vue";
import dayjs from "dayjs";

export const useSearchStore = defineStore(
  "search",
  () => {
    const checkIn = ref<string | null>(null);
    const checkOut = ref<string | null>(null);
    const cityName = ref("");
    const roomTypeName = ref("");
    const pendingHotelId = ref<number | null>(null);
    const pendingRoomId = ref<number | null>(null);

    const setPendingBooking = (hotelId: number, roomId: number) => {
      pendingHotelId.value = hotelId;
      pendingRoomId.value = roomId;
    };

    const clearPendingBooking = () => {
      pendingHotelId.value = null;
      pendingRoomId.value = null;
    };

    const checkInDate = computed(() =>
      checkIn.value ? dayjs(checkIn.value).toDate() : null,
    );

    const checkOutDate = computed(() =>
      checkOut.value ? dayjs(checkOut.value).toDate() : null,
    );

    const dateRange = computed<[Date, Date] | null>(() => {
      if (checkInDate.value && checkOutDate.value) {
        return [checkInDate.value, checkOutDate.value];
      }
      return null;
    });

    const checkInDateOnly = computed(() => checkIn.value ?? null);
    const checkOutDateOnly = computed(() => checkOut.value ?? null);

    const hasDates = computed(() => !!(checkIn.value && checkOut.value));

    const setDates = (newCheckIn: Date | null, newCheckOut: Date | null) => {
      checkIn.value = newCheckIn
        ? dayjs(newCheckIn).format("YYYY-MM-DD")
        : null;
      checkOut.value = newCheckOut
        ? dayjs(newCheckOut).format("YYYY-MM-DD")
        : null;
    };

    const setDateRange = (dates: [Date, Date] | null) => {
      if (dates?.[0] && dates?.[1]) {
        checkIn.value = dayjs(dates[0]).format("YYYY-MM-DD");
        checkOut.value = dayjs(dates[1]).format("YYYY-MM-DD");
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
      pendingHotelId,
      pendingRoomId,
      setDates,
      setDateRange,
      setCityName,
      setRoomTypeName,
      clearDates,
      clearAll,
      setPendingBooking,
      clearPendingBooking,
    };
  },
  {
    persist: {
      key: "hotel-search",
      storage: process.client ? sessionStorage : undefined,
      pick: [
        "checkIn",
        "checkOut",
        "cityName",
        "roomTypeName",
        "pendingHotelId",
        "pendingRoomId",
      ],
    },
  },
);
