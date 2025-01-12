<!-- src/components/PaymentForm.vue -->
<template>
  <div class="w-full">
    <!-- Error Display Section -->
    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <!-- Ad Blocker Warning -->
    <div v-if="stripeLoadError" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertTriangle class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Unable to load payment form. Please disable ad blockers for this site to complete your purchase.
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!initialized && !error" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Stripe Payment Form -->
    <form id="payment-form" @submit.prevent="handleSubmit">
      <div class="mb-4">
        <!-- Add ref to this div -->
        <div ref="paymentElementRef" class="p-4 border rounded-md"></div>
      </div>

      <button
          type="submit"
          :disabled="isLoading || !stripe || !elements"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Processing...</span>
        <span v-else>Pay Now</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { paymentService } from '../services/payment.service';
import { AlertTriangle } from 'lucide-vue-next';

// Define props with TypeScript - orderId is required and must be a number
const props = defineProps<{
  orderId: number;
}>();

// Define events that this component can emit
const emit = defineEmits(['paymentSuccess', 'paymentError']);

// Initialize component dependencies
const router = useRouter();
const { showToast } = useToast();

// Component state management
const stripe = ref<any>(null);
const elements = ref<any>(null);
const error = ref('');
const isLoading = ref(false);
const stripeLoadError = ref(false);
const initialized = ref(false);
const paymentElementRef = ref<HTMLElement | null>(null);

// Function to initialize Stripe and create payment elements
async function initializeStripe() {
  if (initialized.value || !props.orderId || !paymentElementRef.value) return;

  try {
    // Check if Stripe.js is loaded (might be blocked by ad blockers)
    const stripeJs = (window as any).Stripe;
    if (!stripeJs) {
      showToast('Stripe.js failed to load. Please disable ad blockers for this site.','error');
    }

    // Initialize Stripe with your publishable key
    stripe.value = stripeJs(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (!stripe.value) {
      showToast('Failed to initialize Stripe.','error');
    }

    // Create a payment intent for this order
    const { clientSecret } = await paymentService.createPaymentIntent(props.orderId);

    // Create and configure Stripe Elements
    elements.value = stripe.value.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#2563eb',
        },
      },
    });

    // Wait for the next DOM update
    await nextTick();

    // Mount the payment element to the DOM
    const paymentElement = elements.value.create('payment');
    paymentElement.mount(paymentElementRef.value);
    initialized.value = true;
  } catch (err: any) {
    console.error('Stripe initialization error:', err);
    stripeLoadError.value = true;
    error.value = err.message || 'Failed to initialize payment form';
    showToast(error.value, 'error');
    emit('paymentError', err);
  }
}

// Initialize when component mounts AND we have an orderId
onMounted(() => {
  if (props.orderId && !initialized.value) {
    initializeStripe();
  }
});

// Watch for changes to orderId prop in case it's not available immediately
watch(() => props.orderId, async (newOrderId) => {
  if (newOrderId && !initialized.value) {
    await initializeStripe();
  }
}, { immediate: true });

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
      // Handle payment error
      error.value = submitError.message;
      emit('paymentError', submitError);
      showToast(submitError.message || 'Payment failed', 'error');
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