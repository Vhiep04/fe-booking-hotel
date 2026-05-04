<template>
  <div class="py-4 border-b border-gray-200">
    <div class="flex items-start gap-6">
      <div class="w-40 shrink-0 text-gray-700 font-medium pt-1">
        {{ label }}
      </div>

      <div class="flex-1">
        <template v-if="!isEditing">
          <span class="text-gray-600">
            {{ displayValue || placeholder }}
          </span>
        </template>

        <template v-else>
          <slot name="edit" />
          <div class="flex gap-3 mt-4">
            <Button
              :label="t('Save')"
              @click="handleSave"
              :loading="saving"
              class="px-6"
            />
            <Button
              :label="t('Cancel')"
              severity="secondary"
              text
              @click="handleCancel"
            />
          </div>
        </template>
      </div>

      <div class="shrink-0">
        <button
          v-if="!isEditing"
          :disabled="disabled"
          @click="handleEdit"
          class="text-blue-600 font-medium hover:text-blue-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {{ editLabel ?? t("Edit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";

const { t } = useI18n();

interface Props {
  label: string;
  displayValue?: string;
  placeholder?: string;
  disabled?: boolean;
  editLabel?: string;
  saving?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "—",
  disabled: false,
  saving: false,
});

const emit = defineEmits<{
  edit: [];
  save: [];
  cancel: [];
}>();

const isEditing = ref(false);

const handleEdit = () => {
  isEditing.value = true;
  emit("edit");
};

const handleSave = () => {
  emit("save");
  isEditing.value = false;
};

const handleCancel = () => {
  isEditing.value = false;
  emit("cancel");
};

const closeEdit = () => {
  isEditing.value = false;
};

defineExpose({ isEditing, closeEdit });
</script>
