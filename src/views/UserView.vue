<template>
  <div class="site-wrapper">
    <h1>User Dashboard - Hinterlege deine Daten</h1>

    <div class="form-wrapper">
      <div class="personal-data">
        <h2>Persönliche Daten</h2>
        <DynamicInputField
            v-model:user-input="firstName"
            label="Vorname"/>
        <DynamicInputField
            v-model:user-input="lastName"
            label="Nachname"/>
        <DynamicInputField
            v-model:user-input="phoneNumber"
            label="Rufnummer"/>
      </div>
      <div class="delivery-data">
        <h2>Lieferaddresse</h2>
        <DynamicInputField
            v-model:user-input="street"
            label="Straße"/>
        <DynamicInputField
            v-model:user-input="houseNumber"
            label="Hausnummer"/>
        <DynamicInputField
            v-model:user-input="postalCode"
            label="PLZ"/>
        <DynamicInputField
            v-model:user-input="city"
            label="Stadt"/>

        <DynamicDropdown
            :options="countryOptions"
            v-model:selected-option="country"
        />
      </div>

      <DynamicButton
          @click="saveUserData"
          button-text="Aktualisieren"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import DynamicInputField from "@/components/DynamicInputField.vue";
import {onMounted, type Ref, ref, watch} from "vue";
import DynamicButton from "@/components/DynamicButton.vue";
import {useUserStore} from "@/stores/userStore";
import DynamicDropdown from "@/components/DynamicDropdown.vue";
import {c} from "vite/dist/node/types.d-aGj9QkWt";

interface Option {
  label: string;
  value: string;
}

const userStore = useUserStore()

const firstName: Ref<string> = ref('')
const lastName: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')

const street: Ref<string> = ref('')
const houseNumber: Ref<string> = ref('')
const postalCode: Ref<string> = ref('')
const city: Ref<string> = ref('')
const country: Ref<string> = ref('')


const countryOptions: Ref<Option[]> = ref([
  {
    label: 'Österreich',
    value: 'Österreich',
  },
  {
    label: 'Deutschland',
    value: 'Deutschland',
  },
  {
    label: 'Schweiz',
    value: 'Schweiz',
  },
])


onMounted(() => {
  if (userStore.user?.personalData) {
    const personalData = userStore.user.personalData;
    firstName.value = personalData.firstName || '';
    lastName.value = personalData.lastName || '';
    phoneNumber.value = personalData.phoneNumber || '';
  }

  if (userStore.user?.deliveryData) {
    const deliveryData = userStore.user.deliveryData;
    street.value = deliveryData.street || '';
    houseNumber.value = deliveryData.houseNumber || '';
    postalCode.value = deliveryData.postalCode || '';
    city.value = deliveryData.city || '';
    country.value = deliveryData.country || '';
  }
});


async function saveUserData() {
  try {
    await userStore.updateUserData({
      personalData: {
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        email: userStore.user?.personalData?.email || '', // E-Mail bleibt unverändert
      },
      deliveryData: {
        street: street.value,
        houseNumber: houseNumber.value,
        postalCode: postalCode.value,
        city: city.value,
        country: country.value,
      },
    });
    alert("Daten erfolgreich gespeichert!");
  } catch (error) {
    alert("Fehler beim Speichern der Daten: " + error);
  }
}

</script>

<style scoped>

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;

  .delivery-data, .personal-data {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

</style>