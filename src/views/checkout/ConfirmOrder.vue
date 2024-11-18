<template>
  <div class="route-wrapper">
    <h1>Danke für die Bestellung</h1>
    <p>Bald erreicht dich deine Bestätigungsmail an <span>{{checkoutStore.email}}</span></p>
  </div>
</template>

<script setup lang="ts">

;
import {useCheckoutStore} from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore()

</script>

<style scoped>

.route-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;

  span {
    font-weight: 700;
  }

}

</style>