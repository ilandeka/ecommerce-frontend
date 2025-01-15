<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <UserPlus class="w-12 h-12 text-primary-600 mx-auto" />
          <h2 class="mt-4 text-3xl font-bold text-neutral-900">Create Account</h2>
          <p class="mt-2 text-neutral-600">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:text-primary-500">
              Sign in
            </router-link>
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-neutral-700">Full Name</label>
            <div class="mt-1 relative">
              <User class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="form.fullName"
                  type="text"
                  required
                  class="py-2 pl-10 w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700">Email</label>
            <div class="mt-1 relative">
              <Mail class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="form.email"
                  type="email"
                  required
                  class="py-2 pl-10 w-full p-2 border rounded"
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
                  minlength="8"
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
            <span>{{ loading ? 'Creating account...' : 'Create account' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-vue-next';

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