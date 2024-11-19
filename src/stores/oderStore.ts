import { defineStore } from "pinia";
import {collection, doc, getDocs, query, where, addDoc, updateDoc, Timestamp} from "firebase/firestore";
import {db} from "@/config/firebaseConfig";
import { ref } from "vue";
import { Order, } from "@/models/Order";
import type { OrderDTO } from "@/models/Order";

export const useOrderStore = defineStore("order", () => {
    // State
    const orders = ref<Order[]>([]);
    const isLoading = ref(false);


    async function fetchUserOrders(userId: string) {
        try {
            isLoading.value = true;
            const q = query(collection(db, "orders"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as OrderDTO;

                // Überprüfen, ob createdAt ein Timestamp ist und konvertieren
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt;

                return Order.fromDto({ ...data, createdAt });
            });

            orders.value = fetchedOrders;
        } catch (error) {
            console.error("Fehler beim Abrufen der Bestellungen:", error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchAllOrders() {
        try {
            isLoading.value = true;
            const querySnapshot = await getDocs(collection(db, "orders"));

            const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as OrderDTO;

                // Überprüfen, ob createdAt ein Timestamp ist und konvertieren
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt;

                return Order.fromDto({ ...data, createdAt }); // OrderDTO wird erstellt
            });

            orders.value = fetchedOrders;
        } catch (error) {
            console.error("Fehler beim Abrufen der Bestellungen:", error);
        } finally {
            isLoading.value = false;
        }
    }



    // Bestellung speichern
    async function createOrder(order: OrderDTO) {
        try {
            const docRef = await addDoc(collection(db, "orders"), order);
            console.log("Bestellung gespeichert mit ID:", docRef.id);
        } catch (error) {
            console.error("Fehler beim Erstellen der Bestellung:", error);
        }
    }

    // Status einer Bestellung aktualisieren
    async function updateOrderStatus(orderId: string, status: string) {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status });
            console.log("Bestellstatus aktualisiert");
            // Optional: Fetch orders again or update locally
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Bestellung:", error);
        }
    }

    return {
        orders,
        isLoading,
        fetchUserOrders,
        fetchAllOrders,
        createOrder,
        updateOrderStatus,
    };
});
