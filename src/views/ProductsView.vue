<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-900 to-primary-800 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Our Collection
        </h1>
        <p class="text-primary-100 text-lg max-w-2xl">
          Discover our curated selection of premium products designed to enhance your lifestyle.
        </p>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="sticky top-0 bg-white border-b border-neutral-200 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[280px]">
            <div class="relative">
              <input
                  type="text"
                  placeholder="Search products..."
                  class="w-full pl-10 pr-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
              >
              <Search class="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
            </div>
          </div>

          <!-- Sort Options -->
          <div class="flex items-center space-x-4">
            <select
                v-model="sortField"
                @change="handleSortChange"
                class="pl-4 pr-10 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
            >
              <option value="createdAt">Latest</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Product Card -->
        <div
            v-for="product in products"
            :key="product.id"
            class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <!-- Product Image -->
          <div class="aspect-w-1 aspect-h-1 bg-neutral-100 relative overflow-hidden">
            <img
                :src="product.imageUrl || '/images/default-product.jpg'"
                :alt="product.name"
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            >
            <!-- Status Badge -->
            <div
                v-if="!product.available"
                class="absolute top-4 right-4 px-3 py-1 bg-neutral-900/80 text-white text-sm font-medium rounded-full"
            >
              Out of Stock
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-6 flex flex-col flex-grow">
            <div class="mb-4 flex-grow">
              <h2 class="text-lg font-semibold text-neutral-900 mb-2">{{ product.name }}</h2>
              <p class="text-neutral-600 text-sm line-clamp-2">{{ product.description }}</p>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <p class="text-2xl font-bold text-primary-700">${{ product.price }}</p>
                <p v-if="product.available" class="text-sm text-neutral-500">In Stock</p>
              </div>

              <div class="flex items-center space-x-2">
                <button
                    v-if="product.available"
                    @click="addToCart(product)"
                    :disabled="isAddingToCart[product.id]"
                    class="flex-grow bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700
                   transition-colors duration-200 disabled:bg-neutral-300
                   disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart v-if="!isAddingToCart[product.id]" class="w-4 h-4" />
                  <Loader2 v-else class="w-4 h-4 animate-spin" />
                  <span>{{ isAddingToCart[product.id] ? 'Adding...' : 'Add to Cart' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 animate-spin text-primary-600" />
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
import { Search, Loader2, ShoppingCart } from 'lucide-vue-next';

const router = useRouter();
const loading = ref(true);
const { showToast } = useToast();
const cartStore = useCartStore();
const authStore = useAuthStore();
const products = ref<Product[]>([]);
const quantities: { [key: number]: number } = reactive({});
const isAddingToCart: { [key: number]: boolean } = reactive({});
// Yet to implement
const sortField = ref('createdAt');

// IMPLEMENT: Function to handle sort field changes
function handleSortChange() {
  //currentPage.value = 0; // Reset to first page when sorting changes
  //fetchOrders();
}

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