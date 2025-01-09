<template>
  <nav class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-xl font-bold">E-Shop</router-link>
          <router-link to="/products" class="hover:text-gray-300">Products</router-link>
          <router-link to="/about" class="hover:text-gray-300">About</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <span>{{ authStore.user?.fullName }}</span>
            <button @click="logout" class="hover:text-gray-300">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="hover:text-gray-300">Login</router-link>
            <router-link to="/register" class="hover:text-gray-300">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';

const authStore = useAuthStore();
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