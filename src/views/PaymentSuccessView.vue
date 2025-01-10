<template>
  <div class="min-h-screen bg-gray-100 py-12">
    <div class="max-w-xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow p-8 text-center">
        <div class="mb-6 text-green-500">
          <CheckCircle class="w-16 h-16 mx-auto" />
        </div>
        <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p class="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully and your order is now confirmed.
        </p>
        <div class="space-y-4">
          <p class="text-sm text-gray-500">
            A confirmation email will be sent to your registered email address.
          </p>
          <router-link
              to="/products"
              class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next';
</script>