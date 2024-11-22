<template>
  <div class="site-wrapper">
    <h1>Admin - Alle Bestellungen ansehen</h1>
    <div v-if="isLoading">Lade Bestellungen...</div>
    <div v-else-if="orders.length === 0">Keine Bestellungen gefunden.</div>
    <div v-else>
      <div class="order-list">
        <div
            v-for="(order, index) in orders"
            :key="index"
            class="order-item"
        >
          <h3>Bestellung ID: {{ order.userId || "Gast" }}</h3>
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
import { useOrderStore } from "@/stores/oderStore";
import { onMounted, computed } from "vue";
import { formatPrice } from "@/utils/PriceFormatter";

// Order-Store verwenden
const orderStore = useOrderStore();
const isLoading = computed(() => orderStore.isLoading);
const orders = computed(() => orderStore.orders);

// Hilfsfunktion zur Formatierung von Timestamp
function formatTimestamp(timestamp: any): string {
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleString();
  }
  return new Date(timestamp).toLocaleString();
}

// Bestellungen beim Mounten laden
onMounted(async () => {
  await orderStore.fetchAllOrders();
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
