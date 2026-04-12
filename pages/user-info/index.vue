<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-5xl mx-auto px-6 py-10 flex gap-10">
      <SidebarNav
        :items="navItems"
        :active="activeSection"
        @select="activeSection = $event"
      />

      <div class="flex-1">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Personal details</h1>
            <p class="text-gray-500 mt-1">
              Update your info and find out how it's used.
            </p>
          </div>
          <AvatarUpload
            :initials="avatarInitials"
            :avatar-url="editUserStore.profile?.avatarUrl ?? undefined"
            @upload="handleAvatarUpload"
          />
        </div>

        <div class="divide-y divide-gray-200 border-t border-gray-200">
          <ProfileField
            ref="nameFieldRef"
            label="Name"
            :display-value="fullName"
            placeholder="Add your name"
            :disabled="!!activeField && activeField !== 'name'"
            @edit="openField('name')"
            @save="saveName"
            @cancel="closeField"
          >
            <template #edit>
              <div class="flex gap-3">
                <div class="flex-1">
                  <label class="block text-xs text-gray-500 mb-1">
                    First name(s) <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    v-model="form.firstName"
                    class="w-full"
                    placeholder="First name"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-xs text-gray-500 mb-1">
                    Last name(s) <span class="text-red-500">*</span>
                  </label>
                  <InputText
                    v-model="form.lastName"
                    class="w-full"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </template>
          </ProfileField>

          <ProfileField
            ref="emailFieldRef"
            label="Email address"
            :display-value="form.email"
            :disabled="!!activeField && activeField !== 'email'"
            @edit="openField('email')"
            @save="saveField('email')"
            @cancel="closeField"
          >
            <template #edit>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-gray-800">{{ form.email }}</span>
                <span
                  class="bg-green-700 text-white text-xs px-2 py-0.5 rounded"
                >
                  Verified
                </span>
              </div>
              <p class="text-sm text-gray-500 mb-3">
                This is the email address you use to sign in. It's also where we
                send your booking confirmations.
              </p>
              <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p class="text-sm text-gray-600 mb-2">
                  Unable to access your email? If you added a cell phone number
                  for one of your previous completed stays, you can change your
                  email address using cell phone verification.
                </p>
                <a href="#" class="text-sm text-blue-600 hover:underline">
                  Change email with phone verification
                </a>
              </div>
              <div class="mt-3">
                <InputText
                  v-model="form.email"
                  class="w-full"
                  type="email"
                  placeholder="New email address"
                />
              </div>
            </template>
          </ProfileField>

          <ProfileField
            ref="phoneFieldRef"
            label="Phone number"
            :display-value="form.phone"
            placeholder="Add your phone number"
            :disabled="!!activeField && activeField !== 'phone'"
            @edit="openField('phone')"
            @save="savePhone"
            @cancel="closeField"
          >
            <template #edit>
              <p class="text-sm text-gray-500 mb-3">
                Properties or attractions you book will use this number if they
                need to contact you.
              </p>
              <div class="flex gap-2">
                <Select
                  v-model="form.phoneCode"
                  :options="phoneCodeOptions"
                  option-label="label"
                  option-value="dialCode"
                  class="w-36 shrink-0"
                  placeholder="+84"
                />
                <InputText
                  v-model="form.phone"
                  class="flex-1"
                  type="tel"
                  placeholder="Phone number"
                />
              </div>
            </template>
          </ProfileField>

          <ProfileField
            ref="dobFieldRef"
            label="Date of birth"
            :display-value="formattedDob"
            placeholder="Enter your date of birth"
            :disabled="!!activeField && activeField !== 'dob'"
            @edit="openField('dob')"
            @save="saveDob"
            @cancel="closeField"
          >
            <template #edit>
              <DatePicker
                v-model="form.dob"
                date-format="dd/mm/yy"
                :show-icon="true"
                placeholder="DD/MM/YYYY"
                class="w-64"
              />
            </template>
          </ProfileField>

          <ProfileField
            ref="genderFieldRef"
            label="Gender"
            :display-value="form.gender"
            placeholder="Select your gender"
            :disabled="!!activeField && activeField !== 'gender'"
            @edit="openField('gender')"
            @save="saveGender"
            @cancel="closeField"
          >
            <template #edit>
              <Select
                v-model="form.gender"
                :options="genderOptions"
                option-label="label"
                option-value="value"
                placeholder="Select your gender"
                class="w-64"
              />
            </template>
          </ProfileField>

          <ProfileField
            ref="addressFieldRef"
            label="Address"
            :display-value="form.address"
            placeholder="Add your address"
            :disabled="!!activeField && activeField !== 'address'"
            @edit="openField('address')"
            @save="saveAddress"
            @cancel="closeField"
          >
            <template #edit>
              <InputText
                v-model="form.address"
                class="w-full"
                placeholder="Enter your address"
              />
            </template>
          </ProfileField>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import ProfileField from "@/components/user-info/ProfileField.vue";
