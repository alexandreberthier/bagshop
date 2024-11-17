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
      <div
          v-if="inputType === 'password'"
          @click="togglePasswordVisibility"
          class="icon-wrapper">
        <img :src="getImage('ic_hide.png')" alt="">
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

const {label, inputType = 'text'} = defineProps<{
  label: string
  inputType?: string
}>()

const userInput: ModelRef<string | undefined> = defineModel('userInput')
const userError: ModelRef<string | undefined> = defineModel('userError')

const inputId = computed(() => `input-${label}`)
const errorId = computed(() => `error-${label}`)

const computedInputType = computed(() => {
  return inputType === "password" && showPassword.value ? "text" : inputType;
});

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

watch(userInput, (newVal) => {
  const input = newVal?.trim();

  if (!input) {
    userError.value = undefined;
    return;
  }

  switch (inputType) {
    case "email":
      userError.value = validateEmail(input) ? undefined : "Ungültige Email-Adresse.";
      break;
    case "tel":
      userError.value = validatePhoneNumber(input) ? undefined : "Ungültige Telefonnummer.";
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
