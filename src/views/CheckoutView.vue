<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-6">Shipping Information</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <input v-model="form.fullName" type="text" required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input v-model="form.address" type="text" required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input v-model="form.city" type="text" required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">State</label>
                <input v-model="form.state" type="text" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input v-model="form.zipCode" type="text" required
                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>

            <button type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
              {{ loading ? 'Processing...' : 'Place Order' }}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

          <div class="space-y-4 mb-6">
            <div v-for="item in cartStore.cartItems" :key="item.productId"
                 class="flex justify-between">
              <span>{{ item.productName }} (x{{ item.quantity }})</span>
              <span>${{ item.subtotal }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import api from '../services/api';

const router = useRouter();
const cartStore = useCartStore();
const { showToast } = useToast();
const loading = ref(false);

const form = ref({
  fullName: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
});

async function handleSubmit() {
  loading.value = true;
  try {
    await api.post('/orders/checkout', form.value);
    showToast('Order placed successfully!', 'success');
    await router.push('/order-confirmation');
  } catch (error) {
    showToast('Failed to place order', 'error');
  } finally {
    loading.value = false;
  }
}
</script>