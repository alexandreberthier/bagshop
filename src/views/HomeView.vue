<template>
  <div class="site-wrapper">
    <div class="filter-section">
      <DynamicInputField
          :input-type="InputType.Search"
          v-model:user-input="searchInput"
          label=""/>

      <div class="categories">
        <div
            v-for="(category, index) in categoryOptions"
            :key="index"
            :class="['category', {'active': selectedCategory === category.value}]">
          <label :for="category.id">{{ category.label }}</label>
          <input
              v-model="selectedCategory"
              type="radio" :name="category.name" :id="category.id" :value="category.value">
        </div>
      </div>
      <div v-if="hasActiveFilters" class="button-wrapper">
        <button class="reset-filters" @click="resetFilters">
          Filter zurücksetzen
        </button>
      </div>
    </div>
    <div class="product-flex">
      <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from "@/components/ProductCard.vue";
import {useProductStore} from "@/stores/productStore";
import {computed, type Ref, ref} from "vue";
import DynamicInputField from "@/components/DynamicInputField.vue";
import {InputType} from "@/enums/InputType";
import {ProductCategory} from "@/models/Product";


const productStore = useProductStore()

const products = computed(() => {
  return productStore.products
})
const searchInput: Ref<string> = ref('')
const selectedCategory: Ref<string> = ref('')

const filteredProducts = computed(() => {
  const byCategory = products.value.filter(product => {
    return !selectedCategory.value || product.category === selectedCategory.value;
  });

  return byCategory.filter(product => {
    return !searchInput.value || product.displayName.toLowerCase().includes(searchInput.value.toLowerCase());
  })
})

function resetFilters() {
  searchInput.value = '';
  selectedCategory.value = '';
}

const hasActiveFilters = computed(() => {
  return !!searchInput.value || !!selectedCategory.value;
});


const categoryOptions = ref([
  {
    id: '1',
    name: 'category',
    label: 'Handtaschen',
    value: ProductCategory.HANDBAGS
  },
  {
    id: '2',
    name: 'category',
    label: 'Umhängetaschen',
    value: ProductCategory.SHOULDER_BAGS
  }
])
</script>

<style scoped>

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .categories {
    display: flex;
    align-items: center;
    gap: 32px;

    .category {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border: 1px solid var(--black);
      cursor: pointer;
      padding: 5px 10px;
      width: 48%;

      &.active {
        background-color: var(--light-gray)
      }

      label {
        cursor: pointer;
      }

      input {
        display: none;
      }
    }
  }

  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;

    .reset-filters {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid black;
      background-color: var(--white);
      padding: 5px 10px;
      width: 100px;
      font-size: 12px;
      cursor: pointer;
    }
  }


}

.product-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
}

</style>