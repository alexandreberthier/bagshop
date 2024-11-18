<template>
  <div class="form-wrapper">
    <DynamicInputField
        v-model:user-input="checkoutStore.firstName"
        v-model:user-error="firstNameError"
        label="Vorname"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.lastName"
        v-model:user-error="lastNameError"
        label="Nachname"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.email"
        v-model:user-error="emailError"
        :input-type="InputType.Email"
        label="Email"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.phoneNumber"
        :input-type="InputType.Phone"
        label="Rufnummer"
    />
  </div>
</template>

<script setup lang="ts">

import DynamicInputField from "@/components/DynamicInputField.vue";
import {nextTick, type Ref, ref} from "vue";
import {InputType} from "@/enums/InputType";
import {useCheckoutStore} from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore()

const firstNameError: Ref<string> = ref('')
const lastNameError: Ref<string> = ref('')
const emailError: Ref<string> = ref('')


function validateInputFields(){
  const fields = [
    {value: checkoutStore.firstName, error: firstNameError, label: 'Vorname'},
    {value: checkoutStore.lastName, error: lastNameError, label: 'Nachname'},
    {value: checkoutStore.email, error: emailError, label: 'Email'}
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

</script>

<style scoped>

</style>