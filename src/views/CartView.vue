<template>
  <div class="bg-neutral-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
        <span class="text-primary-600 font-medium">{{ cartStore.cartItems.length }} items</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div v-if="cartStore.cartItems.length === 0"
               class="bg-white rounded-xl p-8 text-center shadow-sm">
            <ShoppingBag class="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p class="text-neutral-600 mb-4">Your cart is empty</p>
            <router-link
                to="/products"
                class="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartStore.cartItems"
                 :key="item.productId"
                 class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <!-- Cart item content -->
              <div class="flex items-center space-x-6">
                <img
                    :src="getProductImageUrl(item.imageUrl)"
                    :alt="item.productName"
                    @error="handleImageError"
                    class="w-24 h-24 object-cover rounded-lg"
                />

                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ item.productName }}</h3>
                  <p class="text-gold-600 font-medium">${{ item.price }}</p>

                  <div class="flex items-center mt-4 space-x-4">
                    <div class="flex items-center space-x-2">
                      <button
                          @click="decreaseQuantity(item)"
                          class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-night-500 text-gray-500 hover:text-night-500 transition-colors duration-200"
                      >
                        <Minus class="w-4 h-4" />
                      </button>

                      <span class="w-8 text-center">{{ item.quantity }}</span>

                      <button
                          @click="increaseQuantity(item)"
                          class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-night-500 text-gray-500 hover:text-night-500 transition-colors duration-200"
                      >
                        <Plus class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">${{ item.subtotal }}</p>
                  <button
                      @click="removeItem(item.productId)"
                      class="mt-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-xl shadow-sm p-6 h-fit lg:sticky lg:top-8">
          <h2 class="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>

          <div class="space-y-4">
            <div class="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>${{ cartStore.total }}</span>
            </div>

            <div class="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span class="text-accent-600">Free</span>
            </div>

            <div class="border-t border-neutral-200 pt-4 mt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-neutral-900">Total</span>
                <span class="text-2xl font-bold text-primary-600">${{ cartStore.total }}</span>
              </div>
            </div>

            <button
                @click="proceedToCheckout"
                :disabled="!cartStore.cartItems.length"
                class="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700
                     disabled:bg-neutral-300 disabled:text-neutral-500 transition-colors duration-200
                     flex items-center justify-center space-x-2"
            >
              <ShoppingCart class="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import { ShoppingBag, Minus, Plus, ShoppingCart } from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();
const { showToast } = useToast();
const loading = ref(false);

// Keep track of images that failed to load to prevent infinite loops
const failedImages = new Set<string>()

onMounted(async () => {
  try {
    await cartStore.fetchCart();
  } finally {
    loading.value = false;
  }
});

async function updateQuantity(item: any, newQuantity: number) {
  if (newQuantity < 1) return;

  const success = await cartStore.updateCartItem(item.productId, newQuantity);
  if (!success) {
    showToast('Failed to update quantity', 'error');
  }
}

async function decreaseQuantity(item: any) {
  await updateQuantity(item, item.quantity - 1);
}

async function increaseQuantity(item: any) {
  await updateQuantity(item, item.quantity + 1);
}

async function removeItem(productId: number) {
  const success = await cartStore.removeFromCart(productId);
  if (success) {
    showToast('Item removed from cart', 'success');
  } else {
    showToast('Failed to remove item', 'error');
  }
}

async function proceedToCheckout() {
  if (cartStore.cartItems.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }

  loading.value = true;
  try {
    // Navigate to checkout
    await router.push('/checkout');
  } catch (error) {
    console.error('Error proceeding to checkout:', error);
    showToast('Failed to proceed to checkout', 'error');
  } finally {
    loading.value = false;
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

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  const currentSrc = img.src

  // Only try default image once
  if (!failedImages.has(currentSrc)) {
    failedImages.add(currentSrc)
    img.src = `${import.meta.env.VITE_API_URL}/images/default-product.jpg`
  }
}
</script>