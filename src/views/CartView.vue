<template>
  <div class="site-wrapper">
    <div class="section">
      <h2>Mein Warenkorb</h2>
      <div v-for="(item, index) in cartItems"
           :key="index"
           class="item-wrapper">
        <div v-if="item" class="item">
          <div
              @click="cartStore.deleteProduct(item.product)"
              class="icon-wrapper">
            <img :src="getImage('ic_delete.png')" alt="">
          </div>
          <div v-if="item.product.images" class="image-wrapper">
            <img :src="getImage(item.product.images[0])" alt="">
          </div>
          <div class="info">
            <p>{{ item.product.displayName }}</p>
            <p>{{ item.product.getFormattedPrice() }}</p>
            <div class="button-wrapper">
              <QuantityButton
                  :is-mobile-button="true"
                  @increase="increaseQuantity(index)"
                  @decrease="item.quantity > 1 && decreaseQuantity(index)"
                  :quantity="item.quantity"/>
            </div>
          </div>
          <p class="summary">{{ formatPrice(item.product.price * item.quantity) }}</p>
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <h2>Zusammenfassung</h2>
      <div class="divider"></div>
      <div class="sub-total-section-info">
        <div class="price">
          <p>Zwischensumme</p>
          <p>{{ formatPrice(cartStore.totalCartPrice) }}</p>
        </div>
        <div class="price">
          <p>Lieferkosten</p>
          <p>{{ formatPrice(cartStore.deliveryCosts) }}</p>
        </div>
      </div>
      <div class="divider"></div>
      <div class="summary-section">
        <p>Gesamtsumme</p>
        <p>{{ formatPrice(cartStore.totalCartPriceWithDeliveryCosts) }}</p>
      </div>
      <div class="button-wrapper">
        <DynamicButton
            :is-router-link="true"
            :route="{pathName: SiteLinks.Checkout}"
            button-text="Zur Kasse"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useCartStore} from "@/stores/cartStore";
import {getImage} from "@/utils/ImageUtils";
import QuantityButton from "@/components/QuantityButton.vue";
import {formatPrice} from "../utils/PriceFormatter";
import {computed} from "vue";
import DynamicButton from "@/components/DynamicButton.vue";
import {SiteLinks} from "@/enums/SiteLinks";

const cartStore = useCartStore()

const cartItems = computed(() => {
  return cartStore.itemsInCart
})


function increaseQuantity(index: number) {
  cartStore.itemsInCart[index].quantity++

}

function decreaseQuantity(index: number) {
  cartStore.itemsInCart[index].quantity--
}

</script>

<style scoped>

.section {
  display: flex;
  flex-direction: column;
  gap: 32px;

  .item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;

    .item {
      display: flex;
      align-items: center;
      height: 110px;
      gap: 16px;
      position: relative;

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;

        img {
          width: 24px;
          height: 24px;
        }
      }

      p {
        font-size: 14px;
      }

      .image-wrapper {
        background-color: #f8f4f0;
        width: 110px;
        height: 110px;

        img {
          width: 80px;
          height: auto;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      .summary {
        align-self: flex-end;
      }


    }
  }
}

.bottom-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .divider {
    width: 100%;
    height: 1px;
    background-color: var(--light-gray);
  }

  .sub-total-section-info {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .price{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .summary-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

}

</style>