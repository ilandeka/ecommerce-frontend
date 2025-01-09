<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto px-4 py-20">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-6">
            Welcome to E-Shop
          </h1>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed to enhance your lifestyle
          </p>
          <router-link
              to="/products"
              class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="text-blue-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Fast Shipping</h3>
          <p class="text-gray-600">Get your products delivered quickly and securely with our premium shipping service.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="text-blue-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Quality Guarantee</h3>
          <p class="text-gray-600">Every product is carefully selected and quality-checked to ensure your satisfaction.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="text-blue-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Easy Returns</h3>
          <p class="text-gray-600">Not satisfied? Return your purchase within 30 days for a full refund.</p>
        </div>
      </div>
    </div>
  </div>
</template>