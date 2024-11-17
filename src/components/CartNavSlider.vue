<template>
  <div :class="['cart-slider', {show: cartStore.showCartSlider }]">
    <div
        @click="cartStore.hideCartSlider()"
        class="overlay"></div>
    <div class="slider-content">
      <p v-if="!cartStore.totalCartItems">Dein Warenkorb ist leer</p>
      <div class="content" v-else>
        <div class="cart-items-flex">
          <div v-for="(item, index) in cartStore.itemsInCart"
               :key="index"
               class="cart-item">
            <div v-if="item"
                 @click="cartStore.deleteProduct(item.product)"
                 class="icon-wrapper">
              <img :src="getImage('ic_delete.png')" alt="">
            </div>
            <router-link
                @click="cartStore.hideCartSlider()"
                v-if="item.product.id"
                :to="{ name: SiteLinks.Details, params: { id: item.product.id } }"
            >
              <div class="image-wrapper">
                <img :src="getImage(item.product.images[0])" alt="">
              </div>
            </router-link>
            <div class="info">
              <p>{{ item.product.displayName }}</p>
              <div class="price-wrapper">
                <p>{{ item.quantity }}</p>
                <p>x</p>
                <p>{{ formatPrice(item.product.price) }}</p>
                <p> | {{ formatPrice(item.product.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="total-price">
          <p>Gesamtpreis</p>
          <p>{{ formatPrice(cartStore.totalCartPrice) }}</p>
        </div>
        <DynamicButton
            @click="cartStore.hideCartSlider()"
            :is-router-link="true"
            :route="{pathName: SiteLinks.Cart}"
            button-text="Warekorb ansehen"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useCartStore} from "@/stores/cartStore";
import {getImage} from "@/utils/ImageUtils";
import {SiteLinks} from "@/enums/SiteLinks";
import {formatPrice} from "@/utils/PriceFormatter";
import DynamicButton from "@/components/DynamicButton.vue";

const cartStore = useCartStore()

</script>

<style scoped>

.cart-slider {
  width: 100%;
  height: 100%;
  background-color: var(--white);
  position: fixed;
  right: 0;
  transition: all 250ms ease-in-out;
  transform: translateX(100%);
  opacity: 0;
  display: flex;
  z-index: 10;

  &.show {
    transform: translateX(0);
    opacity: 1;
  }

  .overlay {
    background-color: var(--light-gray);
    width: 10%;
    cursor: pointer;
  }

  .slider-content {
    width: 90%;
    background-color: var(--white);
    box-shadow: -5px 0 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 50px 20px;

    .content {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .total-price {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .cart-items-flex {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;
        max-height: 300px;
        overflow: scroll;

        .cart-item {
          display: flex;
          align-items: center;
          width: 300px;
          height: 80px;
          gap: 8px;
          position: relative;

          .icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
            width: 35px;
            height: 35px;

            img {
              width: 24px;
              height: 24px;
            }
          }

          .info {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: center;
            gap: 10px;

            .price-wrapper {
              display: flex;
              justify-content: space-between;
            }
          }


          p {
            font-size: 14px;
          }

          .image-wrapper {
            background-color: #f8f4f0;
            width: 80px;
            height: 80px;
            cursor: pointer;

            img {
              width: 70px;
              height: auto;
            }
          }
        }


      }
    }


  }
}

</style>