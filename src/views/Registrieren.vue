<template>
  <div class="site-wrapper">
    <h1>Registrieren</h1>
    <div class="form-wrapper">
      <DynamicInputField
          label="Email"
          v-model:user-input="emailAddress"
          :input-type="InputType.Email"
      />
      <DynamicInputField
          label="Passwort"
          v-model:user-input="password"
          :input-type="InputType.Password"
      />

      <DynamicButton
          @click="register"
          button-text="Registrieren"
      />

      <div v-if="userStore.error" class="error">
        <p>{{userStore.error}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import DynamicInputField from "@/components/DynamicInputField.vue";
import {type Ref, ref} from "vue";
import DynamicButton from "@/components/DynamicButton.vue";
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";
import {SiteLinks} from "@/enums/SiteLinks";
import {InputType} from "@/enums/InputType";

const userStore = useUserStore()
const router = useRouter()

const emailAddress: Ref<string> = ref('')
const password: Ref<string> = ref('')


async function register(){
  await userStore.register(emailAddress.value, password.value)
  if (!userStore.error) {
   await router.push({name: SiteLinks.User});
  }
}

</script>

<style scoped>

.form-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

</style>