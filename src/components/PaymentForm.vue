<template>
  <div class="w-full">
    <!-- Error Display Section -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
      <div class="flex">
        <AlertCircle class="w-5 h-5 text-red-500 mr-3" />
        <div class="ml-3">
          <p class="text-sm text-red-800">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Ad Blocker Warning -->
    <div v-if="stripeLoadError"
         class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
      <div class="flex">
        <AlertTriangle class="h-5 w-5 text-yellow-400 mr-3" />
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Unable to load payment form. Please disable ad blockers for this site to complete your purchase.
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Security Notice -->
    <div class="mb-6 p-4 bg-primary-50 rounded-lg">
      <div class="flex items-start">
        <InfoIcon class="w-5 h-5 text-primary-600 mr-3" />
        <p class="text-sm text-primary-600">
          Your payment information is encrypted and secure. We never store your full card details.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <Loader2 class="w-8 h-8 animate-spin text-primary-600" />
    </div>

    <!-- Stripe Payment Form -->
    <form v-show="!isLoading" id="payment-form" @submit.prevent="handleSubmit">
      <!-- Payment Element Container -->
      <div class="mb-6">
        <div ref="paymentElementRef"
             class="p-4 border border-neutral-200 rounded-lg">
        </div>
      </div>

      <!-- Payment Total -->
      <div class="mb-6 p-4 bg-neutral-50 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-neutral-700">Total to pay:</span>
          <span class="text-2xl font-bold text-primary-600">${{ cartStore.total }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
          type="submit"
          :disabled="isLoading || !stripe || !elements"
          class="w-full bg-primary-600 text-white py-4 px-6 rounded-lg hover:bg-primary-700
               transition-colors duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed
               flex items-center justify-center space-x-3"
      >
        <Lock v-if="!isLoading" class="w-5 h-5" />
        <Loader2 v-else class="w-5 h-5 animate-spin" />
        <span>{{ isLoading ? 'Processing...' : 'Pay Securely' }}</span>
      </button>

      <!-- Payment Methods Accepted -->
      <div class="mt-6 flex items-center justify-center space-x-4">
        <img src="@/assets/images/cards/visa.svg" alt="Visa" class="h-8" />
        <img src="@/assets/images/cards/mastercard.svg" alt="Mastercard" class="h-8" />
        <img src="@/assets/images/cards/amex.svg" alt="American Express" class="h-8" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { useCartStore } from '../stores/cart';
import { paymentService } from "../services/payment.service";
import { AlertTriangle, AlertCircle, Lock, InfoIcon, Loader2 } from 'lucide-vue-next';

// Define props with TypeScript - orderId is required and must be a number
const props = defineProps<{
  orderId: number;
  clientSecret: string;
}>();

// Define events that this component can emit
const emit = defineEmits(['paymentSuccess', 'paymentError']);

// Initialize component dependencies
const router = useRouter();
const { showToast } = useToast();
const cartStore = useCartStore();

// Component state management
const stripe = ref<any>(null);
const elements = ref<any>(null);
const error = ref('');
const isLoading = ref(true);
const stripeLoadError = ref(false);
const paymentElementRef = ref<HTMLElement | null>(null);

// Function to initialize Stripe and create payment elements
async function initializeStripe() {
  try {
    // Check if Stripe.js is loaded (might be blocked by ad blockers)
    const stripeJs = (window as any).Stripe;
    if (!stripeJs || !props.orderId) {
      showToast('Stripe.js failed to load. Please disable ad blockers for this site.','error');
    }

    // Initialize Stripe with your publishable key
    stripe.value = stripeJs(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (!stripe.value) {
      showToast('Failed to initialize Stripe.','error');
    }

    // Create and configure Stripe Elements
    elements.value = stripe.value.elements({
      clientSecret: props.clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0ea5e9', // primary-600
          colorBackground: '#ffffff',
          colorText: '#171717', // neutral-900
          colorDanger: '#ef4444', // red-500
          borderRadius: '8px',
        },
      },
    });

    // Mount the payment element to the DOM
    const paymentElement = elements.value.create('payment');
    paymentElement.mount(paymentElementRef.value);
  } catch (err: any) {
    console.error('Stripe initialization error:', err);
    stripeLoadError.value = true;
    error.value = err.message || 'Failed to initialize payment form';
    showToast(error.value, 'error');
    emit('paymentError', err);
  } finally {
    isLoading.value = false;
  }
}

// Initialize when component mounts AND we have an orderId
onMounted(() => {
  if (props.orderId) {
    initializeStripe();
  }
});

// Handle form submission and payment processing
async function handleSubmit() {
  if (!stripe.value || !elements.value) {
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    // Confirm the payment with Stripe
    const { error: submitError } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (submitError) {
      if (submitError.type === 'card_error') {
        // Handle payment error
        error.value = submitError.message;
        emit('paymentError', submitError);
        showToast(submitError.message || 'Payment failed', 'error');
      } else {
        // Try to get a new payment intent
        try {
          const { clientSecret: newClientSecret } = await paymentService.retryPayment(props.orderId);

          // Reinitialize elements with new client secret
          elements.value = stripe.value.elements({
            clientSecret: newClientSecret,
            appearance: elements.value.getAppearance()
          });

          const paymentElement = elements.value.create('payment');
          paymentElement.mount(paymentElementRef.value);

          showToast('Please try your payment again', 'info');
        } catch (retryError) {
          emit('paymentError', retryError);
          showToast('Failed to retry payment. Please try again later.', 'error');
        }
      }
    } else {
      // Handle successful payment
      emit('paymentSuccess');
      showToast('Payment successful!', 'success');
      await router.push('/payment-success');
    }
  } catch (err: any) {
    // Handle unexpected errors
    error.value = 'An unexpected error occurred.';
    emit('paymentError', err);
    showToast('An unexpected error occurred during payment', 'error');
  } finally {
    isLoading.value = false;
  }
}
</script>