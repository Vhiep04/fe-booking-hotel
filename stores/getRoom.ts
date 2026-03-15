import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "./api";
import type { RoomDetail } from "./interface/response/room";

export const useGetRoomStore = defineStore("getRoom", () => {
  const apiStore = useApiStore();

  const room = ref<RoomDetail | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRoom(hotelId: number, roomId: number) {
    isLoading.value = true;
    error.value = null;
    room.value = null;

    try {
      const response = await apiStore.apiRequest<{
        success: boolean;
        message: string;
        data: RoomDetail;
      }>({
        endpoint: `/Hotels/${hotelId}/rooms/${roomId}`,
        method: "GET",
      });

      if (response?.success) {
        room.value = response.data;
      } else {
        error.value = response?.message ?? "Failed to fetch room";
      }
    } catch (e) {
      error.value = "An error occurred while fetching room details";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  function clearRoom() {
    room.value = null;
    error.value = null;
  }

  return { room, isLoading, error, fetchRoom, clearRoom };
});
