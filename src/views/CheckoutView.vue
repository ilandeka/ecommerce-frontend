<template>
  <div class="bg-neutral-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Step Indicator -->
      <div class="mb-12">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center justify-between">
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200',
                currentStep === 1 ? 'border-primary-500 bg-primary-600 text-white' :
                currentStep > 1 ? 'border-accent-500 bg-accent-500 text-white' :
                'border-neutral-300 text-neutral-400'
              ]">
                <Check v-if="currentStep > 1" class="w-6 h-6" />
                <span v-else>1</span>
              </div>
              <span class="mt-2 text-sm font-medium text-neutral-900">Shipping</span>
            </div>

            <div class="flex-1 h-px bg-neutral-200 mx-4">
              <div :class="[
                'h-full transition-all duration-500',
                currentStep > 1 ? 'bg-accent-500' : 'bg-neutral-200'
              ]" />
            </div>

            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200',
                currentStep === 2 ? 'border-primary-500 bg-primary-600 text-white' :
                'border-neutral-300 text-neutral-400'
              ]">
                <span>2</span>
              </div>
              <span class="mt-2 text-sm font-medium text-neutral-900">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Forms -->
        <div class="lg:col-span-2">
          <!-- Shipping Form -->
          <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-neutral-900 mb-6">Shipping Information</h2>
            <form @submit.prevent="handleShippingSubmit" class="space-y-4">
              <!-- Form fields with updated styling -->
              <div>
                <label class="block text-sm font-medium text-neutral-700">Full Name</label>
                <input
                    v-model="form.fullName"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                         focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input
                    v-model="form.address"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                         focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                      v-model="form.city"
                      type="text"
                      required
                      class="mt-1 pl-2 py-2 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                         focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">State</label>
                  <input
                      v-model="form.state"
                      type="text"
                      required
                      class="mt-1 pl-2 py-2 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                         focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                    v-model="form.zipCode"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                         focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700
                       transition-colors disabled:bg-neutral-300 flex items-center justify-center space-x-2"
              >
                <span>{{ loading ? 'Processing...' : 'Continue to Payment' }}</span>
                <ArrowRight class="w-5 h-5" v-if="!loading" />
                <Loader2 class="w-5 h-5 animate-spin" v-else />
              </button>
            </form>
          </div>

          <!-- Payment Form -->
          <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-neutral-900 mb-6">Payment Information</h2>
            <div v-if="orderId === null" class="text-accent-600">
              Order not found. Please try again.
            </div>
            <PaymentForm
                v-else
                :order-id="orderId"
                @payment-success="handlePaymentSuccess"
                @payment-error="handlePaymentError"
            />
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h2 class="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>
            <!-- Order items -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.cartItems" :key="item.productId"
                   class="flex justify-between text-sm">
                <span class="text-neutral-600">
                  {{ item.productName }} (x{{ item.quantity }})
                </span>
                <span class="font-medium text-neutral-900">${{ item.subtotal }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t border-neutral-200 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-neutral-600">Subtotal</span>
                <span class="font-medium text-neutral-900">${{ cartStore.total }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-neutral-600">Shipping</span>
                <span class="text-accent-600">Free</span>
              </div>
              <div class="flex justify-between text-lg font-bold mt-4">
                <span class="text-neutral-900">Total</span>
                <span class="text-primary-600">${{ cartStore.total }}</span>
              </div>
            </div>

            <!-- Shipping Info Summary -->
            <div v-if="currentStep === 2" class="mt-6 pt-6 border-t border-neutral-200">
              <h3 class="font-medium text-neutral-900 mb-2">Shipping To:</h3>
              <div class="text-sm text-neutral-600">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import PaymentForm from '../components/PaymentForm.vue';
import api from '../services/api';
import { Check, Loader2, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();
const { showToast } = useToast();
const loading = ref(false);
const orderId = ref<number | null>(null);
const currentStep = ref(1);

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

async function handleShippingSubmit() {
  if (!cartStore.cartItems.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/api/orders/checkout', form.value);

    // Check if we have a valid orderId in the response
    if (!response.data.orderId) {
      showToast('Failed to process checkout. Try, again!', 'error');
    }

    // Set the orderId directly - no need for parsing since it's already a number
    orderId.value = response.data.orderId;

    // Only advance to payment step if we have a valid orderId
    if (orderId.value) {
      currentStep.value = 2;
      showToast('Shipping information saved. Please complete payment.', 'success');
    } else {
      showToast('Failed to create order. Try, again!', 'error');
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    showToast(error.message || 'Failed to process checkout', 'error');
    orderId.value = null;
  } finally {
    loading.value = false;
  }
}

async function handlePaymentSuccess() {
  try {
    const success = await cartStore.clearCart();
    if (success) {
      showToast('Payment completed successfully!', 'success');
      await router.push('/payment-success');
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