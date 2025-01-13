<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div class="flex items-center space-x-4">
          <div class="bg-black text-gold-500 p-4 rounded-full">
            <User class="w-8 h-8" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ profile?.fullName }}</h1>
            <p class="text-gray-600">{{ profile?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
                @click="activeTab = 'orders'"
                :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'orders'
                  ? 'border-gold-500 text-gold-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Orders History
            </button>
            <button
                @click="activeTab = 'settings'"
                :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'settings'
                  ? 'border-gold-500 text-gold-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Account Settings
            </button>
          </nav>
        </div>
      </div>

      <!-- Orders History -->
      <div v-if="activeTab === 'orders'" class="space-y-6">
        <!-- Sorting Controls -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-700">Sort Orders</h3>
            <div class="flex items-center space-x-4">
              <!-- Sort Field Selection -->
              <select
                  v-model="sortField"
                  @change="handleSortChange"
                  class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gold-500 focus:border-gold-500 rounded-md"
              >
                <option value="createdAt">Order Date</option>
                <option value="total">Total Amount</option>
                <option value="status">Status</option>
              </select>

              <!-- Sort Direction Toggle -->
              <button
                  @click="toggleSortDirection"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
              >
                <ArrowUp v-if="sortDirection === 'asc'" class="h-4 w-4 mr-2" />
                <ArrowDown v-else class="h-4 w-4 mr-2" />
                {{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}
              </button>
            </div>
          </div>
        </div>
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <Loader2 class="w-8 h-8 animate-spin text-gold-500" />
        </div>

        <!-- Orders List -->
        <div v-else-if="orders.length" class="space-y-4">
          <div v-for="order in orders" :key="order.id"
               class="bg-white rounded-lg shadow-sm overflow-hidden">
            <!-- Order Header -->
            <div class="border-b border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Order #{{ order.id }}</p>
                  <p class="text-sm text-gray-500">
                    {{ new Date(order.createdAt).toLocaleDateString() }}
                  </p>
                </div>
                <div class="flex items-center space-x-4">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    {
                      'bg-blue-100 text-blue-800': order.status === 'PROCESSING',
                      'bg-green-100 text-green-800': order.status === 'DELIVERED',
                      'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                      'bg-red-100 text-red-800': order.status === 'CANCELLED'
                    }
                  ]">
                    {{ order.status }}
                  </span>
                  <span class="text-xl font-bold text-gray-900">${{ order.total }}</span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="px-6 py-4">
              <div class="space-y-4">
                <div v-for="item in order.items" :key="item.productName"
                     class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ item.productName }}</p>
                      <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                    </div>
                  </div>
                  <p class="text-sm font-medium text-gray-900">${{ item.subtotal }}</p>
                </div>
              </div>
            </div>

            <!-- Shipping Details -->
            <div class="bg-gray-50 px-6 py-4">
              <div class="text-sm">
                <p class="font-medium text-gray-900">Shipping Address:</p>
                <p class="text-gray-600">{{ order.shippingInfo.fullName }}</p>
                <p class="text-gray-600">{{ order.shippingInfo.address }}</p>
                <p class="text-gray-600">
                  {{ order.shippingInfo.city }}, {{ order.shippingInfo.state }}
                  {{ order.shippingInfo.zipCode }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900">No orders yet</h3>
          <p class="mt-2 text-sm text-gray-500">
            Start shopping to see your orders here
          </p>
          <router-link
              to="/products"
              class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-night-900"
          >
            Browse Products
          </router-link>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <nav class="flex items-center space-x-2">
            <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page - 1"
                :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage === page - 1
                  ? 'bg-black text-gold-500'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Account Settings -->
      <div v-if="activeTab === 'settings'" class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">Change Password</h2>
        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Password</label>
            <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">New Password</label>
            <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="8"
                class="mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="8"
                class="mt-1 pl-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
import { ref, onMounted, watch } from 'vue';
import { User, ShoppingBag, Loader2, ArrowUp, ArrowDown } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';
import { orderService } from '../services/order.service';
import type { Order } from '../types/order';
import { profileService } from '../services/profile.service';

const activeTab = ref('orders');
const loading = ref(false);
const orders = ref<Order[]>([]);
const profile = ref<Profile | null>(null);
const passwordError = ref('');
const currentPage = ref(0);
const totalPages = ref(0);
const sortField = ref('createdAt');
const sortDirection = ref<'asc' | 'desc'>('desc');
const { showToast } = useToast();

interface Profile {
  fullName: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordForm = ref<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Function to fetch profile data
async function fetchProfile() {
  try {
    profile.value = await profileService.getProfile();
  } catch (error) {
    showToast('Failed to load profile', 'error');
  } finally {
    loading.value = false;
  }
}

// Function to handle sort field changes
function handleSortChange() {
  currentPage.value = 0; // Reset to first page when sorting changes
  fetchOrders();
}

// Function to toggle sort direction
function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  currentPage.value = 0; // Reset to first page when sorting changes
  fetchOrders();
}

async function fetchOrders() {
  loading.value = true;
  try {
    const response = await orderService.getMyOrders(
        currentPage.value,
        10, // page size
        `${sortField.value},${sortDirection.value}`
    );
    orders.value = response.content;
    totalPages.value = response.totalPages;
  } catch (error) {
    showToast('Failed to load orders', 'error');
  } finally {
    loading.value = false;
  }
}

// Initialize data when component mounts
onMounted(async () => {
  await fetchProfile(); // First fetch profile data
  await fetchOrders(); // Then fetch orders
});

// Watch for page changes
watch(currentPage, () => {
  fetchOrders();
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