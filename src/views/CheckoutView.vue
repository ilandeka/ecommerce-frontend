<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      <!-- Step Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center">
          <div class="flex items-center">
            <div :class="[
                'rounded-full w-8 h-8 flex items-center justify-center',
                currentStep === 1 ? 'bg-blue-600 text-white' : (isShippingComplete ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600')
              ]">
              <CheckCircle v-if="isShippingComplete" class="w-5 h-5" />
              <span v-else>1</span>
            </div>
            <div class="ml-2 text-sm font-medium">Shipping</div>
            <div class="mx-4 h-1 w-16 bg-gray-200">
              <div :class="[
                'h-full transition-all duration-300',
                orderId ? 'bg-green-500' : 'bg-gray-200'
              ]"></div>
            </div>
          </div>

          <div class="flex items-center">
            <div :class="[
              'rounded-full w-8 h-8 flex items-center justify-center',
              !orderId ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white'
            ]">
              <span>2</span>
            </div>
            <div class="ml-2 text-sm font-medium">Payment</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Area (Shipping/Payment) -->
        <div class="lg:col-span-2">
          <!-- Shipping Information Form -->
          <div v-if="!orderId" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-6">Shipping Information</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    v-model="form.fullName"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input
                    v-model="form.address"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                      v-model="form.city"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">State</label>
                  <input
                      v-model="form.state"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                    v-model="form.zipCode"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {{ loading ? 'Processing...' : 'Continue to Payment' }}
              </button>
            </form>
          </div>

          <!-- Payment Form -->
          <div v-else class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-6">Payment Information</h2>
            <PaymentForm
                :order-id="orderId"
                @payment-success="handlePaymentSuccess"
                @payment-error="handlePaymentError"
            />
          </div>
        </div>

        <!-- Order Summary (Always Visible) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.cartItems" :key="item.productId"
                   class="flex justify-between text-sm">
                <span class="text-gray-600">
                  {{ item.productName }} (x{{ item.quantity }})
                </span>
                <span class="font-medium">${{ item.subtotal }}</span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ cartStore.total }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="text-green-600">Free</span>
              </div>
              <div class="flex justify-between text-lg font-semibold mt-4">
                <span>Total</span>
                <span>${{ cartStore.total }}</span>
              </div>
            </div>

            <!-- Shipping Information Summary (when on payment step) -->
            <div v-if="orderId" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="font-medium text-gray-900 mb-2">Shipping To:</h3>
              <div class="text-sm text-gray-600">
                <p>{{ form.fullName }}</p>
                <p>{{ form.address }}</p>
                <p>{{ form.city }}, {{ form.state }} {{ form.zipCode }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import PaymentForm from '../components/PaymentForm.vue';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { showToast } = useToast();
const loading = ref(false);
const orderId = ref<number | null>(null);
const currentStep = computed(() => orderId.value ? 2 : 1);
const isShippingComplete = computed(() => Boolean(orderId.value));

const form = ref({
  fullName: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
});

onMounted(async () => {
  // Check if we have items in the cart
  if (!cartStore.cartItems.length) {
    showToast('Your cart is empty', 'error');
    await router.push('/cart');
    return;
  }

  // Initialize cart data
  await cartStore.fetchCart();
});

async function handleSubmit() {
  // First, let's validate that we have a valid order ID
  const orderIdParam = route.query.orderId;
  if (!orderIdParam) {
    showToast('No order found. Please start from cart page', 'error');
    await router.push('/cart');
    return;
  }

  // Set the order ID from the URL parameter
  orderId.value = parseInt(orderIdParam as string);

  // Additional validation to ensure cart is not empty
  if (!cartStore.cartItems.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  loading.value = true;
  try {
    // Make the API call to update shipping information for the existing order
    await api.put(`/orders/${orderId.value}/shipping`, form.value);

    // Show success message and continue to payment step
    showToast('Shipping information saved. Please complete payment.', 'success');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to process shipping information';
    showToast(errorMessage, 'error');

    // If there's an issue with the order ID, redirect back to cart
    if (error.response?.status === 404) {
      await router.push('/cart');
    }
  } finally {
    loading.value = false;
  }
}

async function handlePaymentSuccess() {
  try {
    // Clear the cart after successful payment
    const success = await cartStore.clearCart();
    if (success) {
      showToast('Payment completed successfully!', 'success');
    } else {
      showToast('Payment completed but failed to clear cart', 'error');
    }
  } catch (error) {
    showToast('Error processing payment completion', 'error');
  }
}

function handlePaymentError(error: Error) {
  showToast(error.message || 'Payment failed', 'error');
}
</script>