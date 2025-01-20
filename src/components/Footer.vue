<template>
  <footer class="bg-neutral-50 border-t mt-8">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-neutral-900">Our Store</h3>
          <p class="text-neutral-600">Quality products for your lifestyle.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-neutral-400 hover:text-primary-600">
              <Facebook class="h-6 w-6" />
            </a>
            <a href="#" class="text-neutral-400 hover:text-primary-600">
              <Twitter class="h-6 w-6" />
            </a>
            <a href="#" class="text-neutral-400 hover:text-primary-600">
              <Instagram class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/products" class="text-neutral-600 hover:text-primary-600">
                Products
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-neutral-600 hover:text-primary-600">
                About Us
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-neutral-600 hover:text-primary-600">
                Contact
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Customer Service</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-neutral-600 hover:text-primary-600">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" class="text-neutral-600 hover:text-primary-600">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="#" class="text-neutral-600 hover:text-primary-600">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Contact Us</h3>
          <ul class="space-y-2">
            <li class="flex items-center space-x-2 text-neutral-600">
              <MapPin class="h-5 w-5" />
              <span>123 Store Street, City, Country</span>
            </li>
            <li class="flex items-center space-x-2 text-neutral-600">
              <Mail class="h-5 w-5" />
              <span>support@store.com</span>
            </li>
            <li class="flex items-center space-x-2 text-neutral-600">
              <Phone class="h-5 w-5" />
              <span>+1 234 567 8900</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t">
        <p class="text-center text-neutral-600">
          © {{ new Date().getFullYear() }} E-commerce Store. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from 'lucide-vue-next';
</script>