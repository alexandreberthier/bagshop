<template>
  <div class="form-wrapper">
    <DynamicInputField
        v-model:user-input="firstName"
        v-model:user-error="firstNameError"
        label="Vorname"
    />
    <DynamicInputField
        v-model:user-input="lastName"
        v-model:user-error="lastNameError"
        label="Nachname"
    />
    <DynamicInputField
        v-model:user-input="email"
        v-model:user-error="emailError"
        :input-type="InputType.Email"
        label="Email"
    />
    <DynamicInputField
        v-model:user-input="phoneNumber"
        :input-type="InputType.Phone"
        label="Rufnummer"
    />
  </div>
</template>

<script setup lang="ts">

import DynamicInputField from "@/components/DynamicInputField.vue";
import {nextTick, type Ref, ref, watch} from "vue";
import {InputType} from "@/enums/InputType";
import {useUserStore} from "@/stores/userStore";

const userStore = useUserStore()

const firstName: Ref<string> = ref('')
const lastName: Ref<string> = ref('')
const email: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')

const firstNameError: Ref<string> = ref('')
const lastNameError: Ref<string> = ref('')
const emailError: Ref<string> = ref('')


function validateInputFields(){
  const fields = [
    {value: firstName.value, error: firstNameError, label: 'Vorname'},
    {value: lastName.value, error: lastNameError, label: 'Nachname'},
    {value: email.value, error: emailError, label: 'Email'}
  ]

  let errorHTML: HTMLElement | null = null

  fields.forEach(field => {
    if(!field.value.trim()) {
      field.error.value = `${field.label} nicht vergessen!`
      if (!errorHTML) {
        errorHTML = document.querySelector('.error');
      }
    }
    if (field.error.value && !errorHTML) {
      errorHTML = document.querySelector('.error');
    }
  })

  if (errorHTML) {
    nextTick(() => {
      errorHTML?.scrollIntoView({block: 'center', behavior: 'smooth'});
    })
  }

  return fields.every(field => !field.error.value);
}

defineExpose({validateInputFields})


watch(
    () => userStore.user,
    (newUser) => {
      if (newUser?.personalData) {
        firstName.value = newUser.personalData.firstName || "";
        lastName.value = newUser.personalData.lastName || "";
        email.value = newUser.personalData.email || "";
        phoneNumber.value = newUser.personalData.phoneNumber || "";
      }
    },
    { immediate: true }
);

</script>

<style scoped>

</style>