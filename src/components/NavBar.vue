<template>
  <nav class="bg-black">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center">
            <ShoppingBag class="w-8 h-8 text-gold-500" />
            <span class="ml-2 text-2xl font-bold text-white">Luxe</span>
          </router-link>

          <div class="hidden md:flex items-center space-x-8">
            <router-link
                to="/products"
                class="text-gray-300 hover:text-gold-500 transition-colors duration-200"
            >
              Products
            </router-link>
            <router-link
                to="/about"
                class="text-gray-300 hover:text-gold-500 transition-colors duration-200"
            >
              About
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <router-link
              v-if="authStore.isAuthenticated"
              to="/cart"
              class="relative group"
          >
            <ShoppingCart class="w-6 h-6 text-gray-300 group-hover:text-gold-500 transition-colors duration-200" />
            <span
                v-if="cartStore.cartItems.length"
                class="absolute -top-2 -right-2 bg-night-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-black"
            >
              {{ cartStore.cartItems.length }}
            </span>
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center space-x-4">
              <router-link
                  to="/profile"
                  class="flex items-center space-x-2 text-gray-300 hover:text-gold-500 transition-colors duration-200"
              >
                <User class="w-5 h-5" />
                <span>{{ authStore.user?.fullName }}</span>
              </router-link>

              <button
                  @click="logout"
                  class="flex items-center space-x-2 text-gray-300 hover:text-gold-500 transition-colors duration-200"
              >
                <LogOut class="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </template>

          <template v-else>
            <router-link
                to="/login"
                class="flex items-center space-x-1 text-gray-300 hover:text-gold-500 transition-colors duration-200"
            >
              <LogIn class="w-5 h-5" />
              <span>Login</span>
            </router-link>

            <router-link
                to="/register"
                class="flex items-center space-x-1 bg-night-600 text-white px-4 py-2 rounded-lg hover:bg-night-700 transition-colors duration-200"
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
import { ShoppingBag, ShoppingCart, User, LogOut, LogIn, UserPlus } from 'lucide-vue-next';
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