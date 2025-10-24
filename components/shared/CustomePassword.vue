<template>
  <div class="relative">
    <input
      :id="id"
      v-model="inputValue"
      :type="showPassword ? 'text' : 'password'"
      class="h-10"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-3 pr-20 border rounded-lg transition-colors duration-200 focus:outline-none  focus:border-green-500',
        {
          'border-red-500  focus:border-red-500': invalid,
          'border-gray-300': !invalid,
          'bg-gray-50 cursor-not-allowed': disabled,
        },
      ]"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <div
      class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1"
    >
      <!-- Clear Button -->
      <button
        v-if="inputValue && showClear && !disabled"
        type="button"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="clearInput"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Toggle Password Visibility Button -->
      <button
        v-if="toggleMask && !disabled"
        type="button"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="togglePasswordVisibility"
      >
        <!-- Eye Open Icon -->
        <svg
          v-if="!showPassword"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>

        <!-- Eye Closed Icon -->
        <svg
          v-else
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  id?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  toggleMask?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "clear"): void;
  (e: "input", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  disabled: false,
  invalid: false,
  showClear: true,
  toggleMask: true,
  modelValue: "",
});

const emit = defineEmits<Emits>();

const inputValue = ref(props.modelValue);
const showPassword = ref(false);

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

// Watch for internal changes and emit
watch(inputValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  emit("input", event);
};

const clearInput = () => {
  emit("clear");
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
