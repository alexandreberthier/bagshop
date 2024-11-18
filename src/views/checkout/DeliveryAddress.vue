<template>
  <div class="form-wrapper">
    <DynamicInputField
        v-model:user-input="checkoutStore.street"
        v-model:user-error="streetError"
        label="Straße"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.houseNumber"
        v-model:user-error="houseNumberError"
        label="Hausnummer"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.postalCode"
        v-model:user-error="postalCodeError"
        label="PLZ"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.city"
        v-model:user-error="cityError"
        label="Stadt"
    />
    <DynamicInputField
        v-model:user-input="checkoutStore.country"
        v-model:user-error="countryError"
        label="Land"
    />
  </div>
</template>

<script setup lang="ts">

import DynamicInputField from "@/components/DynamicInputField.vue";
import {nextTick, type Ref, ref, watch} from "vue";
import {useUserStore} from "@/stores/userStore";
import {useCheckoutStore} from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore()

const streetError: Ref<string> = ref('')
const houseNumberError: Ref<string> = ref('')
const postalCodeError: Ref<string> = ref('')
const cityError: Ref<string> = ref('')
const countryError: Ref<string> = ref('')


function validateInputFields(){
  const fields = [
    {value: checkoutStore.street, error: streetError, label: 'Straße'},
    {value: checkoutStore.houseNumber, error: houseNumberError, label: 'Hausnummer'},
    {value: checkoutStore.postalCode, error: postalCodeError, label: 'PLZ'},
    {value: checkoutStore.city, error: cityError, label: 'Stadt'},
    {value: checkoutStore.country, error: countryError, label: 'Land'},
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