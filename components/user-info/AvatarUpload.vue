<template>
  <!-- Avatar trigger -->
  <div class="relative cursor-pointer group" @click="openDialog">
    <!-- Avatar display -->
    <div
      class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold select-none transition-opacity"
      :class="avatarUrl ? '' : 'bg-green-700'"
    >
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        alt="Avatar"
        class="w-full h-full object-cover"
      />
      <span v-else>{{ initials }}</span>
    </div>

    <!-- Camera overlay on hover -->
    <div
      class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <i class="pi pi-camera text-white text-lg" />
    </div>
  </div>

  <!-- Upload dialog -->
  <Dialog
    v-model:visible="visible"
    modal
    header="Update profile photo"
    :style="{ width: '420px' }"
    :draggable="false"
  >
    <div class="flex flex-col items-center gap-5 py-2">
      <!-- Preview -->
      <div
        class="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100"
      >
        <img
          v-if="preview"
          :src="preview"
          alt="Preview"
          class="w-full h-full object-cover"
        />
        <i v-else class="pi pi-user text-gray-400 text-5xl" />
      </div>

      <!-- Drop zone -->
      <div
        class="w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
        :class="
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        "
        @click="triggerInput"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <i class="pi pi-upload text-2xl text-gray-400" />
        <p class="text-sm text-gray-600 font-medium">
          Click to upload or drag & drop
        </p>
        <p class="text-xs text-gray-400">PNG, JPG, WEBP — exactly 300×300px</p>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="handleFileChange"
      />

      <!-- Error message -->
      <Message
        v-if="errorMsg"
        severity="error"
        :closable="false"
        class="w-full"
      >
        {{ errorMsg }}
      </Message>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" text @click="closeDialog" />
        <Button
          label="Save photo"
          :disabled="!preview || !!errorMsg"
          @click="confirmUpload"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Message from "primevue/message";

interface Props {
  initials?: string;
  avatarUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initials: "U",
});

const emit = defineEmits<{
  upload: [file: File, previewUrl: string];
}>();

const visible = ref(false);
const isDragging = ref(false);
const preview = ref<string | null>(null);
const errorMsg = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const pendingFile = ref<File | null>(null);

const REQUIRED_SIZE = 300;

const openDialog = () => {
  preview.value = props.avatarUrl ?? null;
  errorMsg.value = null;
  pendingFile.value = null;
  visible.value = true;
};

const closeDialog = () => {
  visible.value = false;
};

const triggerInput = () => {
  fileInput.value?.click();
};

const validateAndPreview = (file: File) => {
  errorMsg.value = null;
  preview.value = null;
  pendingFile.value = null;

  // Check type
  if (!file.type.startsWith("image/")) {
    errorMsg.value = "Only image files are allowed (PNG, JPG, WEBP).";
    return;
  }

  // Check dimensions via Image element
  const url = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    URL.revokeObjectURL(url);
    if (img.width !== REQUIRED_SIZE || img.height !== REQUIRED_SIZE) {
      errorMsg.value = `Image must be exactly ${REQUIRED_SIZE}×${REQUIRED_SIZE}px. Yours is ${img.width}×${img.height}px.`;
      return;
    }
    // Valid — set preview
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target?.result as string;
      pendingFile.value = file;
    };
    reader.readAsDataURL(file);
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    errorMsg.value = "Unable to read image file.";
  };

  img.src = url;
};

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) validateAndPreview(file);
  // Reset input so same file can be re-selected
  if (fileInput.value) fileInput.value.value = "";
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) validateAndPreview(file);
};

const confirmUpload = () => {
  if (!pendingFile.value || !preview.value) return;
  emit("upload", pendingFile.value, preview.value);
  closeDialog();
};
</script>
