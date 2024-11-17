<template>
  <div class="form-wrapper">
    <DynamicInputField
        v-model:user-input="street"
        v-model:user-error="streetError"
        label="Straße"
    />
    <DynamicInputField
        v-model:user-input="houseNumber"
        v-model:user-error="houseNumberError"
        label="Hausnummer"
    />
    <DynamicInputField
        v-model:user-input="postalCode"
        v-model:user-error="postalCodeError"
        label="PLZ"
    />
    <DynamicInputField
        v-model:user-input="city"
        v-model:user-error="cityError"
        label="Stadt"
    />
    <DynamicInputField
        v-model:user-input="country"
        v-model:user-error="countryError"
        label="Land"
    />
  </div>
</template>

<script setup lang="ts">

import DynamicInputField from "@/components/DynamicInputField.vue";
import {nextTick, type Ref, ref, watch} from "vue";
import {useUserStore} from "@/stores/userStore";

const userStore = useUserStore()

const street: Ref<string> = ref('')
const houseNumber: Ref<string> = ref('')
const postalCode: Ref<string> = ref('')
const city: Ref<string> = ref('')
const country: Ref<string> = ref('')

const streetError: Ref<string> = ref('')
const houseNumberError: Ref<string> = ref('')
const postalCodeError: Ref<string> = ref('')
const cityError: Ref<string> = ref('')
const countryError: Ref<string> = ref('')


function validateInputFields(){
  const fields = [
    {value: street.value, error: streetError, label: 'Straße'},
    {value: houseNumber.value, error: houseNumberError, label: 'Hausnummer'},
    {value: postalCode.value, error: postalCodeError, label: 'PLZ'},
    {value: city.value, error: cityError, label: 'Stadt'},
    {value: country.value, error: countryError, label: 'Land'},
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
      if (newUser?.deliveryData) {
        street.value = newUser.deliveryData.street || "";
        houseNumber.value = newUser.deliveryData.houseNumber || "";
        postalCode.value = newUser.deliveryData.postalCode || "";
        city.value = newUser.deliveryData.city || "";
        country.value = newUser.deliveryData.country || "";
      }
    },
    { immediate: true }
);

</script>

<style scoped>

</style>