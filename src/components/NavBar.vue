<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Primary Navigation -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center space-x-2">
            <ShoppingBag class="w-6 h-6 text-blue-600" />
            <span class="text-xl font-bold text-gray-900">E-Shop</span>
          </router-link>

          <div class="hidden md:flex items-center space-x-6">
            <router-link
                to="/products"
                class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Package class="w-5 h-5" />
              <span>Products</span>
            </router-link>

            <router-link
                to="/about"
                class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
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
              class="relative flex items-center text-gray-700 hover:text-blue-600"
          >
            <ShoppingCart class="w-6 h-6" />
            <span
                v-if="cartStore.cartItems.length"
                class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.cartItems.length }}
            </span>
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center space-x-2">
              <User class="w-5 h-5 text-gray-600" />
              <span class="text-gray-700">{{ authStore.user?.fullName }}</span>
            </div>

            <button
                @click="logout"
                class="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut class="w-5 h-5" />
              <span>Logout</span>
            </button>
          </template>

          <template v-else>
            <router-link
                to="/login"
                class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <LogIn class="w-5 h-5" />
              <span>Login</span>
            </router-link>

            <router-link
                to="/register"
                class="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus class="w-5 h-5" />
              <span>Register</span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ShoppingBag, Package, Info, ShoppingCart, User, LogOut, LogIn, UserPlus } from 'lucide-vue-next';
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