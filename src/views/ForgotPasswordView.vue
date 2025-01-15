<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <Key class="w-12 h-12 text-primary-600 mx-auto" />
          <h2 class="mt-4 text-3xl font-bold text-neutral-900">Forgot Password</h2>
          <p class="mt-2 text-neutral-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-neutral-700">Email</label>
            <div class="mt-1 relative">
              <Mail class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="email"
                  type="email"
                  required
                  class="py-2 pl-10 w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700
                transition-colors duration-200 disabled:bg-neutral-300
                flex items-center justify-center space-x-2"
          >
            <Loader2 v-if="loading" class="animate-spin h-5 w-5" />
            <span>{{ loading ? 'Sending...' : 'Send Reset Link' }}</span>
          </button>

          <div class="text-center">
            <router-link to="/login" class="text-primary-600 hover:text-primary-500">
              Back to login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '../composables/useToast';
import { Mail, Key, Loader2 } from 'lucide-vue-next';
import api from '../services/api';

const email = ref('');
const loading = ref(false);
const { showToast } = useToast();

async function handleSubmit() {
  loading.value = true;
  try {
    await api.post('/api/auth/forgot-password', { email: email.value });
    showToast('If your email exists in our system, you will receive reset instructions', 'success');
    email.value = ''; // Clear form
  } catch (error) {
    showToast('Something went wrong. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
}
</script>