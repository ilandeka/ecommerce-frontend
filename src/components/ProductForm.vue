<template>
  <div class="product-form">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Product Name</label>
        <input
            v-model="product.name"
            type="text"
            required
            class="mt-1 py-2 pl-2 w-full p-2 border rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
            v-model="product.description"
            required
            class="mt-1 py-2 pl-2 w-full p-2 border rounded"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Price</label>
        <input
            v-model="product.price"
            type="number"
            step="0.01"
            required
            class="mt-1 py-2 pl-2 w-full p-2 border rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Stock Quantity</label>
        <input
            v-model="product.stockQuantity"
            type="number"
            required
            class="mt-1 py-2 pl-2 w-full p-2 border rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Product Image</label>
        <input
            type="file"
            @change="handleImageChange"
            accept="image/*"
            class="mt-1 block w-full"
        />
        <img
            v-if="imagePreview"
            :src="imagePreview"
            class="mt-2 h-32 w-32 object-cover rounded-md"
            alt=""/>
      </div>

      <div>
        <label class="flex items-center">
          <input
              v-model="product.available"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span class="ml-2">Available</span>
        </label>
      </div>

      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700
                   transition-colors disabled:bg-neutral-300 flex items-center justify-center space-x-2"
      >
        <span>{{ loading ? 'Creating...' : 'Create Product' }}</span>
        <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from "../services/api"
import { Loader2 } from "lucide-vue-next"
import { useToast } from '../composables/useToast'

// Initialize stores and composables
const authStore = useAuthStore()
const { showToast } = useToast()

// Form state
const product = ref({
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  available: true
})
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const loading = ref(false)

// Handle image selection
const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true

    // Create FormData object
    const formData = new FormData()
    formData.append('product', new Blob([JSON.stringify(product.value)], {
      type: 'application/json'
    }))

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    // Send request
    await api.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    });
// Reset form
    product.value = {
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      available: true
    }
    selectedImage.value = null
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
      imagePreview.value = null
    }

    showToast('Product created successfully!', 'success')
  } catch (error) {
    console.error('Error creating product:', error)
    showToast('Error creating product. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>