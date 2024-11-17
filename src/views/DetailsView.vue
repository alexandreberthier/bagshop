<template>
  <div class="site-wrapper">
    <div v-if="displayedProduct" class="product-display">
      <div class="image-section">
        <div class="image-wrapper">
          <img :src="getImage(images[0])" alt="Hauptbild">
        </div>

        <div class="images">
          <div
              v-for="(img, index) in images.slice(1)"
              :key="index"
              class="small-image-wrapper"
              @click="swapImage(index + 1)">
            <img :src="getImage(img)" alt="Bild">
          </div>
        </div>
      </div>

      <div class="product-info">
        <p class="article-number">Artikelnummer: {{ displayedProduct.id }}</p>
        <p class="display-name">{{ displayedProduct.displayName }}</p>
        <p class="price">{{ displayedProduct.getFormattedPrice() }}</p>
        <p class="desc">{{ displayedProduct.description }}</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import {computed, type ComputedRef, ref} from "vue";
import {useProductStore} from "@/stores/productStore";
import {getImage} from "@/utils/ImageUtils";
import {Product} from "@/models/Product";

const {id} = defineProps<{
  id: string
}>()

const productStore = useProductStore()

const displayedProduct: ComputedRef<Product | undefined> = computed(() => {
  const dto = productStore.products.find(product => product.id === id);
  return dto ? Product.fromDto(dto) : undefined;
})

const images = ref<string[]>([]);

if (displayedProduct.value) {
  images.value = [...displayedProduct.value.images];
}


function swapImage(index: number) {
  const selectedImage = images.value[index];
  if (selectedImage) {
    images.value.splice(index, 1);
    images.value.unshift(selectedImage);
  }
}


</script>

<style scoped>

.product-display {
  display: flex;
  flex-direction: column;
  gap: 32px;

  .image-section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .image-wrapper {
      background-color: #f8f4f0;

      img {
        width: 260px;
        height: auto;
      }
    }

    .images {
      display: flex;
      align-items: center;
      gap: 16px;

      .small-image-wrapper {
        background-color: #f8f4f0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        width: 60px;
        cursor: pointer;

        img {
          width: 95%;
          height: auto;
        }
      }
    }
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .article-number {
      font-size: 14px;
    }

    .display-name {
      font-size: 24px;
    }

    .price {
      font-size: 18px;
      font-style: italic;
      color: saddlebrown;
    }

    .desc {
      font-size: 14px;
    }
  }


}

</style>