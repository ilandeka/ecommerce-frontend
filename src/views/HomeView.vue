<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <div class="relative bg-primary-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 py-24">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-white mb-6">
            Shop with Confidence
          </h1>
          <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed to enhance your lifestyle.
          </p>
          <router-link
              to="/products"
              class="inline-flex items-center px-8 py-3 rounded-lg bg-white text-primary-600
                  hover:bg-primary-50 transition duration-300 space-x-2"
          >
            <span class="font-semibold">Explore Products</span>
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-xl shadow-sm">
          <Truck class="w-12 h-12 text-primary-600 mb-4" />
          <h3 class="text-xl font-semibold mb-2 text-neutral-900">Fast Shipping</h3>
          <p class="text-neutral-600">Get your items delivered quickly with our secure shipping service.</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-sm">
          <Shield class="w-12 h-12 text-primary-600 mb-4" />
          <h3 class="text-xl font-semibold mb-2 text-neutral-900">Secure Payments</h3>
          <p class="text-neutral-600">Shop with confidence using our encrypted payment system.</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-sm">
          <Headphones class="w-12 h-12 text-primary-600 mb-4" />
          <h3 class="text-xl font-semibold mb-2 text-neutral-900">24/7 Support</h3>
          <p class="text-neutral-600">Our customer service team is always here to help you.</p>
        </div>
      </div>
    </div>

    <!-- Featured Products -->
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-neutral-900 mb-8">Featured Products</h2>

      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 animate-spin text-primary-600" />
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8">
        <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <!-- Product Image -->
          <div class="aspect-w-1 aspect-h-1 bg-neutral-100">
            <img
                :src="getProductImageUrl(product.imageUrl)"
                :alt="product.name"
                @error="handleImageError"
                class="object-cover w-full h-48"
            />
          </div>

          <!-- Product Info -->
          <div class="p-6">
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ product.name }}</h3>
            <p class="text-neutral-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <p class="text-2xl font-bold text-primary-700">${{ product.price }}</p>
              <button
                  @click="addToCart(product)"
                  :disabled="isAddingToCart[product.id]"
                  class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700
                       transition-colors duration-200 flex items-center space-x-2"
              >
                <ShoppingCart class="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ArrowRight, Truck, Shield, Headphones, ShoppingCart, Loader2 } from 'lucide-vue-next';
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
const featuredProducts = ref<Product[]>([]);
const isAddingToCart: { [key: number]: boolean } = reactive({});

// Fetch featured products
async function fetchFeaturedProducts() {
  try {
    const response = await api.get('/api/products/public', {
      params: {
        page: 0,
        size: 3,
        sort: 'createdAt,desc'
      }
    });
    featuredProducts.value = response.data.content;
  } catch (error) {
    showToast('Error loading featured products', 'error');
  } finally {
    loading.value = false;
  }
}

// Add to cart functionality (same as ProductsView)
async function addToCart(product: Product) {
  if (!authStore.isAuthenticated) {
    showToast('Please login to add items to cart', 'error');
    await router.push('/login');
    return;
  }

  isAddingToCart[product.id] = true;
  try {
    const success = await cartStore.addToCart(product.id, 1);
    if (success) {
      showToast(`Added ${product.name} to cart`, 'success');
    } else {
      showToast('Failed to add item to cart', 'error');
    }
  } finally {
    isAddingToCart[product.id] = false;
  }
}

// Image handling functions (same as ProductsView)
function getProductImageUrl(imageUrl: string | null): string {
  if (!imageUrl || imageUrl === '/images/default-product.jpg') {
    return `${import.meta.env.VITE_API_URL}/images/default-product.jpg`
  }
  if (imageUrl.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL}${imageUrl}`
  }
  return `${import.meta.env.VITE_API_URL}${imageUrl}`
}

const failedImages = new Set<string>()

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src

  // Only try default image once
  if (!failedImages.has(currentSrc)) {
    failedImages.add(currentSrc)
    img.src = `${import.meta.env.VITE_API_URL}/images/default-product.jpg`
  }
}

onMounted(() => {
  fetchFeaturedProducts();
});
</script>