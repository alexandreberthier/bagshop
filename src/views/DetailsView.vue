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
        <div class="top">
          <p class="article-number">Artikelnummer: {{ displayedProduct.id }}</p>
          <p class="display-name">{{ displayedProduct.displayName }}</p>
          <p class="price">{{ displayedProduct.getFormattedPrice() }}</p>
        </div>
        <div class="button-section">
          <DynamicButton
              button-text="In den Warenkorb"
              @click="cartStore.addProduct(displayedProduct, quantity)"
          />
          <QuantityButton
              @increase="increaseQuantity"
              @decrease="decreaseQuantity"
              :quantity="quantity"/>
        </div>
        <p class="desc">{{ displayedProduct.description }}</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import {computed, type ComputedRef, type Ref, ref} from "vue";
import {useProductStore} from "@/stores/productStore";
import {getImage} from "@/utils/ImageUtils";
import {Product} from "@/models/Product";
import DynamicButton from "@/components/DynamicButton.vue";
import QuantityButton from "@/components/QuantityButton.vue";
import {useCartStore} from "@/stores/cartStore";

const {id} = defineProps<{
  id: string
}>()

const productStore = useProductStore()
const cartStore = useCartStore()

const quantity: Ref<number> = ref(1)

function increaseQuantity() {
  if (quantity.value < 5) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

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
    gap: 32px;

    .top {
      display: flex;
      flex-direction: column;
      gap: 16px;

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
    }

    .button-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .desc {
      font-size: 14px;
    }
  }


}

</style>