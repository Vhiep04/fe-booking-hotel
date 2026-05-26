import { defineStore } from "pinia";
import { useApiStore } from "#imports";
import type {
  DeleteResponse,
  UploadMultipleResponse,
  UploadResponse,
} from "./interfaces/upload";

export const useUploadStore = defineStore("upload", () => {
  const apiStore = useApiStore();

  async function uploadImage(file: File, folder: string) {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("Folder", folder);

    return await apiStore.apiRequest<UploadResponse>({
      endpoint: "api/upload/image",
      method: "POST",
      data: formData as any,
      auth: true,
    });
  }

  async function deleteImage(publicId: string) {
    return await apiStore.apiRequest<DeleteResponse>({
      endpoint: `api/upload/image?publicId=${encodeURIComponent(publicId)}`,
      method: "DELETE",
      auth: true,
    });
  }

  async function uploadImages(files: File[], folder: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append("Files", file));
    formData.append("Folder", folder);

    return await apiStore.apiRequest<UploadMultipleResponse>({
      endpoint: "api/upload/images",
      method: "POST",
      data: formData as any,
      auth: true,
    });
  }

  return {
    uploadImage,
    deleteImage,
    uploadImages,
  };
});
