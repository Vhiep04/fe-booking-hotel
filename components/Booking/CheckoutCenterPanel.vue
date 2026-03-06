<template>
  <div class="flex-1 space-y-4">
    <!-- Guest Details Form -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-5">Enter your details</h2>

      <div
        class="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6"
      >
        <i class="pi pi-info-circle text-gray-400" />
        <span
          >Almost done! Just fill in the
          <span class="text-red-500 font-medium">*</span> required info</span
        >
      </div>

      <div class="space-y-4">
        <!-- Name -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >First name <span class="text-red-500">*</span></label
            >
            <InputText
              :value="guestDetails.firstName"
              class="w-full"
              @input="update('firstName', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Last name <span class="text-red-500">*</span></label
            >
            <InputText
              :value="guestDetails.lastName"
              class="w-full"
              @input="update('lastName', $event)"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email address <span class="text-red-500">*</span></label
          >
          <InputText
            :value="guestDetails.email"
            type="email"
            class="w-[49%]"
            @input="update('email', $event)"
          />
          <p class="text-xs text-gray-500 mt-1">
            Confirmation email sent to this address
          </p>
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Country/Region <span class="text-red-500">*</span></label
          >
          <Select
            :model-value="guestDetails.country"
            :options="countryList"
            option-label="name"
            option-value="name"
            filter
            class="w-[49%]"
            @update:model-value="onCountryChange"
          />
        </div>

        <!-- Phone -->
        <div class="w-[49%]">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Phone number <span class="text-red-500">*</span></label
          >
          <div class="flex gap-2">
            <!-- Phone code Select – driven by selected country (read-only via disabled) -->
            <Select
              :model-value="selectedPhoneCode"
              :options="phoneCodeOptions"
              option-label="label"
              option-value="dialCode"
              disabled
              class="w-36 shrink-0"
            />
            <InputText
              :value="guestDetails.phone"
              class="flex-1"
              type="tel"
              @input="update('phone', $event)"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            To verify your booking, and for the property to connect if needed
          </p>
        </div>
      </div>
    </div>

    <!-- Good to Know + Room Info -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="font-bold text-gray-900 text-lg mb-4">Good to know:</h3>
      <ul class="space-y-2 mb-6">
        <li class="flex items-start gap-2 text-sm text-gray-700">
          <i class="pi pi-credit-card text-gray-400 mt-0.5 shrink-0" />
          No credit card needed
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-700">
          <i class="pi pi-check-circle text-green-500 mt-0.5 shrink-0" />
          Stay flexible: You can cancel for free before March 5, 2026 – lock in
          this great price today.
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-700">
          <i class="pi pi-check-circle text-green-500 mt-0.5 shrink-0" />
          You'll get the entire suite to yourself!
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-700">
          <i class="pi pi-check-circle text-green-500 mt-0.5 shrink-0" />
          No payment needed now. You'll pay at the property.
        </li>
        <li class="flex items-start gap-2 text-sm text-gray-700">
          <i class="pi pi-exclamation-circle text-orange-500 mt-0.5 shrink-0" />
          You're booking the last available King Suite with Balcony we have at
          SAM Hotel and Apartment Danang on our site.
        </li>
      </ul>

      <div class="border-t border-gray-100 pt-5">
        <h3 class="font-bold text-gray-900 text-lg mb-3">
          {{ booking.room.name }}
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2 text-green-600 font-medium">
            <i class="pi pi-check" />
            <span>Free cancellation</span>
            <span class="text-gray-500 font-normal"
              >before {{ booking.room.freeCancellationBefore }}</span
            >
          </div>
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-users text-gray-500" />
            Guests: {{ booking.room.guests }} adults
          </div>
          <!-- Main guest with edit pencil -->
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-user text-gray-500" />
            <span>Main guest:</span>
            <span class="text-blue-600 font-medium">{{ mainGuestName }}</span>
            <i
              class="pi pi-pencil text-blue-400 cursor-pointer hover:text-blue-600 transition-colors"
              @click="openMainGuestDialog"
            />
          </div>
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-ban text-gray-500" />
            No smoking
          </div>
        </div>
      </div>
    </div>

    <!-- Special Requests -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="font-bold text-gray-900 text-lg mb-2">Special requests</h3>
      <p class="text-sm text-gray-600 mb-4">
        Special requests can't be guaranteed, but the property will do its best
        to meet your needs. You can always make a special request after your
        booking is complete.
      </p>
      <label class="block text-sm text-gray-700 mb-2">
        Please write your requests in English.
        <span class="text-gray-400">(optional)</span>
      </label>
      <Textarea
        :value="specialRequest"
        rows="4"
        class="w-full"
        placeholder="e.g. high floor, non-smoking room, early check-in..."
        @input="
          emit(
            'update:specialRequest',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
      />
    </div>

    <!-- Arrival Time -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="font-bold text-gray-900 text-lg mb-4">Your arrival time</h3>
      <div class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <i class="pi pi-check-circle text-green-500" />
          Your room will be ready for check-in between 2:00 PM and 12:00 AM
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <i class="pi pi-user text-gray-500" />
          24-hour front desk – help whenever you need it!
        </div>
      </div>
      <label class="block text-sm text-gray-700 mb-2">
        Add your estimated arrival time
        <span class="text-gray-400">(optional)</span>
      </label>
      <Select
        :model-value="arrivalTime"
        :options="timeOptions"
        placeholder="Please select"
        class="w-full sm:w-72"
        @update:model-value="emit('update:arrivalTime', $event)"
      />
    </div>

    <!-- Submit -->
    <div class="flex justify-end items-center gap-4 py-4">
      <span
        class="text-blue-600 text-sm flex items-center gap-1 cursor-pointer"
      >
        <i class="pi pi-tag" />
        We Price Match
      </span>
      <Button
        label="Pay via VNPAY"
        icon="pi pi-credit-card"
        icon-pos="left"
        class="bg-blue-700! border-blue-700!"
        @click="emit('submit')"
      />
    </div>
    <div class="text-center pb-4">
      <a href="#" class="text-blue-600 text-sm underline"
        >What are my booking conditions?</a
      >
    </div>

    <!-- Main Guest Dialog -->
    <Dialog
      v-model:visible="showMainGuestDialog"
      modal
      :closable="true"
      :style="{ width: '480px' }"
      :pt="{
        root: { class: 'rounded-2xl overflow-hidden' },
        header: { class: 'px-6 pt-6 pb-0' },
        content: { class: 'px-6 pb-6' },
      }"
    >
      <template #header>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Main guest details</h2>
          <p class="text-sm text-gray-500 mt-1">{{ booking.room.name }}</p>
        </div>
      </template>

      <div class="mt-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Guest's full name</label
          >
          <InputText
            v-model="editMainGuestName"
            class="w-full"
            placeholder="Enter full name"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 pt-2">
          <Button
            label="Save"
            class="bg-blue-600! border-blue-600! flex-1"
            @click="saveMainGuest"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Button, InputText, Select, Dialog, Textarea } from "primevue";
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "#imports";
import { COUNTRIES } from "@/data/countries";

