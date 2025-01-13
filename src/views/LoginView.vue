<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <ShoppingBag class="w-12 h-12 text-primary-600 mx-auto" />
          <h2 class="mt-4 text-3xl font-bold text-neutral-900">Welcome back</h2>
          <p class="mt-2 text-neutral-600">
            Don't have an account?
            <router-link to="/register" class="text-primary-600 hover:text-primary-500">
              Sign up
            </router-link>
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-neutral-700">Email</label>
            <div class="mt-1 relative">
              <Mail class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="form.email"
                  type="email"
                  required
                  class="py-2 pl-10 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                      focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700">Password</label>
            <div class="mt-1 relative">
              <Lock class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="form.password"
                  type="password"
                  required
                  class="py-2 pl-10 block w-full rounded-lg border-2 border-neutral-300 shadow-sm
                      focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              Forgot password?
            </a>
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700
                  transition-colors duration-200 disabled:bg-neutral-300
                  flex items-center justify-center space-x-2"
          >
            <Loader2 v-if="loading" class="animate-spin h-5 w-5" />
            <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </form>
      </div>
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
