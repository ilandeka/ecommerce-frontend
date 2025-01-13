<template>
  <nav class="bg-primary-900 text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Primary Navigation -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center space-x-2">
            <ShoppingBag class="w-6 h-6 text-primary-300" />
            <span class="text-xl font-bold">E-Shop</span>
          </router-link>

          <div class="hidden md:flex items-center space-x-6">
            <router-link
                to="/products"
                class="flex items-center space-x-1 text-neutral-100 hover:text-primary-300 transition-colors"
            >
              <Package class="w-5 h-5" />
              <span>Products</span>
            </router-link>

            <router-link
                to="/about"
                class="flex items-center space-x-1 text-neutral-100 hover:text-primary-300 transition-colors"
            >
              <Info class="w-5 h-5" />
              <span>About</span>
            </router-link>
          </div>
        </div>

        <!-- User Navigation -->
        <div class="flex items-center space-x-6">
          <router-link
              v-if="authStore.isAuthenticated"
              to="/cart"
              class="relative group transition-transform hover:scale-110 duration-200"
          >
            <ShoppingCart class="w-6 h-6 text-neutral-100 group-hover:text-primary-300" />
            <span
                v-if="cartStore.cartItems.length"
                class="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform transition-all duration-200 group-hover:scale-110"
            >
              {{ cartStore.cartItems.length }}
            </span>
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link
                to="/profile"
                class="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-800 transition-all duration-200"
            >
              <User class="w-5 h-5 text-neutral-100 group-hover:text-primary-300" />
              <span class="text-neutral-100 group-hover:text-primary-300">{{ authStore.user?.fullName }}</span>
            </router-link>

            <button
                @click="logout"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-800/80 transition-all duration-200"
            >
              <LogOut class="w-5 h-5 text-neutral-100 group-hover:text-primary-300" />
              <span>Logout</span>
            </button>
          </template>

          <template v-else>
            <router-link
                to="/login"
                class="text-neutral-100 hover:text-primary-300 transition-colors duration-200"
            >
              Login
            </router-link>

            <router-link
                to="/register"
                class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Register
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ShoppingBag, ShoppingCart, User, LogOut, Package, Info } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const { showToast } = useToast();

async function logout() {
  try {
    await authStore.logout();
    showToast('Logged out successfully', 'success');
    router.push('/login');
  } catch (error) {
    showToast('Error logging out', 'error');
  }
}
</script>