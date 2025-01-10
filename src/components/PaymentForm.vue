<template>
  <div class="w-full">
    <!-- Show any errors that happen during payment -->
    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

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

    <!-- Stripe Elements Placeholder -->
    <form id="payment-form" @submit.prevent="handleSubmit">
      <div class="mb-4">
        <div id="payment-element" class="p-4 border rounded-md"></div>
      </div>

      <button
          type="submit"
          :disabled="isLoading || !stripe || !elements"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">
          Processing...
        </span>
        <span v-else>
          Pay Now
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { paymentService } from '../services/payment.service';
import { AlertTriangle } from 'lucide-vue-next';

const props = defineProps<{
  orderId: number;
}>();

const emit = defineEmits(['paymentSuccess', 'paymentError']);
const router = useRouter();
const { showToast } = useToast();

const stripe = ref<any>(null);
const elements = ref<any>(null);
const error = ref('');
const isLoading = ref(false);
const stripeLoadError = ref(false);

// Initialize Stripe
onMounted(async () => {
  try {
    // Make sure Stripe is loaded from the global scope
    const stripeJs = (window as any).Stripe;
    if (!stripeJs) {
      throw new Error('Stripe.js failed to load. Please disable ad blockers for this site.');
    }

    // Initialize Stripe
    stripe.value = stripeJs(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    if (!stripe.value) {
      throw new Error('Failed to initialize Stripe');
    }

    // Create payment intent
    const { clientSecret } = await paymentService.createPaymentIntent(props.orderId);

    // Create payment elements
    elements.value = stripe.value.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#2563eb',
        },
      },
    });

    // Mount the payment element
    const paymentElement = elements.value.create('payment');
    paymentElement.mount('#payment-element');
  } catch (err: any) {
    stripeLoadError.value = true;
    error.value = err.message || 'Failed to initialize payment form';
    showToast(error.value, 'error');
    emit('paymentError', err);
  }
});

async function handleSubmit() {
  if (!stripe.value || !elements.value) {
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const { error: submitError } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (submitError) {
      error.value = submitError.message;
      emit('paymentError', submitError);
    } else {
      emit('paymentSuccess');
      showToast('Payment successful!', 'success');
      await router.push('/payment-success');
    }
  } catch (err: any) {
    error.value = 'An unexpected error occurred.';
    emit('paymentError', err);
  } finally {
    isLoading.value = false;
  }
}
</script>