<template>
  <div class="relative">
    <img
        :src="previewUrl || defaultImage"
        :alt="alt"
        class="w-full h-48 object-cover rounded-lg"
    />

    <input
        type="file"
        @change="handleImageChange"
        accept="image/*"
        class="hidden"
        ref="fileInput"
    />

    <button
        @click="$refs.fileInput.click()"
        class="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg
             hover:bg-gray-50 transition-colors duration-200"
    >
      <Upload class="w-5 h-5 text-gray-600" />
    </button>

    <!-- Loading overlay -->
    <div v-if="uploading"
         class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Loader2 class="w-8 h-8 animate-spin text-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Upload, Loader2 } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: File | null;
  currentImageUrl?: string;
  defaultImage?: string;
  alt?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const previewUrl = ref<string>('');
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

watch(() => props.currentImageUrl, (newUrl) => {
  if (newUrl) {
    previewUrl.value = newUrl;
  }
}, { immediate: true });

async function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Create preview
  previewUrl.value = URL.createObjectURL(file);
  emit('update:modelValue', file);

  // Clean up
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
</script>