import SidebarNav from "@/components/user-info/SidebarNav.vue";
import AvatarUpload from "@/components/user-info/AvatarUpload.vue";
import { useEditUserStore, toLocalDateString } from "@/stores/editUser";
import { useUploadStore } from "~/stores/admin/uploadImage";

const { t } = useI18n();
useHead({
  title: t("User Information"),
});

type ProfileFieldInstance = InstanceType<typeof ProfileField>;

const uploadStore = useUploadStore();
const authStore = useAuthStore();
const editUserStore = useEditUserStore();

const activeSection = ref("personal");

const navItems = [
  { key: "personal", label: "Personal details", icon: "pi pi-user" },
  { key: "security", label: "Security settings", icon: "pi pi-lock" },
  { key: "travelers", label: "Other travelers", icon: "pi pi-users" },
  { key: "display", label: "Display settings", icon: "pi pi-sliders-h" },
  { key: "payment", label: "Payment methods", icon: "pi pi-credit-card" },
  {
    key: "privacy",
    label: "Privacy and data management",
    icon: "pi pi-shield",
  },
];

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  phoneCode: "+84",
  dob: null as Date | null,
  gender: "",
  address: "",
});

const nameFieldRef = ref<ProfileFieldInstance>();
const emailFieldRef = ref<ProfileFieldInstance>();
const phoneFieldRef = ref<ProfileFieldInstance>();
const dobFieldRef = ref<ProfileFieldInstance>();
const genderFieldRef = ref<ProfileFieldInstance>();
const addressFieldRef = ref<ProfileFieldInstance>();

function mapProfileToForm() {
  const p = editUserStore.profile;
  if (!p) return;

  form.value.firstName = p.firstName ?? "";
  form.value.lastName = p.lastName ?? "";
  form.value.email = p.email ?? "";
  form.value.phone = p.phoneNumber ?? "";
  form.value.dob = p.birthDate ? new Date(p.birthDate) : null;
}

const fullName = computed(() =>
  [form.value.firstName, form.value.lastName].filter(Boolean).join(" "),
);

const avatarInitials = computed(() => editUserStore.initials);

const formattedDob = computed(() => {
  if (!form.value.dob) return "";
  return new Date(form.value.dob).toLocaleDateString("en-GB");
});

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

const phoneCodeOptions = [
  { label: "🇻🇳 +84", dialCode: "+84" },
  { label: "🇺🇸 +1", dialCode: "+1" },
  { label: "🇬🇧 +44", dialCode: "+44" },
  { label: "🇯🇵 +81", dialCode: "+81" },
  { label: "🇰🇷 +82", dialCode: "+82" },
  { label: "🇸🇬 +65", dialCode: "+65" },
];

const allFieldRefs: Record<string, Ref<ProfileFieldInstance | undefined>> = {
  name: nameFieldRef,
  email: emailFieldRef,
  phone: phoneFieldRef,
  dob: dobFieldRef,
  gender: genderFieldRef,
  address: addressFieldRef,
};

const activeField = ref<string | null>(null);

const openField = (field: string) => {
  Object.entries(allFieldRefs).forEach(([key, refObj]) => {
    if (key !== field && refObj.value?.isEditing) {
      refObj.value.closeEdit();
    }
  });
  activeField.value = field;
};

const closeField = () => {
  activeField.value = null;
};

const saveName = async () => {
  await editUserStore.updateProfile({
    firstName: form.value.firstName,
    lastName: form.value.lastName,
  });
  closeField();
};

const savePhone = async () => {
  await editUserStore.updateProfile({ phoneNumber: form.value.phone });
  closeField();
};

const saveDob = async () => {
  await editUserStore.updateProfile({
    birthDate: form.value.dob ? toLocalDateString(form.value.dob) : null,
  });
  closeField();
};

const saveGender = async () => {
  await editUserStore.updateProfile({ gender: form.value.gender });
  closeField();
};

const saveAddress = async () => {
  await editUserStore.updateProfile({ address: form.value.address });
  closeField();
};

const saveField = async (field: string) => {
  if (field === "email") {
    await editUserStore.updateProfile({ email: form.value.email });
  }
  closeField();
};

const handleAvatarUpload = async (file: File, _previewUrl: string) => {
  const res = await uploadStore.uploadImage(file, "avatars");

  if (res?.success && res.data?.url) {
    await editUserStore.updateProfile({ avatarUrl: res.data.url });
  }

  await editUserStore.fetchProfile();
  mapProfileToForm();

  await authStore.fetchUserInfo();
};

onMounted(async () => {
  await editUserStore.fetchProfile();
  mapProfileToForm();
});
</script>
