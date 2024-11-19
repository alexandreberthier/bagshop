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
import emailjs from "@emailjs/browser";
import {useOrderStore} from "@/stores/oderStore";
import {useUserStore} from "@/stores/userStore";
import {DeliveryStatus, type OrderDTO} from "@/models/Order";

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
const oderStore = useOrderStore()
const checkoutStore = useCheckoutStore();
const userStore = useUserStore()
const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.itemsInCart);

const totalAmount = computed(() => cartStore.totalCartPriceWithDeliveryCosts.toFixed(2));

function sendEmail(details: any) {
  const templateParams = {
    to_name: checkoutStore.firstName, // Name des Empfängers
    firstName: checkoutStore.firstName,
    lastName: checkoutStore.lastName,
    email: checkoutStore.email,
    phoneNumber: checkoutStore.phoneNumber || "Nicht angegeben", // Optional
    totalAmount: totalAmount.value,
    transactionId: details.id,
    products: cartItems.value
        .map(item => `${item.quantity}x ${item.product.displayName}`)
        .join("\n"), // Formatierung für mehrere Produkte
    message: "Danke für deinen Einkauf! Deine Bestellung wird bearbeitet.",
  };

  emailjs
      .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_USER_ID
      )
      .then(() => {
        console.log("E-Mail erfolgreich gesendet.");
      })
      .catch(error => {
        console.error("Fehler beim Senden der E-Mail:", error);
      });
}

async function saveOrder(details: any) {
  const orderStore = useOrderStore();
  const order: OrderDTO = {
    userId: userStore.user?.id || "Gast",
    personalData: {
      firstName: checkoutStore.firstName,
      lastName: checkoutStore.lastName,
      email: checkoutStore.email,
      phoneNumber: checkoutStore.phoneNumber || "",
    },
    deliveryData: {
      street: checkoutStore.street,
      houseNumber: checkoutStore.houseNumber,
      postalCode: checkoutStore.postalCode,
      city: checkoutStore.city,
      country: checkoutStore.country,
    },
    items: cartItems.value.map((item) => ({
      productId: item.product.id as string,
      name: item.product.displayName,
      price: item.product.price,
      quantity: item.quantity,
    })),
    totalPrice: parseFloat(totalAmount.value),
    status: DeliveryStatus.Pending,
    createdAt: new Date(),
  };
  await orderStore.createOrder(order);
}


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
        await saveOrder(details); // Bestellung speichern
        sendEmail(details); // E-Mail senden
        router.push({ name: "order-confirmation" });
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