<template>
  <div class="form-wrapper">
    <h2>Zusammenfassung</h2>
    <div class="data-summary">
      <div class="section">
        <p class="heading">Persönliche Daten</p>
        <div class="data">
          <p>{{ checkoutStore.firstName }}</p>
          <p>{{ checkoutStore.lastName }}</p>
          <p>{{ checkoutStore.email }}</p>
          <p>{{ checkoutStore.phoneNumber }}</p>
        </div>
      </div>
      <div class="section">
        <p class="heading">Lieferaddresse</p>
        <div class="data">
          <p>{{ checkoutStore.street }} {{ checkoutStore.houseNumber }}</p>
          <p>{{ checkoutStore.postalCode }} {{ checkoutStore.city }}</p>
          <p>{{ checkoutStore.country }}</p>
        </div>
      </div>
    </div>
    <div class="product-flex">
      <div
          v-for="(item, index) in cartItems"
          :key="index"
          class="item">
        <div class="image-wrapper">
          <img :src="getImage(item.product.images[0])" alt="">
        </div>
        <div class="item-info">
          <p>{{ item.product.displayName }}</p>
          <div class="price-info">
            <p>{{item.quantity}}x</p>
            <p>{{item.product.getFormattedPrice()}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="total-summary">
      <p>Gesamtsumme inkl. Versand</p>
      <p>{{formatPrice(cartStore.totalCartPriceWithDeliveryCosts)}}</p>
    </div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup lang="ts">
import {useCheckoutStore} from "@/stores/checkoutStore";
import {useCartStore} from "@/stores/cartStore";
import {useRouter} from "vue-router";
import {computed, onMounted} from "vue";
import {getImage} from "@/utils/ImageUtils";
import {formatPrice} from "@/utils/PriceFormatter";

interface PayPalActions {
  order: {
    create: (data: any) => Promise<string>;
    capture: () => Promise<any>;
  };
}

interface PayPalButtonsConfig {
  createOrder: (data: any, actions: PayPalActions) => Promise<string>;
  onApprove: (data: any, actions: PayPalActions) => Promise<void>;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    paypal: {
      Buttons: (config: PayPalButtonsConfig) => { render: (selector: string) => void };
    };
  }
}

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.itemsInCart);

const totalAmount = computed(() => cartStore.totalCartPriceWithDeliveryCosts.toFixed(2));

function initializePayPalButtons() {
  window.paypal.Buttons({
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalAmount.value,
            },
            description: "Einkauf bei Gurli Bags",
          },
        ],
      });
    },
    onApprove(data, actions) {
      return actions.order.capture().then(async (details) => {
        try {
          const response = await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: checkoutStore.email,
              name: `${checkoutStore.firstName} ${checkoutStore.lastName}`,
              orderDetails: JSON.stringify(cartItems.value.map(item => ({
                name: item.product.displayName,
                quantity: item.quantity,
                price: item.product.price,
              })), null, 2),
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('Email Error:', error);
            alert('Die Zahlung war erfolgreich, aber die E-Mail konnte nicht gesendet werden.');
          } else {
            console.log('E-Mail erfolgreich gesendet.');
          }

          router.push({ name: 'order-confirmation' });
        } catch (error) {
          console.error('API-Aufruf fehlgeschlagen:', error);
          alert('Die Zahlung war erfolgreich, aber es gab ein Problem beim Senden der Bestätigungs-E-Mail.');
        }
      }).finally(() => {
        // Popup schließen, falls noch geöffnet
        const paypalWindow = window.open('', '_self');
        if (paypalWindow) paypalWindow.close();
      });
    },

    onError(err) {
      console.error("Fehler bei der Zahlung:", err);
      alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    },
  }).render("#paypal-button-container");
}

onMounted(() => {
  if (!window.paypal) {
    const paypalScript = document.createElement("script");
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR`;
    paypalScript.async = true;
    paypalScript.onload = () => initializePayPalButtons();
    document.head.appendChild(paypalScript);
  } else {
    initializePayPalButtons();
  }
});
</script>


<style scoped>

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;

  .data-summary {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .heading {
        font-weight: 700;
      }
    }
  }

  .product-flex {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .item {
      display: flex;
      align-items: center;
      gap: 8px;

      .image-wrapper {
        background-color: #f8f4f0;
        width: 100px;
        height: 100px;

        img {
          width: 80px;
          height: auto;
        }
      }

      .item-info {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .price-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }

  .total-summary {
    display: flex;
    justify-content: space-between;
  }

  #paypal-button-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

</style>