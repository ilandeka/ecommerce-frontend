<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full mx-auto space-y-8 bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo/Brand Section -->
      <div class="text-center">
        <div class="flex justify-center">
          <ShoppingBag class="w-12 h-12 text-gold-500" />
        </div>
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-night-600 hover:text-night-500 transition-colors duration-200">
            Sign up
          </router-link>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1 relative">
              <Mail class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                  v-model="form.email"
                  type="email"
                  required
                  class="pl-10 block w-full py-2 border-2 border-gray-200 rounded-lg focus:ring-night-500 focus:border-night-500 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <Lock class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                  v-model="form.password"
                  type="password"
                  required
                  class="pl-10 block w-full py-2 border-2 border-gray-200 rounded-lg focus:ring-night-500 focus:border-night-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
                type="checkbox"
                class="h-4 w-4 text-night-600 focus:ring-night-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <a href="#" class="text-sm font-medium text-night-600 hover:text-night-500">
            Forgot password?
          </a>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-night-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors duration-200"
        >
          <Loader2 v-if="loading" class="animate-spin h-5 w-5" />
          <span v-else>Sign in</span>
        </button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import { ShoppingBag, Mail, Lock, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const loading = ref(false);

const form = reactive({
  email: '',
  password: '',
});

async function handleSubmit() {
  loading.value = true;
  try {
    await authStore.login(form.email, form.password);
    showToast('Login successful', 'success');
    await router.push('/');
  } catch (error: any) {
    showToast(error.response?.data?.message || 'Login failed', 'error');
  } finally {
    loading.value = false;
  }
}
</script>
