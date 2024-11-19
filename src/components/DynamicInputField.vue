<template>
  <div class="input-outer-wrapper">
    <div class="input-section">
      <label
          :for="inputId">{{ label }}</label>
      <input
          v-model="userInput"
          :type="computedInputType"
          :name="label"
          :id="inputId"
          :aria-describedby="userError ? errorId : undefined"
          :aria-invalid="userError ? 'true' : undefined"
      >
      <div v-if="inputIcon"
           class="icon-wrapper"
           @click="inputType === InputType.Password ? togglePasswordVisibility() : undefined"
      >
        <img :src="inputIcon" alt=""/>
      </div>

    </div>
    <div
        v-if="userError"
        :id="errorId"
        aria-live="assertive"
        class="error-message">{{ userError }}
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, type ModelRef, type Ref, ref, watch} from "vue";
import {getImage} from "@/utils/ImageUtils";
import {InputType} from "@/enums/InputType";

const {label, inputType} = defineProps<{
  label: string
  inputType?: InputType
}>()

const userInput: ModelRef<string | undefined> = defineModel('userInput')
const userError: ModelRef<string | undefined> = defineModel('userError')

const inputId = computed(() => `input-${label}`)
const errorId = computed(() => `error-${label}`)

const computedInputType = computed(() => {
  if (inputType === InputType.Search) {
    return "text";
  }
  return inputType === InputType.Password && showPassword.value ? "text" : inputType;
})

const inputIcon = computed(() => {
  switch (inputType) {
    case InputType.Password:
      return showPassword.value ? getImage("ic_show.png") : getImage("ic_hide.png");
    case InputType.Search:
      return getImage("ic_search.png");
    default:
      return null;
  }
})

const showPassword: Ref<boolean> = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function validateEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return emailRegex.test(input);
}

function validatePhoneNumber(input: string): boolean {
  const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,15}$/;
  return phoneRegex.test(input);
}

function sanitizeToNumbers(input: string): string {
  return input.replace(/\D/g, '');
}


watch(userInput, (newVal) => {
  const input = newVal?.trim();

  if (!input) {
    userError.value = undefined;
    return;
  }

  switch (inputType) {
    case InputType.Email:
      userError.value = validateEmail(input) ? undefined : "Ungültige Email-Adresse.";
      break;
    case InputType.Phone:
      userError.value = validatePhoneNumber(input) ? undefined : "Ungültige Telefonnummer.";
      break;
    case InputType.PostalCode:
      userInput.value = sanitizeToNumbers(input);
      userError.value = userInput.value ? undefined : "Ungültige Postleitzahl.";
      break;
    default:
      userError.value = undefined;
  }
});


</script>

<style scoped>
.input-outer-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 75px;
  box-sizing: border-box;
  padding: 5px 0;

  .input-section {
    display: flex;
    flex-direction: column;
    position: relative;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
      }
    }

    input {
      height: 50px;
      outline: none;
      border: 1px solid black;
      font-size: 18px;
      box-sizing: border-box;
      padding: 0 20px;

      &:focus {
        border: 2px solid black;
      }
    }

    label {
      position: absolute;
      left: 10px;
      top: -10px;
      font-size: 14px;
      background-color: white;
      padding: 2px 10px;
    }
  }

  .error-message {
    color: red;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
  }
}

</style>
