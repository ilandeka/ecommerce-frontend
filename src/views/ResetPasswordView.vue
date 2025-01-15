<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Reset Password</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">New Password</label>
        <input
            v-model="form.newPassword"
            type="password"
            required
            class="w-full p-2 border rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Confirm Password</label>
        <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full p-2 border rounded"
        />
      </div>
      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-600 text-white p-2 rounded"
      >
        {{ loading ? 'Saving...' : 'Save Password' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import api from '../services/api';

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