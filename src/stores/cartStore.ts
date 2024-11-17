import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import type { Product } from "@/models/Product";
import { Product as ProductModel } from "@/models/Product";

export const useCartStore = defineStore('cart', () => {
    const showCartSlider: Ref<boolean> = ref(false);

    const savedCart = localStorage.getItem('cartItems');
    const itemsInCart: Ref<{ product: Product, quantity: number }[]> = ref(
        savedCart
            ? JSON.parse(savedCart).map((item: any) => ({
                product: ProductModel.fromDto(item.product),
                quantity: item.quantity
            }))
            : []
    );

    function addProduct(product: Product, quantity: number) {
        const existingItemIndex = itemsInCart.value.findIndex(item => item.product.id === product.id);

        if (existingItemIndex !== -1) {
            itemsInCart.value[existingItemIndex].quantity += quantity;
        } else {
            itemsInCart.value.push({
                product: product,
                quantity: quantity
            });
        }
    }

    function deleteProduct(product: Product) {
        const itemIndex = itemsInCart.value.findIndex(item => item.product.id === product.id);

        if (itemIndex !== -1) {
            itemsInCart.value.splice(itemIndex, 1);
        }
    }

    const totalCartItems = computed(() => {
        return itemsInCart.value.reduce((total, item) => total + item.quantity, 0);
    });

    const totalCartPrice = computed(() => {
        return itemsInCart.value.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
    });

    const deliveryCosts: Ref<number> = ref(7.90);

    const totalCartPriceWithDeliveryCosts = computed(() => {
        return itemsInCart.value.reduce((total, item) => {
            return total + item.quantity * item.product.price;
        }, deliveryCosts.value);
    });

    function toggleCartSlider() {
        showCartSlider.value = !showCartSlider.value;
    }

    function hideCartSlider() {
        showCartSlider.value = false;
    }

    watch(itemsInCart, (newVal) => {
        localStorage.setItem(
            'cartItems',
            JSON.stringify(newVal.map(item => ({
                product: item.product.toDto(),
                quantity: item.quantity
            })))
        );
    }, { deep: true });

    return {
        showCartSlider,
        toggleCartSlider,
        hideCartSlider,
        addProduct,
        totalCartItems,
        totalCartPrice,
        itemsInCart,
        deleteProduct,
        deliveryCosts,
        totalCartPriceWithDeliveryCosts
    }
})
