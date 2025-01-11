<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div v-if="cartStore.cartItems.length === 0" class="bg-white rounded-lg p-6 text-center">
            <p class="text-gray-600">Your cart is empty</p>
            <router-link to="/products" class="text-blue-600 hover:underline mt-2 inline-block">
              Continue Shopping
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartStore.cartItems" :key="item.productId"
                 class="bg-white rounded-lg p-6 flex items-center">
              <img :src="'https://via.placeholder.com/100'" :alt="item.productName"
                   class="w-24 h-24 object-cover rounded">

              <div class="ml-6 flex-1">
                <h3 class="text-lg font-semibold">{{ item.productName }}</h3>
                <p class="text-gray-600">${{ item.price }}</p>

                <div class="flex items-center mt-2">
                  <button @click="decreaseQuantity(item)"
                          class="text-gray-500 hover:text-gray-700">
                    <span class="sr-only">Decrease quantity</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                  </button>

                  <span class="mx-4">{{ item.quantity }}</span>

                  <button @click="increaseQuantity(item)"
                          class="text-gray-500 hover:text-gray-700">
                    <span class="sr-only">Increase quantity</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="ml-6">
                <p class="text-lg font-semibold">${{ item.subtotal }}</p>
                <button @click="removeItem(item.productId)"
                        class="text-red-600 hover:text-red-800 mt-2">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div v-if="cartStore.cartItems.length > 0" class="lg:col-span-1">
          <div class="bg-white rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

            <div class="border-t border-gray-200 py-4">
              <div class="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${{ cartStore.total }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="flex justify-between font-semibold text-lg mt-4">
                <span>Total</span>
                <span>${{ cartStore.total }}</span>
              </div>
            </div>

            <button @click="proceedToCheckout"
                    class="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700">
              Proceed to Checkout
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

const router = useRouter();
const cartStore = useCartStore();
const { showToast } = useToast();
const loading = ref(false);

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
</script>