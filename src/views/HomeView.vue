<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <div class="relative bg-primary-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 py-24">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-white mb-6">
            Shop with Confidence
          </h1>
          <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed to enhance your lifestyle.
          </p>
          <router-link
              to="/products"
              class="inline-flex items-center px-8 py-3 rounded-lg bg-white text-primary-600
                  hover:bg-primary-50 transition duration-300 space-x-2"
          >
            <span class="font-semibold">Explore Products</span>
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-xl shadow-sm">
          <Truck class="w-12 h-12 text-primary-600 mb-4" />
          <h3 class="text-xl font-semibold mb-2 text-neutral-900">Fast Shipping</h3>
          <p class="text-neutral-600">Get your items delivered quickly with our secure shipping service.</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-sm">
          <Shield class="w-12 h-12 text-primary-600 mb-4" />
          <h3 class="text-xl font-semibold mb-2 text-neutral-900">Secure Payments</h3>
          <p class="text-neutral-600">Shop with confidence using our encrypted payment system.</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-sm">
          <Headphones class="w-12 h-12 text-primary-600 mb-4" />
          <h3 class="text-xl font-semibold mb-2 text-neutral-900">24/7 Support</h3>
          <p class="text-neutral-600">Our customer service team is always here to help you.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-vue-next';
</script>