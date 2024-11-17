import {defineStore} from "pinia";
import type {Ref} from 'vue'
import {ref} from "vue";
import {Product, ProductCategory} from "@/models/Product";
import type {ProductDTO} from "@/models/Product";



export const useProductStore = defineStore('product', ()=> {

    const products: Ref<ProductDTO[]> = ref([
        new Product(
            "1",
            "Gurlis Signature Bag",
            "Eine stilvolle gehäkelte Handtasche für besondere Anlässe.",
            59.99,
            ProductCategory.HANDBAGS,
            ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        ),
        new Product(
            "2",
            "Karin's Spezialtasche",
            "Perfekt für den Alltag mit praktischen Trageoptionen.",
            49.99,
            ProductCategory.SHOULDER_BAGS,
            ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        ),
        new Product(
            "3",
            "Karin's Favourite",
            "Eine lässige gehäkelte Handtasche für jeden Tag.",
            39.99,
            ProductCategory.HANDBAGS,
            ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        ),
        new Product(
            "4",
            "Die Edle Gurli",
            "Eine gehäkelte Umhängetasche für modische Akzente.",
            44.99,
            ProductCategory.SHOULDER_BAGS,
            ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        ),
        new Product(
            "5",
            "Süsson Bag",
            "Eine gehäkelte Handtasche im Vintage-Look.",
            69.99,
            ProductCategory.HANDBAGS,
            ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        ),
        new Product(
            "6",
            "Das Häckelwunder",
            "Eine elegante gehäkelte Umhängetasche für besondere Anlässe.",
            54.99,
            ProductCategory.SHOULDER_BAGS,
            ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        )
    ])


    return {
        products
    }
})