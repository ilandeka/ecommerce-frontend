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
                  v-model="searchTerm"
                  @input="handleSearch"
                  type="text"
                  placeholder="Search products..."
                  class="w-full pl-10 pr-4 py-2 border-2 border-neutral-200 rounded-lg
                   focus:border-primary-500 focus:ring-primary-500
                   transition-colors duration-200"
              >
              <Search class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />

              <!-- Add loading indicator for search -->
              <div v-if="loading"
                   class="absolute right-3 top-2.5">
                <Loader2 class="h-5 w-5 animate-spin text-primary-500" />
              </div>
            </div>

            <!-- Add no results message -->
            <div v-if="!loading && products.length === 0"
                 class="absolute text-center py-12 text-neutral-500">
              No products found for "{{ searchTerm }}"
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

            <!-- Add sort direction toggle button -->
            <button
                @click="toggleSortDirection"
                class="p-2 border-2 border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200
           flex items-center justify-center"
                :title="sortDir === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
            >
              <ArrowUp v-if="sortDir === 'asc'" class="h-5 w-5" />
              <ArrowDown v-else class="h-5 w-5" />
            </button>
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
                :src="getProductImageUrl(product.imageUrl)"
                :alt="product.name"
                @error="(e) => handleImageError(e, product.id)"
                class="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-500"
            />

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
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="my-6 flex justify-center">
      <nav class="flex items-center gap-2">
        <!-- Previous button -->
        <button
            @click="previousPage"
            :disabled="currentPage === 0"
            class="px-3 py-2 rounded-lg border-2 border-neutral-200
             disabled:opacity-50 disabled:cursor-not-allowed
             hover:border-primary-500 transition-colors"
        >
          Previous
        </button>

        <!-- Page numbers -->
        <div class="flex gap-2">
          <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page - 1)"
              :class="[
          'px-4 py-2 rounded-lg border-2',
          currentPage === page - 1
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-neutral-200 hover:border-primary-500'
        ]"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next button -->
        <button
            @click="nextPage"
            :disabled="currentPage === totalPages - 1"
            class="px-3 py-2 rounded-lg border-2 border-neutral-200
             disabled:opacity-50 disabled:cursor-not-allowed
             hover:border-primary-500 transition-colors"
        >
          Next
        </button>
      </nav>
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
import { Search, Loader2, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-vue-next';

const router = useRouter();
const loading = ref(true);
const { showToast } = useToast();
const cartStore = useCartStore();
const authStore = useAuthStore();
const products = ref<Product[]>([]);
const quantities: { [key: number]: number } = reactive({});
const isAddingToCart: { [key: number]: boolean } = reactive({});
const searchTerm = ref('');
const searchTimeout = ref<number | null>(null);

// Keep track of images that failed to load to prevent infinite loops
const failedImages = new Set<string>()

// Sorting state
const sortField = ref('createdAt');
const sortDir = ref('desc');

// Pagination state
const currentPage = ref(0);
const pageSize = ref(8);
const totalPages = ref(0);
const totalElements = ref(0);

// Debounced search function to prevent too many API calls
function handleSearch() {
  // Clear any existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // Set new timeout
  searchTimeout.value = window.setTimeout(() => {
    currentPage.value = 0; // Reset to first page when searching
    fetchProducts();
  }, 300); // Wait 300ms after user stops typing
}

// Function to fetch products with and search
async function fetchProducts() {
  loading.value = true;
  try {
    const response = await api.get('/api/products/public', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        sort: `${sortField.value},${sortDir.value}`,
        search: searchTerm.value || undefined // Only include if not empty
      }
    });

    products.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalElements.value = response.data.totalElements;

    products.value.forEach(product => {
      quantities[product.id] = 1;
      isAddingToCart[product.id] = false;
    });
  } catch (error) {
    showToast('Error loading products', 'error');
  } finally {
    loading.value = false;
  }
}

// Pagination controls
function goToPage(page: number) {
  currentPage.value = page;
  fetchProducts();
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchProducts();
  }
}

function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchProducts();
  }
}

// Function to handle sort field changes
function handleSortChange() {
  fetchProducts();
}

// Function to toggle sort direction
function toggleSortDirection() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  fetchProducts();
}

onMounted(async () => {
  await fetchProducts();
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

function getProductImageUrl(imageUrl: string | null): string {
  // If no image URL or default image path, use the backend URL for default image
  if (!imageUrl || imageUrl === '/images/default-product.jpg') {
    return `${import.meta.env.VITE_API_URL}/images/default-product.jpg`
  }

  // For uploaded images, use full API URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL}${imageUrl}`
  }

  // For any other case, include the API URL
  return `${import.meta.env.VITE_API_URL}${imageUrl}`
}

function handleImageError(event: Event, productId: number) {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src

  // Only try default image once
  if (!failedImages.has(currentSrc)) {
    failedImages.add(currentSrc)
    img.src = `${import.meta.env.VITE_API_URL}/images/default-product.jpg`
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