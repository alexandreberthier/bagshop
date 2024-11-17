import {defineStore} from "pinia";
import {computed, ref, watch} from "vue";
import type {Ref} from "vue";
import type {Product} from "@/models/Product";
import {useRoute} from "vue-router";


export const useCartStore = defineStore('cart', () => {

    const route = useRoute()

    const showCartSlider: Ref<boolean> = ref(false)

    const savedCart = localStorage.getItem('cartItems');
    const itemsInCart: Ref<{ product: Product, quantity: number }[]> = ref(
        savedCart ? JSON.parse(savedCart) : []
    );

    function addProduct(product: Product, quantity: number) {
        const existingItemIndex = itemsInCart.value.findIndex(item => item.product.id === product.id);

        if (existingItemIndex !== -1) {
            itemsInCart.value[existingItemIndex].quantity += quantity;
        } else {
            itemsInCart.value.push({
                product: product,
                quantity: quantity
            })
        }
    }


    function deleteProduct(product: Product) {
        const itemIndex = itemsInCart.value.findIndex(item => item.product.id === product.id);

        if (itemIndex !== -1) {
            itemsInCart.value.splice(itemIndex, 1);
        }
    }

    const totalCartItems = computed(() => {
        return itemsInCart.value.reduce((total, item) => {
            return total + item.quantity
        }, 0)
    })

    const totalCartPrice = computed(() => {
        return itemsInCart.value.reduce((total, item) => {
            return total + item.product.price + item.quantity
        }, 0)
    })

    function toggleCartSlider() {
        showCartSlider.value = !showCartSlider.value
    }

    function hideCartSlider() {
        showCartSlider.value = false
    }

    watch(itemsInCart, newVal => {
        if (newVal) {
            if(route.path !== '/warenkorb') {
               showCartSlider.value = true
            }
        }
    }, {deep: true})

    watch(itemsInCart, (newVal) => {
        localStorage.setItem('cartItems', JSON.stringify(newVal));
    }, {deep: true});


    return {
        showCartSlider,
        toggleCartSlider,
        hideCartSlider,
        addProduct,
        totalCartItems,
        totalCartPrice,
        itemsInCart,
        deleteProduct
    }
})