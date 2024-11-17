<template>
  <div tabindex="0" role="button" class="button-wrapper">
    <div
        @click="$emit('decrease')"
        class="icon-wrapper">
      <img :src="getImage('ic_minus.png')" alt="">
    </div>
    <div class="quantity">
      <p>{{quantity}}</p>
    </div>
    <div
        @click="$emit('increase')"
        class="icon-wrapper">
      <img :src="getImage('ic_plus.png')" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">

import {getImage} from "@/utils/ImageUtils";

const {quantity = 1} = defineProps<{
  quantity: number
}>()
</script>

<style scoped>

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  border: 1px solid var(--black);

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 35px;
    height: 35px;

    img {
      width: 24px;
      height: 24px;
    }
  }
}

</style>