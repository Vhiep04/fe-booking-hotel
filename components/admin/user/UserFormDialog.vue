<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '640px', maxWidth: '95vw' }"
    :header="isEditing ? t('Edit User') : t('Add New User')"
    :modal="true"
    class="p-fluid"
    @hide="emit('hide')"
  >
    <div class="flex flex-col gap-6 pt-2">
      <!-- Basic Information -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-user" /> {{ t("Basic Information") }}
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("First Name") }} <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.firstName"
              :placeholder="t('e.g. Nguyen')"
              :class="{ 'p-invalid': submitted && !form.firstName }"
            />
            <small v-if="submitted && !form.firstName" class="p-error">
              {{ t("First name is required") }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Last Name") }} <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.lastName"
              :placeholder="t('e.g. Van A')"
              :class="{ 'p-invalid': submitted && !form.lastName }"
            />
            <small v-if="submitted && !form.lastName" class="p-error">
              {{ t("Last name is required") }}
            </small>
          </div>

          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Username") }} <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.userName"
              :placeholder="t('e.g. nguyenvana')"
              :disabled="isEditing"
              :class="{ 'p-invalid': submitted && !form.userName }"
            />
            <small v-if="submitted && !form.userName" class="p-error">
              {{ t("Username is required") }}
            </small>
          </div>

          <div class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Email") }} <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="form.email"
              type="email"
              :placeholder="t('e.g. user@example.com')"
              :disabled="isEditing"
              :class="{ 'p-invalid': submitted && !form.email }"
            />
            <small v-if="submitted && !form.email" class="p-error">
              {{ t("Email is required") }}
            </small>
          </div>
        </div>
      </div>

      <!-- Account -->
      <div class="flex flex-col gap-4">
        <span
          class="text-xs font-bold uppercase tracking-widest text-(--admin-text-muted) flex items-center gap-1.5"
        >
          <i class="pi pi-lock" /> {{ t("Account") }}
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!isEditing" class="md:col-span-2 flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Password") }} <span class="text-red-500">*</span>
            </label>
            <Password
              v-model="form.password"
              :placeholder="t('Enter password')"
              toggleMask
              :feedback="true"
              :class="{ 'p-invalid': submitted && !form.password }"
              inputClass="w-full"
              fluid
            />
            <small v-if="submitted && !form.password" class="p-error">
              {{ t("Password is required") }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">{{ t("Phone") }}</label>
            <InputText
              v-model="form.phoneNumber"
              :placeholder="t('e.g. 0901234567')"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">
              {{ t("Role") }} <span class="text-red-500">*</span>
            </label>
            <Dropdown
              v-model="selectedRole"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('Select a role')"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="t('Cancel')"
        icon="pi pi-times"
        severity="secondary"
        outlined
        :disabled="saving"
        @click="emit('hide')"
      />
      <Button
        :label="isEditing ? t('Update User') : t('Add User')"
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

const { t } = useI18n();

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

const roleOptions = computed(() => [
  { label: "Admin", value: "Admin" },
  { label: "Customer", value: "Customer" },
  { label: "Manager", value: "Manager" },
]);

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
    selectedRole.value = user?.roles?.[0]
      ? (roleOptions.value.find(
          (r) => r.value.toLowerCase() === user.roles[0]!.toLowerCase(),
        )?.value ?? "Customer")
      : "Customer";
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
