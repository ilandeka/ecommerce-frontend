<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="bg-blue-600 text-white p-4 rounded-full">
            <User class="w-8 h-8" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ profile?.fullName }}</h1>
            <p class="text-gray-600">{{ profile?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-6">Change Password</h2>
        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Password</label>
            <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">New Password</label>
            <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="8"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="8"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div v-if="passwordError" class="text-red-600 text-sm">
            {{ passwordError }}
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {User} from 'lucide-vue-next';
import {useToast} from '../composables/useToast';
import {profileService} from '../services/profile.service';

interface Profile {
  fullName: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const { showToast } = useToast();
const loading = ref(false);
const profile = ref<Profile | null>(null);
const passwordError = ref('');

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(async () => {
  try {
    profile.value = await profileService.getProfile();
  } catch (error) {
    showToast('Failed to load profile', 'error');
  }
});

async function handlePasswordChange() {
  // Reset error state
  passwordError.value = '';

  // Validate passwords match
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  loading.value = true;
  try {
    await profileService.changePassword(
        passwordForm.value.currentPassword,
        passwordForm.value.newPassword,
        passwordForm.value.confirmPassword
    );

    showToast('Password updated successfully', 'success');
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error: any) {
    passwordError.value = error.response?.data?.message || 'Failed to update password';
  } finally {
    loading.value = false;
  }
}
</script>