
<template>
  <component
      :is="isRouterLink ? 'router-link' : 'div'"
      tabindex="0"
      :role="isRouterLink ? 'link' : 'button'"
      :aria-label="buttonText"
      v-bind="isRouterLink && route ? { to: { name: route.pathName, hash: route.hash } } : null"
      class="button"
  >
    <p>{{ buttonText }}</p>
    <div v-if="isRouterLink" class="icon-wrapper">
      <img :src="getImage('ic_chevron_right_white.png')" alt="">
    </div>
  </component>
</template>

<script setup lang="ts">
import {getImage} from "@/utils/ImageUtils";

interface RouterOption {
  pathName: string,
  hash?: string
}

const {isRouterLink, route, buttonText} = defineProps<{
  isRouterLink?: boolean,
  route?: RouterOption
  buttonText: string,
}>()

</script>

<style scoped>

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
  padding: 5px 10px;
  background: black;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  width: 100%;
  height: 50px;

  &:hover .icon-wrapper img {
    transform: translateX(5px);
  }

  &:hover {
    opacity: 0.7;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
      height: 20px;
      transition: all 150ms ease-in-out;
    }
  }

  p {
    color: white;

  }
}

</style>