const props = defineProps<{
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phone: string;
  };
  specialRequest: string;
  arrivalTime: string;
  booking: {
    room: {
      name: string;
      guests: number;
      freeCancellationBefore: string;
    };
  };
}>();

const emit = defineEmits([
  "update:guestDetails",
  "update:specialRequest",
  "update:arrivalTime",
  "submit",
]);

const authStore = useAuthStore();

// Main guest dialog state
const showMainGuestDialog = ref(false);
const editMainGuestName = ref("");
const mainGuestName = ref("");

// Country list from the imported file
const countryList = COUNTRIES;

// Computed: phone code derived from currently selected country
const selectedPhoneCode = computed(() => {
  const found = COUNTRIES.find((c) => c.name === props.guestDetails.country);
  return found ? found.dialCode : "";
});

// Options list for the phone code Select (label shown in dropdown)
const phoneCodeOptions = computed(() =>
  COUNTRIES.map((c) => ({
    label: `${c.flag} ${c.dialCode}`,
    dialCode: c.dialCode,
  })),
);

// On mount: call /me and pre-fill form
onMounted(async () => {
  await authStore.fetchUserInfo();
  const user = authStore.userInfo;
  if (user) {
    emit("update:guestDetails", {
      ...props.guestDetails,
      firstName: user.firstName ?? props.guestDetails.firstName,
      lastName: user.lastName ?? props.guestDetails.lastName,
      email: user.email ?? props.guestDetails.email,
      phone: user.phoneNumber ?? props.guestDetails.phone,
    });
    mainGuestName.value = user.fullName ?? `${user.firstName} ${user.lastName}`;
  }
});

// Country change: update country in guestDetails (phone code auto-updates via computed)
function onCountryChange(newCountry: string) {
  emit("update:guestDetails", {
    ...props.guestDetails,
    country: newCountry,
  });
}

// Main guest dialog
function openMainGuestDialog() {
  editMainGuestName.value = mainGuestName.value;
  showMainGuestDialog.value = true;
}

function saveMainGuest() {
  mainGuestName.value = editMainGuestName.value;
  showMainGuestDialog.value = false;
}

// Generic field update
const update = (field: string, event: Event) => {
  emit("update:guestDetails", {
    ...props.guestDetails,
    [field]: (event.target as HTMLInputElement).value,
  });
};

const timeOptions = [
  "Before 12:00 PM",
  "12:00 PM – 1:00 PM",
  "1:00 PM – 2:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
  "4:00 PM – 5:00 PM",
  "5:00 PM – 6:00 PM",
  "6:00 PM – 7:00 PM",
  "7:00 PM – 8:00 PM",
  "8:00 PM – 9:00 PM",
  "9:00 PM – 10:00 PM",
  "After 10:00 PM",
  "I don't know",
];
</script>
