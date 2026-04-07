<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '640px', maxWidth: '95vw' }"
    :header="isEditing ? 'Edit User' : 'Add New User'"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-6 pt-2">
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-user" /> Basic Information
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              First Name <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.firstName"
              placeholder="e.g. Nguyen"
              :class="{ 'p-invalid': submitted && !form.firstName }"
            />
            <small v-if="submitted && !form.firstName" class="p-error">
              First name is required
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Last Name <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.lastName"
              placeholder="e.g. Van A"
              :class="{ 'p-invalid': submitted && !form.lastName }"
            />
            <small v-if="submitted && !form.lastName" class="p-error">
              Last name is required
            </small>
          </div>

          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              Username <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.userName"
              placeholder="e.g. nguyenvana"
              :disabled="isEditing"
              :class="{ 'p-invalid': submitted && !form.userName }"
            />
            <small v-if="submitted && !form.userName" class="p-error">
              Username is required
            </small>
          </div>

          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              Email <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.email"
              type="email"
              placeholder="e.g. user@example.com"
              :disabled="isEditing"
              :class="{ 'p-invalid': submitted && !form.email }"
            />
            <small v-if="submitted && !form.email" class="p-error">
              Email is required
            </small>
          </div>
        </div>
      </div>

      <!-- Account -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-lock" /> Account
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!isEditing" class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              Password <span class="text-red-500">*</span>
            </label>
            <Password
              v-model="form.password"
              placeholder="Enter password"
              toggleMask
              :feedback="true"
              :class="{ 'p-invalid': submitted && !form.password }"
              inputClass="w-full"
              fluid
            />
            <small v-if="submitted && !form.password" class="p-error">
              Password is required
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Phone</label>
            <InputText
              v-model="form.phoneNumber"
              placeholder="e.g. 0901234567"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              Role <span class="text-red-500">*</span>
            </label>
            <Dropdown
              v-model="selectedRole"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a role"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="saving"
        @click="emit('hide')"
      />
      <Button
        :label="isEditing ? 'Update User' : 'Add User'"
        :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
        :loading="saving"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDto,
} from "~/stores/admin/interfaces/users";

const props = defineProps<{
  modelValue: boolean;
  isEditing: boolean;
  editingUser: UserDto | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "hide"): void;
  (e: "save-create", payload: CreateUserPayload): void;
  (e: "save-update", id: string, payload: UpdateUserPayload): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const submitted = ref(false);

const defaultForm = {
  userName: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const form = ref({ ...defaultForm });
const selectedRole = ref<string>("Customer");

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Customer", value: "Customer" },
];

watch(
  () => props.editingUser,
  (user) => {
    form.value = user
      ? {
          userName: user.userName,
          email: user.email,
          password: "",
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber ?? "",
        }
      : { ...defaultForm };
    selectedRole.value = user?.roles?.[0] ?? "Customer";
    submitted.value = false;
  },
  { immediate: true },
);

function handleSave() {
  submitted.value = true;

  if (!form.value.firstName || !form.value.lastName || !form.value.email)
    return;
  if (!props.isEditing && (!form.value.userName || !form.value.password))
    return;

  if (props.isEditing && props.editingUser) {
    emit("save-update", props.editingUser.id, {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNumber: form.value.phoneNumber,
      roles: [selectedRole.value],
    });
  } else {
    emit("save-create", {
      userName: form.value.userName,
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phoneNumber: form.value.phoneNumber,
      roles: [selectedRole.value],
    });
  }
}
</script>
