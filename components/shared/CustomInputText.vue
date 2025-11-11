<template>
  <div class="relative" :style="containerStyle">
    <input
      :id="id"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="inputStyle"
      :class="[
        'w-full px-4 py-3  bg-white pr-10 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder-gray-400 placeholder:font-normal',
        {
          'border-red-500 focus:border-red-500': invalid,
          'border-gray-300': !invalid,
          'bg-gray-50 cursor-not-allowed': disabled,
        },
      ]"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <!-- Clear Button -->
    <button
      v-if="inputValue && showClear && !disabled"
      type="button"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
    <div
      class="absolute right-9 top-1/2 text-gray-400 transform -translate-y-1/2"
    >
      <slot name="icon"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface Props {
  id?: string;
  modelValue?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  width?: string | number;
  height?: string | number;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "clear"): void;
  (e: "input", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  disabled: false,
  invalid: false,
  showClear: true,
  modelValue: "",
  width: "100%",
  height: "2.5rem", // 40px equivalent to h-10
});

const emit = defineEmits<Emits>();

const inputValue = ref(props.modelValue);

// Computed styles for container and input
const containerStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
}));

const inputStyle = computed(() => ({
  height: typeof props.height === "number" ? `${props.height}px` : props.height,
}));

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
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
