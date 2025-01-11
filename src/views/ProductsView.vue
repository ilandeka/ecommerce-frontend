<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header and search components -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Our Products</h1>
        <div class="flex space-x-4">
          <input
              type="text"
              placeholder="Search products..."
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <select class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="aspect-w-1 aspect-h-1 bg-gray-200">
            <img
                src="https://via.placeholder.com/300"
                :alt="product.name"
                class="object-cover w-full h-48"
            >
          </div>
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-blue-600">${{ product.price }}</span>
              <div class="flex items-center space-x-2">
                <input
                    v-if="product.available"
                    type="number"
                    v-model="quantities[product.id]"
                    min="1"
                    max="99"
                    class="w-16 px-2 py-1 border rounded"
                >
                <button
                    v-if="product.available"
                    @click="addToCart(product)"
                    :disabled="isAddingToCart[product.id]"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
                >
                  {{ isAddingToCart[product.id] ? 'Adding...' : 'Add to Cart' }}
                </button>
                <span v-else class="text-red-600 font-semibold">Out of Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import api from '../services/api';
import { useToast } from '../composables/useToast';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import type { Product } from "../types/product";

const router = useRouter();
const loading = ref(true);
const { showToast } = useToast();
const cartStore = useCartStore();
const authStore = useAuthStore();
const products = ref<Product[]>([]);
const quantities: { [key: number]: number } = reactive({});
const isAddingToCart: { [key: number]: boolean } = reactive({});

onMounted(async () => {
  try {
    const response = await api.get('/products/public');
    products.value = response.data.content;
    // Initialize quantities for each product
    products.value.forEach(product => {
      quantities[product.id] = 1;
      isAddingToCart[product.id] = false;
    });
  } catch (error) {
    showToast('Error loading products', 'error');
  } finally {
    loading.value = false;
  }
});

async function addToCart(product: Product) {
  if (!authStore.isAuthenticated) {
    showToast('Please login to add items to cart', 'error');
    await router.push('/login');
    return;
  }

  isAddingToCart[product.id] = true;
  try {
    const success = await cartStore.addToCart(product.id, quantities[product.id]);
    if (success) {
      showToast(`Added ${product.name} to cart`, 'success');
    } else {
      showToast('Failed to add item to cart', 'error');
    }
  } finally {
    isAddingToCart[product.id] = false;
  }
}
</script>

<style scoped>
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>