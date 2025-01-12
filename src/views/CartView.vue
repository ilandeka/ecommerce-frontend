<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span class="text-night-600 font-medium">{{ cartStore.cartItems.length }} items</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div v-if="cartStore.cartItems.length === 0" class="bg-white rounded-2xl p-8 text-center shadow-sm">
            <ShoppingBag class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-4">Your cart is empty</p>
            <router-link
                to="/products"
                class="inline-flex items-center px-6 py-3 border-2 border-night-600 text-night-600 rounded-lg hover:bg-night-600 hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <div
                v-for="item in cartStore.cartItems"
                :key="item.productId"
                class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-center space-x-6">
                <img
                    :src="item.imageUrl || 'placeholder.jpg'"
                    :alt="item.productName"
                    class="w-24 h-24 object-cover rounded-lg"
                >

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
        <div class="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div class="space-y-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${{ cartStore.total }}</span>
            </div>

            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span class="text-green-600">Free</span>
            </div>

            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-night-600">${{ cartStore.total }}</span>
              </div>
            </div>

            <button
                @click="proceedToCheckout"
                :disabled="!cartStore.cartItems.length"
                class="w-full mt-6 bg-black text-gold-500 py-3 rounded-lg hover:bg-night-900 disabled:bg-gray-200 disabled:text-gray-400 transition-colors duration-200 font-medium"
            >
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
import { ShoppingBag, Minus, Plus } from 'lucide-vue-next';

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