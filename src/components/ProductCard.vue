<template>
  <router-link :to="{name: SiteLinks.Details, params: {id: product.id}}">
    <div class="card-wrapper">
      <div class="image-wrapper">
        <img :src="getImage(product.images[0])" alt="">
        <div class="hover-text">
          <p>Details</p>
        </div>
      </div>
      <div class="product-info">
        <p>{{product.displayName}}</p>
        <p>{{product.getFormattedPrice()}}</p>
      </div>
    </div>

  </router-link>
</template>

<script setup lang="ts">

import type {Product} from "@/models/Product";
import {SiteLinks} from "@/enums/SiteLinks";
import {getImage} from "@/utils/ImageUtils";

const {product} = defineProps<{
  product: Product
}>()

</script>

<style scoped>

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 300px;
  height: 400px;

  &:hover .image-wrapper .hover-text {
    transform: translateY(0%);
  }

  .image-wrapper {
    background-color: #f8f4f0;
    overflow: hidden;
    width: 300px;
    position: relative;

    .hover-text {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.4);
      position: absolute;
      bottom: 0;
      height: 40px;
      width: 100%;
      transform: translateY(100%);
      transition: all 250ms ease-in-out;

      p {
        font-size: 14px;
      }
    }

    img {
      width: 260px;
      height: auto;
    }
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}


</style>