<template>
  <div class="site-wrapper">
    <h1>Meine Bestellungen</h1>
    <div v-if="isLoading">Bestellungen werden geladen...</div>
    <div v-else-if="userOrders.length === 0">Du hast noch keine Bestellungen.</div>
    <div v-else>
      <div class="order-list">
        <div
            v-for="(order, index) in userOrders"
            :key="index"
            class="order-item"
        >
          <h3>Bestellung</h3>
          <p><strong>Status:</strong> {{ order.status }}</p>
          <p><strong>Gesamtpreis:</strong> {{ formatPrice(order.totalPrice) }}</p>
          <p><strong>Erstellt am:</strong> {{ formatTimestamp(order.createdAt) }}</p>
          <p><strong>Produkte:</strong></p>
          <ul>
            <li v-for="item in order.items" :key="item.productId">
              {{ item.quantity }}x {{ item.name }} ({{ formatPrice(item.price) }})
            </li>
          </ul>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { useUserStore } from "@/stores/userStore";
import { onMounted, computed } from "vue";
import { formatPrice } from "@/utils/PriceFormatter";
import type { Timestamp } from "firebase/firestore";
import {useOrderStore} from "@/stores/oderStore";

const orderStore = useOrderStore();
const userStore = useUserStore();

// Computed Properties
const isLoading = computed(() => orderStore.isLoading);
const userOrders = computed(() => orderStore.orders);

// Hilfsfunktion zur Formatierung von Timestamps
function formatTimestamp(timestamp: Date | Timestamp | null): string {
  if (!timestamp) return "Unbekanntes Datum";

  // Konvertiere Firestore-Timestamp in Date
  if (typeof (timestamp as Timestamp).toDate === "function") {
    return (timestamp as Timestamp).toDate().toLocaleString();
  }

  // Falls es bereits ein Date ist
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }

  return "Ungültiges Datum";
}

// Bestellungen für den eingeloggten Benutzer laden
onMounted(async () => {
  const userId = userStore.user?.id;
  if (userId) {
    await orderStore.fetchUserOrders(userId);
  } else {
    console.warn("Benutzer ist nicht eingeloggt.");
  }
});
</script>



<style scoped>
.site-wrapper {
  padding: 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

h1 {
  margin-bottom: 20px;
}

hr {
  margin: 20px 0;
}
</style>
