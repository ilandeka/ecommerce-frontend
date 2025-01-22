<!-- ProfileView.vue -->
<template>
  <div class="bg-neutral-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Profile Header -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div v-if="loading" class="flex justify-center">
          <Loader2 class="w-8 h-8 animate-spin text-primary-600" />
        </div>

        <div v-else-if="profile" class="flex items-center space-x-4">
          <div class="bg-primary-600 text-white p-4 rounded-full">
            <User class="w-8 h-8" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900">{{ profile.fullName }}</h1>
            <p class="text-neutral-600">{{ profile.email }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="mb-8">
        <div class="border-b border-neutral-200">
          <nav class="flex space-x-8">
            <button
                @click="activeTab = 'orders'"
                :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'orders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              ]"
            >
              Orders History
            </button>
            <button
                @click="activeTab = 'settings'"
                :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              ]"
            >
              Account Settings
            </button>
            <!-- Admin Tab - Only show if user is admin -->
            <button
                v-if="isAdmin"
                @click="activeTab = 'admin'"
                :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === 'admin'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            ]"
            >
              Admin Dashboard
            </button>
          </nav>
        </div>
      </div>

      <!-- Orders History Tab -->
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
                  class="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-gold-500 focus:border-gold-500 rounded-md"
              >
                <option value="createdAt">Date</option>
                <option value="total">Amount</option>
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

        <!-- Orders List -->
        <div v-for="order in orders" :key="order.id"
             class="border bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Order Header -->
          <div class="border-b border-neutral-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-neutral-500">Order #{{ order.id }}</p>
                <p class="text-sm text-neutral-500">
                  {{ new Date(order.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  {
                    'bg-accent-100 text-accent-800': order.status === 'COMPLETED',
                    'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                    'bg-red-100 text-red-800': order.status === 'CANCELLED'
                  }
                ]">
                  {{ order.status }}
                </span>
                <span class="text-xl font-bold text-primary-600">${{ order.total }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.productName"
                   class="flex justify-between items-center">
                <div class="flex items-center">
                  <div>
                    <p class="text-sm font-medium text-neutral-900">{{ item.productName }}</p>
                    <p class="text-sm text-neutral-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <p class="text-sm font-medium text-neutral-900">${{ item.subtotal }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-neutral-50 px-6 py-4">
            <div class="text-sm">
              <p class="font-medium text-neutral-900">Shipping Address:</p>
              <p class="text-neutral-600">{{ order.shippingInfo.fullName }}</p>
              <p class="text-neutral-600">{{ order.shippingInfo.address }}</p>
              <p class="text-neutral-600">
                {{ order.shippingInfo.city }}, {{ order.shippingInfo.state }}
                {{ order.shippingInfo.zipCode }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!orders.length && !loading"
             class="text-center py-12 bg-white rounded-xl shadow-sm">
          <Package class="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-neutral-900">No orders yet</h3>
          <p class="mt-2 text-sm text-neutral-500">
            Start shopping to see your orders here
          </p>
          <router-link
              to="/products"
              class="mt-6 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                   text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            Browse Products
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page - 1"
              :class="[
                'px-4 py-2 rounded-lg border',
                currentPage === page - 1
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-neutral-200 hover:border-primary-500'
              ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold text-neutral-900 mb-6">Change Password</h2>
        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700">Current Password</label>
            <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="mt-1 pl-2 py-2 w-full p-2 border rounded"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700">New Password</label>
            <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="8"
                class="mt-1 pl-2 py-2 w-full p-2 border rounded"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700">Confirm New Password</label>
            <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="8"
                class="mt-1 pl-2 py-2 w-full p-2 border rounded"
            />
          </div>

          <div v-if="passwordError" class="text-red-600 text-sm">
            {{ passwordError }}
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700
                   transition-colors disabled:bg-neutral-300 flex items-center justify-center space-x-2"
          >
            <span>{{ loading ? 'Updating...' : 'Update Password' }}</span>
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          </button>
        </form>
      </div>

      <!-- Admin Dashboard Tab -->
      <div v-if="activeTab === 'admin'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-semibold text-neutral-900 mb-6">Product Management</h2>
          <ProductForm />
          <button
              @click="showProductModal = true"
              class="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg
                 hover:bg-primary-700 transition-colors"
          >
            <Plus class="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      <!-- Product Modal -->
      <Modal v-if="showProductModal" @close="showProductModal = false">
        <div class="p-6">
          <h2 class="text-xl font-bold text-neutral-900 mb-6">Add New Product</h2>

          <form @submit.prevent="handleProductSubmit" class="space-y-6">
            <ImageUpload
                v-model="productImage"
                default-image="/images/default-product.jpg"
                :alt="productForm.name"
            />

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700">Product Name</label>
                <input
                    v-model="productForm.name"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-neutral-300 shadow-sm
                       focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700">Product Description</label>
                <input
                    v-model="productForm.description"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-neutral-300 shadow-sm
                       focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700">Product Price</label>
                <input
                    v-model="productForm.price"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-neutral-300 shadow-sm
                       focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700">Product Stock</label>
                <input
                    v-model="productForm.stockQuantity"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-neutral-300 shadow-sm
                       focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700">Product Available</label>
                <input
                    v-model="productForm.available"
                    type="text"
                    required
                    class="mt-1 pl-2 py-2 block w-full rounded-lg border-neutral-300 shadow-sm
                       focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                  type="button"
                  @click="showProductModal = false"
                  class="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700
                     hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  :disabled="submitting"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
                     disabled:bg-neutral-300"
              >
                {{ submitting ? 'Creating...' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ArrowDown, ArrowUp, Loader2, Package, Plus, User } from 'lucide-vue-next';
import { useToast } from '../composables/useToast';
import { useAuthStore } from '../stores/auth';
import { orderService } from '../services/order.service';
import { profileService } from '../services/profile.service';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload.vue';
import Modal from '../components/Modal.vue';
import type { Order } from '../types/order';
import ProductForm from '../components/ProductForm.vue'

const authStore = useAuthStore();
const { showToast } = useToast();

const showProductModal = ref(false);
const productImage = ref<File | null>(null);
const submitting = ref(false);
const activeTab = ref('orders');
const loading = ref(false);
const orders = ref<Order[]>([]);
const profile = ref<Profile | null>(null);
const passwordError = ref('');

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(0);

// Sorting state
const sortField = ref('createdAt');
const sortDirection = ref<'asc' | 'desc'>('desc');

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

const productForm = ref({
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  available: true
});

// Check if user is admin
const isAdmin = computed(() => authStore.isAdmin());

async function handleProductSubmit() {
  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productForm.value));
    if (productImage.value) {
      formData.append('image', productImage.value);
    }

    await api.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    showToast('Product created successfully', 'success');
    showProductModal.value = false;
    // Reset form
    productForm.value = {
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      available: true
    };
    productImage.value = null;
  } catch (error) {
    showToast('Failed to create product', 'error');
  } finally {
    submitting.value = false;
  }
}

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
        pageSize.value,
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