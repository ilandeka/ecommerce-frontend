<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4">
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <KeyRound class="w-12 h-12 text-primary-600 mx-auto" />
          <h2 class="mt-4 text-3xl font-bold text-neutral-900">Reset Password</h2>
          <p class="mt-2 text-neutral-600">
            Enter your new password and confirm password below.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-neutral-700">New Password</label>
            <div class="mt-1 relative">
              <Lock class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="form.newPassword"
                  type="password"
                  required
                  class="py-2 pl-10 w-full border rounded"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700">Confirm Password</label>
            <div class="mt-1 relative">
              <LockKeyhole class="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  class="py-2 pl-10 w-full border rounded"
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
            <span>{{ loading ? 'Saving...' : 'Save Password' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import api from '../services/api';
import { KeyRound, Lock, LockKeyhole, Loader2 } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const form = reactive({
  token: '',
  newPassword: '',
  confirmPassword: ''
});
const loading = ref(false);

onMounted(() => {
  // Get token from URL query parameter
  form.token = route.query.token as string;
  if (!form.token) {
    showToast('Invalid reset link', 'error');
    router.push('/login');
  }
});

async function handleSubmit() {
  if (form.newPassword !== form.confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  loading.value = true;
  try {
    await api.post('/api/auth/reset-password', form);
    showToast('Password successfully reset', 'success');
    await router.push('/login');
  } catch (error) {
    showToast('Failed to reset password. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
}
</script>