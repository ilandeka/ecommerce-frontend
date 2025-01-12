<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center">
        <ShoppingBag class="w-12 h-12 text-gold-500 mx-auto" />
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-night-600 hover:text-night-500">
            Sign in
          </router-link>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1 relative">
              <User class="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                  v-model="form.fullName"
                  type="text"
                  required
                  class="pl-10 block w-full py-2 border-2 border-gray-200 rounded-lg focus:ring-night-500 focus:border-night-500 transition-colors duration-200"
              />
            </div>
          </div>

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
                  minlength="8"
                  class="pl-10 block w-full py-2 border-2 border-gray-200 rounded-lg focus:ring-night-500 focus:border-night-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-black hover:bg-night-900 focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
        >
          <Loader2 v-if="loading" class="animate-spin h-5 w-5" />
          <span v-else>Create Account</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import { ShoppingBag, User, Mail, Lock, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();

const loading = ref(false);

const form = reactive({
  fullName: '',
  email: '',
  password: '',
});

async function handleSubmit() {
  loading.value = true;
  try {
    await authStore.register(form.fullName, form.email, form.password);
    showToast('Registration successful', 'success');
    await router.push('/');
  } catch (error: any) {
    showToast(error.response?.data?.message || 'Registration failed', 'error');
  } finally {
    loading.value = false;
  }
}
</script>