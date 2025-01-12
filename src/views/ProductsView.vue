<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero Section -->
    <div class="bg-black py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Our Products
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl">
          Discover our curated selection of premium products designed to elevate your play.
        </p>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex-1 min-w-[280px]">
            <div class="relative">
              <input
                  type="text"
                  placeholder="Search products..."
                  class="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg"
              >
              <Search class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <select class="pl-4 pr-10 py-2 border-2 border-gray-200 rounded-lg">
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
            v-for="product in products"
            :key="product.id"
            class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          <div class="aspect-w-1 aspect-h-1 bg-gray-200 relative overflow-hidden">
            <img
                :src="product.imageUrl || 'https://via.placeholder.com/300'"
                :alt="product.name"
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            >
            <div
                v-if="!product.available"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <span class="text-white font-semibold px-4 py-2 bg-black bg-opacity-75 rounded">
                Out of Stock
              </span>
            </div>
          </div>

          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2 text-gray-900">{{ product.name }}</h2>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>

            <div class="flex items-end justify-between">
              <span class="text-2xl font-bold text-night-600">${{ product.price }}</span>

              <div class="flex items-center space-x-2">
                <input
                    v-if="product.available"
                    type="number"
                    v-model="quantities[product.id]"
                    min="1"
                    max="99"
                    class="w-16 px-2 py-1 border-2 border-gray-200 rounded focus:border-night-500 focus:ring-night-500"
                >
                <button
                    v-if="product.available"
                    @click="addToCart(product)"
                    :disabled="isAddingToCart[product.id]"
                    class="bg-black text-gold-500 px-4 py-2 rounded-lg hover:bg-night-900 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {{ isAddingToCart[product.id] ? 'Adding...' : 'Add to Cart' }}
                </button>
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
import { Search } from 'lucide-vue-next';

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